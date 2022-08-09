import * as crypto from 'crypto';

export const ALLOWED_CHARACTERS =
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
export const ID_LENGTH = 28;
export const MINIMAL_RANDOM_INT = 0;
export const MAXIMAL_RANDOM_INT = ALLOWED_CHARACTERS.length;

export function generateId() {
  const randomAllowedCharacters = Array.from({ length: ID_LENGTH }).map(() => {
    const characterIndex = crypto.randomInt(0, ALLOWED_CHARACTERS.length);
    return ALLOWED_CHARACTERS[characterIndex];
  });
  return randomAllowedCharacters.join('');
}
