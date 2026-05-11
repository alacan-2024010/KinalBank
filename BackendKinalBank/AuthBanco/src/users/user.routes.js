'use strict';
console.log('User routes loaded');
import { Router } from 'express';
import {
  getPendingUsers,
  getApprovedUsers,
  approveUser,
  denyUser,
  getUsersByIds,
  getMyProfile, 
  updateMyProfile
} from './user.controller.js';

import { validateJWT }   from '../../middlewares/validate-JWT.js';
import { validateAdmin } from '../../middlewares/validate-role.js';

const router = Router();

// Test directo
router.put('/me-direct', (req, res) => {
    res.json({ ok: true });
});

router.get('/me', validateJWT, getMyProfile);

router.put('/me', (req, res) => {
    res.json({ ok: true, msg: 'sin middleware' });
});

// Ver pendientes (admin)
router.get('/pending', validateJWT, validateAdmin, getPendingUsers);

// Ver aprobados
router.get('/approved', validateJWT, validateAdmin, getApprovedUsers);

// Aprobar
router.put('/approve', validateJWT, validateAdmin, approveUser);

// Denegar
router.delete('/deny/:id', validateJWT, validateAdmin, denyUser);

// Por IDs
router.post('/by-ids', validateJWT, validateAdmin, getUsersByIds);

export default router;