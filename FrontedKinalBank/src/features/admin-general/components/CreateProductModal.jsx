import { useState, useEffect } from "react";
import { useProductsStore } from "../store/productStore.js";

export const CreateProductModal = ({ product, onClose }) => {
  const { createProduct, updateProduct } = useProductsStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "PRODUCTO",
    price: 0
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.description) return;

    const payload = { ...form, price: Number(form.price) };

    if (product?._id) {
      await updateProduct(product._id, payload);
    } else {
      await createProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-[28px] bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#071126] px-6 py-6 relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-60 h-60 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                {product?._id ? "Editar" : "Crear"}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {product?._id ? "Producto existente" : "Nuevo producto"}
              </h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción"
            rows={3}
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="PRODUCTO">Producto</option>
            <option value="SERVICIO">Servicio</option>
          </select>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {product?._id ? "Actualizar" : "Crear producto"}
          </button>
        </div>

      </div>
    </div>
  );
};