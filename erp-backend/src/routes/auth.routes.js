const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post("/login", auth.login);
router.post("/verify-otp", auth.verifyOtp);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);

router.post("/register", authMiddleware, roleMiddleware("admin"), auth.register);

module.exports = router;
