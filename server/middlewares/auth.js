const auth = async (req, res, next) => {
  try {
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
