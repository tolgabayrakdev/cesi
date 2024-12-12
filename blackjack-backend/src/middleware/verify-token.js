import jsonwebtoken from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.cookies.access_token;
    if (!authHeader) {
      res.status(401).json({
        message: 'Gecersiz Token. Lütfen Oturum Açın.',
      });
    }
    jsonwebtoken.verify(
      authHeader,
      process.env.JWT_SECRET_KEY || 'secret',
      (err, user) => {
        if (err) {
          res.status(403).json({
            message: 'Gecersiz Token. Lütfen Yeniden Oturum Açın.',
          });
        }
        req.user = user;
        next();
      },
    );
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
