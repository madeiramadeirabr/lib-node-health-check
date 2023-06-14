import { HashMapMemory } from '../hash-map-memory';

describe('HashMapMemory', () => {
  let hashMapMemory: HashMapMemory;

  beforeEach(() => {
    hashMapMemory = new HashMapMemory();
  });

  afterEach(() => {
    hashMapMemory.clear();
  });

  it('should set and get values correctly', () => {
    const key = 'testKey';
    const value = 'testValue';

    hashMapMemory.set(key, value);
    const retrievedValue = hashMapMemory.get(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should return undefined for non-existent keys', () => {
    const key = 'nonExistentKey';
    const retrievedValue = hashMapMemory.get(key);

    expect(retrievedValue).toBeUndefined();
  });

  it('should return all values as an array', () => {
    const values = ['value1', 'value2', 'value3'];

    values.forEach((value, index) => {
      hashMapMemory.set(`key${index}`, value);
    });

    const retrievedValues = hashMapMemory.all();

    expect(retrievedValues).toEqual(values);
  });

  it('should clear all values', () => {
    hashMapMemory.set('key1', 'value1');
    hashMapMemory.set('key2', 'value2');

    hashMapMemory.clear();

    const retrievedValues = hashMapMemory.all();

    expect(retrievedValues).toHaveLength(0);
  });
});
