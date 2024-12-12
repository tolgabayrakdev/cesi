import Crypto from 'crypto';

class PasswordHelper {
  hashPassword(password) {
    return Crypto.createHash('sha256').update(password).digest('base64');
  }

  verifyPassword(password, hashedPassword) {
    return this.hashPassword(hashedPassword(password)) === hashedPassword;
  }
}

export default PasswordHelper;
