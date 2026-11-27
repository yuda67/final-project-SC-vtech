import {Router} from "express";
import {
    registerUser,
    loginUser,
    seeProfile,
    tambahSaldo} from "../controllers/user.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile/me').get(requireAuth, seeProfile);
router.route('/tambah-saldo').post(requireAuth, tambahSaldo);

export default router;

