'use strict';
console.log('User routes loaded');
import { Router } from 'express';
import {
  getPendingUsers,
  getApprovedUsers,
  approveUser,
  denyUser,
} from './user.controller.js';

import { validateJWT }   from '../../middlewares/validate-JWT.js';
import { validateAdmin } from '../../middlewares/validate-role.js';

const router = Router();

// Ver pendientes (admin)
router.get('/pending',  validateJWT, validateAdmin, getPendingUsers);

// Ver aprobados — para selector de propietario al crear cuenta (admin)
router.get('/approved', validateJWT, validateAdmin, getApprovedUsers);

// Aprobar
router.put('/approve',  validateJWT, validateAdmin, approveUser);

// Denegar (elimina la solicitud)
router.delete('/deny/:id', validateJWT, validateAdmin, denyUser);

export default router;