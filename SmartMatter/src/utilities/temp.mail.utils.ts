import { generateRandomAlphanumeric } from './random.utils';

export interface TempMailInbox {
    address: string;
    token: string;
}

export interface TempMailMessage {
    id: string;
    subject?: string;
}

interface MailTmCollection<T> {
    'hydra:member'?: T[];
}

interface MailTmDomain {
    domain: string;
}

interface MailTmTokenResponse {
    token?: string;
}

interface MailTmMessageDetail {
    html?: string | string[];
    subject?: string;
    text?: string;
}

const MAIL_TM_API = 'https://api.mail.tm';
const DEFAULT_OTP_TIMEOUT_MS = 90000;
const OTP_POLL_INTERVAL_MS = 3000;

/**
 * Creates a disposable mail.tm inbox for receiving verification emails
 */
export async function createTempMailInbox(): Promise<TempMailInbox> {
    const domainsResponse = await fetch(`${MAIL_TM_API}/domains`);
    const domainsBody = (await domainsResponse.json()) as MailTmCollection<MailTmDomain>;
    const domain = domainsBody['hydra:member']?.[0]?.domain;
    if (!domain) {
        throw new Error('Unable to create a temporary mailbox: no mail.tm domain was returned.');
    }

    let lastError = 'Unable to create a temporary mailbox.';
    for (let attempt = 1; attempt <= 5; attempt++) {
        const address = `qa${generateRandomAlphanumeric(10).toLowerCase()}@${domain}`;
        const password = `Temp${generateRandomAlphanumeric(10)}!`;

        const createResponse = await fetch(`${MAIL_TM_API}/accounts`, {
            body: JSON.stringify({ address, password }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
        if (!createResponse.ok) {
            lastError = await createResponse.text();
            await delay(2000 * attempt);
            continue;
        }

        const tokenResponse = await fetch(`${MAIL_TM_API}/token`, {
            body: JSON.stringify({ address, password }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
        const tokenBody = (await tokenResponse.json()) as MailTmTokenResponse;
        if (!tokenResponse.ok || !tokenBody.token) {
            lastError = 'Unable to authenticate the temporary mailbox.';
            await delay(2000 * attempt);
            continue;
        }

        return { address, token: tokenBody.token };
    }

    throw new Error(`Unable to create a temporary mailbox: ${lastError}`);
}

/**
 * Returns the current messages in the temporary inbox
 */
export async function getInboxMessages(inbox: TempMailInbox): Promise<TempMailMessage[]> {
    const messagesResponse = await fetch(`${MAIL_TM_API}/messages`, {
        headers: { Authorization: `Bearer ${inbox.token}` },
    });
    const messagesBody = (await messagesResponse.json()) as MailTmCollection<TempMailMessage>;
    return messagesBody['hydra:member'] ?? [];
}

/**
 * Reads a mailbox message and extracts the 6-digit OTP
 */
export async function getOtpFromMessage(inbox: TempMailInbox, messageId: string): Promise<string> {
    const messageResponse = await fetch(`${MAIL_TM_API}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${inbox.token}` },
    });
    const message = (await messageResponse.json()) as MailTmMessageDetail;
    const html = Array.isArray(message.html) ? message.html.join(' ') : message.html ?? '';
    const emailText = `${message.text ?? ''} ${html} ${message.subject ?? ''}`;
    const otpMatch = emailText.match(/\b(\d{6})\b/);
    if (!otpMatch) {
        throw new Error(`A 6-digit OTP was not found in mailbox message ${messageId}.`);
    }
    return otpMatch[1];
}

/**
 * Waits for a Consentz verification email and returns the 6-digit OTP
 */
export async function waitForEmailOtp(
    inbox: TempMailInbox,
    timeoutMs: number = DEFAULT_OTP_TIMEOUT_MS,
): Promise<string> {
    const message = await waitForInboxMessage(inbox, [], timeoutMs);
    return getOtpFromMessage(inbox, message.id);
}

/**
 * Waits for a new mailbox message that is not in the known message id list
 */
export async function waitForInboxMessage(
    inbox: TempMailInbox,
    excludedMessageIds: string[] = [],
    timeoutMs: number = DEFAULT_OTP_TIMEOUT_MS,
): Promise<TempMailMessage> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const messages = await getInboxMessages(inbox);
        const nextMessage = messages.find((message) => !excludedMessageIds.includes(message.id));
        if (nextMessage) {
            return nextMessage;
        }
        await delay(OTP_POLL_INTERVAL_MS);
    }

    throw new Error(`OTP email was not received at ${inbox.address} within ${timeoutMs}ms.`);
}

async function delay(milliseconds: number): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
