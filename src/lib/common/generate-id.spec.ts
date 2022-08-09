import {
  generateId,
  ALLOWED_CHARACTERS,
  ID_LENGTH,
  MINIMAL_RANDOM_INT,
  MAXIMAL_RANDOM_INT,
} from './generate-id';
import * as crypto from 'crypto';

jest.mock('crypto');

type CryptoWithSelectedOverloads = Omit<typeof crypto, 'randomInt'> & {
  randomInt: (min: number, max: number) => number;
};

const mockedCrypto = crypto as any as jest.Mocked<CryptoWithSelectedOverloads>;

describe('generateId', () => {
  function mockReturnValuesForRandomInt() {
    const pseudorandomIntegers = [
      5, 47, 46, 7, 0, 7, 22, 50, 21, 27, 36, 35, 48, 50, 38, 26, 14, 39, 27,
      29, 13, 34, 21, 48, 38, 21, 6, 30, 40, 7, 4, 6, 9, 45, 3, 59, 45, 57, 32,
      43, 22, 15, 6, 20, 45, 58, 47, 30, 33, 11, 6, 59, 20, 47, 32, 45, 42, 51,
      30, 14, 6, 19, 22, 2, 20, 19, 54, 17, 57, 48, 2, 25, 34, 42, 16, 20, 37,
      28, 9, 35, 40, 19, 26, 14, 1, 17, 49, 56, 32, 49, 10, 15, 50, 56, 15, 22,
      48, 47, 52, 15,
    ];
    pseudorandomIntegers.forEach((integer) =>
      mockedCrypto.randomInt.mockReturnValueOnce(integer),
    );
  }

  it('should use correctly tweaked parameters', () => {
    // Then
    expect(ID_LENGTH).toBeGreaterThan(0);
    expect(MINIMAL_RANDOM_INT).toBeLessThanOrEqual(MAXIMAL_RANDOM_INT);
    expect(ALLOWED_CHARACTERS.length).toBe(MAXIMAL_RANDOM_INT);
  });

  it("should not use '0' character to avoid leading zeros when interpreted numerically", () => {
    // Then
    expect(ALLOWED_CHARACTERS).not.toContain('0');
  });

  it('should not use similar characters that might confuse the human reader', () => {
    // Given
    const allowedCharacterContains = (character: string) =>
      ALLOWED_CHARACTERS.indexOf(character) !== -1;

    // Then
    expect(allowedCharacterContains('I') && allowedCharacterContains('l')).toBe(
      false,
    );
    expect(allowedCharacterContains('0') && allowedCharacterContains('O')).toBe(
      false,
    );
  });

  it('should generate ids of just enough length to beat git oids (commit hashes) in terms of cardinality', () => {
    // Given
    const justEnoughLength = ID_LENGTH;
    const justNotEnoughLength = ID_LENGTH - 1;
    const gitOidCardinality = 16 ** 40; // git v2.36.1 generates oids of 40 characters, each character being a hexadecimal (16) value
    const justEnoughCardinality =
      (MAXIMAL_RANDOM_INT - MINIMAL_RANDOM_INT) ** justEnoughLength;
    const justNotEnoughCardinality =
      (MAXIMAL_RANDOM_INT - MINIMAL_RANDOM_INT) ** justNotEnoughLength;

    // Then
    expect(justEnoughCardinality).toBeGreaterThanOrEqual(gitOidCardinality);
    expect(justNotEnoughCardinality).toBeLessThan(gitOidCardinality);
  });

  it('should satisfy mathematical contract', () => {
    // Given
    const someRandomInteger = 0;
    mockedCrypto.randomInt.mockReturnValue(someRandomInteger);

    // When
    const id = generateId();

    // Then
    expect(mockedCrypto.randomInt).toHaveBeenCalledWith(
      MINIMAL_RANDOM_INT,
      MAXIMAL_RANDOM_INT,
    );
    expect(id.length).toBe(ID_LENGTH);
  });

  it('should generate id matching snapshot', () => {
    // Given
    mockReturnValuesForRandomInt();

    // When
    const id = generateId();

    // Then
    expect(id).toEqual('6NM818nQmsBAOQDrfEsuezmODm7v');
  });
});
