const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateId(prefix: string = ''): string {
  const now = Date.now().toString(36);
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return prefix ? `${prefix}_${now}_${rand}` : `${now}_${rand}`;
}
