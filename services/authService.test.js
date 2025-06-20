const authService = require('./authService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authService', () => {
  const fakeUser = {
    id: 1,
    username: 'test',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  LOGIN TESTS
  describe('loginUser', () => {
    it('devrait retourner un utilisateur si email et mot de passe sont valides', async () => {
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.loginUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', fakeUser.password);
      expect(result).toEqual(fakeUser);
    });

    it('devrait échouer si l’utilisateur est introuvable', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.loginUser({
        email: 'noone@example.com',
        password: 'xxx',
      })).rejects.toThrow('USER_NOT_FOUND');
    });

    it('devrait échouer si le mot de passe est invalide', async () => {
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.loginUser({
        email: 'test@example.com',
        password: 'wrongpass',
      })).rejects.toThrow('INVALID_PASSWORD');
    });
  });

  //  REGISTER TESTS
  describe('registerUser', () => {
    it('devrait créer un nouvel utilisateur si email non utilisé', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed-password-123');
      const createdUser = { id: 2, email: 'new@example.com' };
      User.create.mockResolvedValue(createdUser);

      const result = await authService.registerUser({
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpass',
      });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(User.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed-password-123',
      });
      expect(result).toEqual(createdUser);
    });

    it('devrait échouer si l’email est déjà utilisé', async () => {
      User.findOne.mockResolvedValue(fakeUser);

      await expect(authService.registerUser({
        username: 'x',
        email: 'test@example.com',
        password: 'x',
      })).rejects.toThrow('EMAIL_EXISTS');
    });
  });

  //  TOKEN TESTS
  describe('generateToken', () => {
    it('devrait générer un token JWT', () => {
      const fakeToken = 'FAKETOKEN';
      jwt.sign.mockReturnValue(fakeToken);

      process.env.JWT_SECRET = 'secret123';
      const result = authService.generateToken({ id: 1 });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        'secret123',
        { expiresIn: '7d' }
      );
      expect(result).toBe(fakeToken);
    });
  });
});
