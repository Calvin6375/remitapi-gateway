import { encrypt, decrypt } from '../src/utils/encryption.js';

describe('Encryption Utilities', () => {
  it('should encrypt and decrypt text correctly', () => {
    const plainText = 'Sensitive transaction data';
    const encrypted = encrypt(plainText);
    const decrypted = decrypt(encrypted);
    
    expect(decrypted).toBe(plainText);
  });

  it('should produce different ciphertexts for same plaintext', () => {
    const plainText = 'Same data';
    const encrypted1 = encrypt(plainText);
    const encrypted2 = encrypt(plainText);
    
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should properly format encrypted data with IV', () => {
    const plainText = 'Test data';
    const encrypted = encrypt(plainText);
    
    expect(encrypted).toContain(':');
    const [iv, ciphertext] = encrypted.split(':');
    expect(iv).toHaveLength(32); // 16 bytes in hex
    expect(ciphertext.length).toBeGreaterThan(0);
  });
});
