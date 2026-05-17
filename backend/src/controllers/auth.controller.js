class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  signup = async (req, res, next) => {
    try {
      const user = await this.authService.signup(req.body);
      res
        .status(201)
        .json({
          message: "Signup submitted and waiting for admin approval",
          user,
        });
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res) => {
    res.json({ user: req.user });
  };

  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
      );
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
