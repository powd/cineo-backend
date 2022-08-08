import { generateId } from './generate-id';

describe('generate-id', () => {
  it('should be a function', () => {
    // Then
    expect(generateId).toEqual(expect.any(Function));
  });
});
