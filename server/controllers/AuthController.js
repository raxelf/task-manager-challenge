const { createToken } = require("../utils/jwt");
const { comparePassword } = require("../utils/bcrypt");
const { User } = require("../models");

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "Account registered successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw new Error("INVALID_CREDENTIALS");

      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) throw new Error("INVALID_CREDENTIALS");

      if (!comparePassword(password, foundUser.password))
        throw new Error("INVALID_CREDENTIALS");

      const payload = {
        id: foundUser.id,
      };

      const token = createToken(payload);

      res.status(200).json({
        success: true,
        message: "Login success.",
        access_token: token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
