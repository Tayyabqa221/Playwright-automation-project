export function getStorageStatePath(name: string): string {
  const paths: { [key: string]: string } = {
    
   underwriterTechnician: './src/cookies/technician.json',
  };

  const path = paths[name];
  if (!path) {
    throw new Error(`No storage state path found for: ${name}`);
  }
  return path;
}
