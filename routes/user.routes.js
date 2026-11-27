import {Router} from "express";
import {
    registerUser,
    loginUser,
    seeProfile,
    updateTargetTabungan,
    deleteUser
} from "../controllers/user.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile/me').get(requireAuth, seeProfile);
router.route('/profile/ubah-target').patch(requireAuth, updateTargetTabungan);
router.route('/profile/delete').delete(requireAuth, deleteUser);

export default router;

