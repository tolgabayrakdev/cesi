import jsonwebtoken from 'jsonwebtoken';
import HttpException from '../exceptions/http-exception.js';

class TokenHelper {
  generateAccessToken(payload) {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY || 'secret', {
      expiresIn: '30m',
    });
  }
  verifyAccessToken(token) {
    try {
      const decoded = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET_KEY || 'secret',
      );
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          401,
          'Token süresi dolmuş. Lütfen tekrar oturum açın.',
        );
      } else if (error.name === 'JsonWebTokenError') {
        throw new HttpException(401, 'Geçersiz token. Lütfen oturum açın.');
      } else {
        throw new HttpException(500, 'Token doğrulanırken bir hata oluştu.');
      }
    }
  }
}
export default TokenHelper;
