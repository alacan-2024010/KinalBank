'use strict';

import { Router } from 'express';
import { register, login , forgotPassword } from './auth.controller.js';
import { validateJWT } from "../../middlewares/validate-JWT.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put("/forgot-password", forgotPassword);
export default router;
