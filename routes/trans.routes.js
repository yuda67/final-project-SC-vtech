import {Router} from "express";
import requireAuth from "../middleware/auth.middleware.js";
import { tambahSaldo, tarikSaldo, getTransLog } from "../controllers/trans.controller.js";

const router = Router();



router.route('/tambah-saldo').post(requireAuth, tambahSaldo);
router.route('/tarik-saldo').post(requireAuth, tarikSaldo);
router.route('/log').get(requireAuth, getTransLog);

export default router;