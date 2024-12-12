import AuthService from '../service/auth-service.js';
import HttpException from '../exceptions/http-exception.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.cookie('access_token', result.accessToken, { httpOnly: true });
      res.status(200).json({ accessToken: result.accessToken });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      await this.authService.register(username, email, password);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async verifyUser(req, res) {
    try {
      const token = req.cookies.access_token;
      const user = await this.authService.verifyUser(token);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async logout(_req, res) {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logout successful' });
  }
}
