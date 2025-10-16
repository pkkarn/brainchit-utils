const authenticateKey = (req, res, next) => {
  const masterKey = req.headers['x-master-key'] || req.headers['authorization'];

  if (!masterKey) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: No master key provided'
    });
  }

  if (masterKey !== process.env.MASTER_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed: Invalid master key'
    });
  }

  next();
};

module.exports = authenticateKey;
