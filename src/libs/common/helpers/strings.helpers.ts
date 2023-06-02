export function upFirst(str: string): string {
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

export function underscoreToCamelCase(str: string): string {
  const parts = str.split(/[-_]/g);
  return parts[0].toLowerCase() + parts.slice(1).map(upFirst);
}

export const did = () => {
  const alphaBettaNumber = ['a', 'b', 'c', 'e', 'f', 0, 1, 2, 3, 4, 5 ,6 , 7, 8, 9];
  const address = [];
  for(let i = 0; i < 64; i++) {
    address.push(alphaBettaNumber[Math.floor( Math.random()*(alphaBettaNumber.length-1))])
  }
  return `did:venom:0:${address.join('')}`;
}
