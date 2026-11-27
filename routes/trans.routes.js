import {Router} from "express";
import requireAuth from "../middleware/auth.middleware.js";
import { tambahSaldo } from "../controllers/trans.controller.js";

const router = Router();



router.route('/tambah-saldo').post(requireAuth, tambahSaldo);


export default router;