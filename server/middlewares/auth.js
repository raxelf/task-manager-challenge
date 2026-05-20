const { verifyToken } = require("../utils/jwt");

const auth = async (req, _res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("UNAUTHORIZED");

    // split "Bearer + (token)", take the token
    const token = authorization.split(" ")[1];
    if (!token) throw new Error("UNAUTHORIZED");

    const payload = verifyToken(token);
    if (!payload) throw new Error("UNAUTHORIZED");

    // forward the authenticated user id
    req.authenticatedUser = {
      id: payload.id,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
