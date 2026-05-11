'use strict';

import mongoose from 'mongoose';
import Product from './product.model.js';

// ─── CREAR PRODUCTO / SERVICIO (ADMIN) ───
export const createProduct = async (req, res) => {
  try {
    const { name, description, type, price, status } = req.body;

    if (!name || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const product = await Product.create({
      name,
      description,
      type,
      price: price || 0,
      status: status ?? true,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      product
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear producto'
    });
  }
};

// ─── OBTENER TODOS LOS PRODUCTOS (PUBLICO / ADMIN) ───
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true });
    return res.json({ success: true, products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
};

// ─── ACTUALIZAR PRODUCTO (ADMIN) ───
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    Object.assign(product, req.body); // actualizar solo los campos enviados
    await product.save();

    return res.json({ success: true, message: 'Producto actualizado correctamente', product });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
};

// ─── ELIMINAR PRODUCTO (DESACTIVAR) (ADMIN) ───
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    // Soft delete
    product.status = false;
    await product.save();

    return res.json({ success: true, message: 'Producto desactivado correctamente', product });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
};