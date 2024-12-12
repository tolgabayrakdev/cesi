import pool from '../config/database.js';
import TokenHelper from '../helper/token-helper.js';
import PasswordHelper from '../helper/password-helper.js';
import HttpException from '../exceptions/http-exception.js';

export default class AuthService {
  constructor() {
    this.passwordHelper = new PasswordHelper();
    this.tokenHelper = new TokenHelper();
  }

  async login(email, password) {
    const client = await pool.connect();
    try {
      const hashedPassword = this.passwordHelper.hashPassword(password);
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, hashedPassword],
      );
      if (result.rows.length === 0) {
        throw new HttpException(401, 'Invalid email or password');
      }
      const user = result.rows[0];
      const accessToken = this.tokenHelper.generateAccessToken({
        id: user.id,
      });
      return { accessToken };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async register(username, email, password) {
    const client = await pool.connect();
    try {
      const hashedPassword = this.passwordHelper.hashPassword(password);
      const result = await client.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword],
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async verifyUser(token) {
    const client = await pool.connect();
    try {
      const decoded = this.tokenHelper.verifyAccessToken(token);
      const result = await client.query('SELECT * FROM users WHERE id = $1', [
        decoded.id,
      ]);
      if (result.rows.length === 0) {
        throw new HttpException(401, 'User not found');
      }
      return {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
      };
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
