import { generateToken, verifyToken } from '../src/utils/jwt.js';

describe('JWT Utilities', () => {
  it('should generate a valid JWT token', () => {
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1';
    const token = generateToken(userId);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid JWT token', () => {
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1';
    const token = generateToken(userId);
    const decoded = verifyToken(token);
    
    expect(decoded.userId).toBe(userId);
  });

  it('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid.token.here');
    }).toThrow('Invalid or expired token');
  });
});
