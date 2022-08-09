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
      18, 15, 41, 6, 30, 13, 13, 52, 13, 51, 14, 38, 30, 17, 52, 30, 33, 40, 53,
      20, 41, 2, 52, 22, 29, 6, 24, 43, 34, 4, 9, 32, 41, 21, 51, 56, 41, 30, 4,
      28, 7, 13, 12, 17, 12, 47, 47, 33, 31, 37, 25, 22, 44, 33, 37, 36, 5, 15,
      14, 16, 24, 50, 14, 35, 51, 45, 19, 36, 48, 0, 1, 13, 39, 36, 9, 46, 30,
      43, 49, 6, 38, 9, 24, 56, 13, 12, 28, 18, 10, 42, 17, 25, 25, 10, 17, 2,
      22, 47, 19, 7,
    ];
    expect(
      pseudorandomIntegers.every(
        (p) => MINIMAL_RANDOM_INT <= p && p < MAXIMAL_RANDOM_INT,
      ),
    ).toEqual(true);
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
    // Then
    expect(ALLOWED_CHARACTERS).not.toContain('I');
    expect(ALLOWED_CHARACTERS).not.toContain('l');

    expect(ALLOWED_CHARACTERS).not.toContain('0');
    expect(ALLOWED_CHARACTERS).not.toContain('O');
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
    expect(id).toEqual('jgH7weeUeTfEwiUwzGVmH3Uov7qK');
  });
});
