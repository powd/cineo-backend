import * as crypto from 'crypto';

export function generateId() {
  const allCharacters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const confusingCharacters = '0I'.split('');
  const allowedCharacters = allCharacters.filter((character) =>
    confusingCharacters.every(
      (confusingCharacter) => confusingCharacter != character,
    ),
  );
  const idCharLength = 28;

  const randomAllowedCharacters = Array.from({ length: idCharLength }).map(
    () => {
      const characterIndex = crypto.randomInt(allowedCharacters.length);
      return allowedCharacters[characterIndex];
    },
  );

  return randomAllowedCharacters.join('');
}
