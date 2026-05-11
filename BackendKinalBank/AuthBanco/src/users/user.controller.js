'use strict';

import { User } from './user.model.js';
import { Role } from '../auth/role.model.js';


// Ver usuarios pendientes (solo admin)
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { Status: false },
      attributes: { exclude: ['Password'] },
      include: { model: Role, as: 'role' },
    });

    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios pendientes' });
  }
};


// Ver usuarios aprobados — para el selector al crear cuentas (solo admin)
export const getApprovedUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;

    const { Op } = await import('sequelize');

    const where = { Status: true };

    if (search.trim()) {
      where[Op.or] = [
        { Name: { [Op.like]: `%${search}%` } },
        { DPI:  { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: ['Id', 'Name', 'DPI', 'Email'],
      limit: 20,
      order: [['Name', 'ASC']],
    });

    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios aprobados' });
  }
};


// Aprobar usuario
export const approveUser = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const roleDb = await Role.findOne({ where: { Name: role } });
    if (!roleDb) {
      return res.status(400).json({ success: false, message: 'Rol inválido' });
    }

    user.RoleId = roleDb.Id;
    user.Status = true;
    await user.save();

    return res.json({ success: true, message: 'Usuario aprobado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al aprobar usuario' });
  }
};


// Denegar usuario — elimina la solicitud pendiente
export const denyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (user.Status === true) {
      return res.status(400).json({
        success: false,
        message: 'No se puede denegar un usuario ya aprobado',
      });
    }

    await user.destroy();

    return res.json({ success: true, message: 'Solicitud denegada y eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al denegar usuario' });
  }
};

// Obtener usuarios por lista de IDs (uso interno entre servicios)
export const getUsersByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'ids debe ser un array' });
    }

    const { Op } = await import('sequelize');

    const users = await User.findAll({
      where: { Id: { [Op.in]: ids } },
      attributes: ['Id', 'Name', 'Username', 'Email', 'DPI', 'Phone', 'Job', 'MonthlyIncome'],
    });

    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios por IDs' });
  }
};

// Editar perfil propio (cliente)
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // viene del JWT

    const { Name, Address, Job, MonthlyIncome } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (Name)          user.Name          = Name;
    if (Address)       user.Address       = Address;
    if (Job)           user.Job           = Job;
    if (MonthlyIncome) user.MonthlyIncome = MonthlyIncome;

    await user.save();

    return res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: {
        Id:           user.Id,
        Name:         user.Name,
        Username:     user.Username,
        Email:        user.Email,
        Address:      user.Address,
        Job:          user.Job,
        MonthlyIncome: user.MonthlyIncome,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

// Obtener perfil propio (cliente)
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['Password'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener perfil' });
  }
};