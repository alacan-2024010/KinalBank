import { useEffect, useState } from "react";
import { ProductModal } from "../components/ProductModal.jsx";
import { CreateProductModal } from "../components/CreateProductModal.jsx";
import { useProductsStore } from "../store/productStore.js";

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/30 px-5 py-4">
    {/* Glow */}
    <div className={`absolute top-[-20px] right-[-20px] w-20 h-20 rounded-full blur-3xl opacity-10 ${color}`} />
    <div className="relative z-10 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">{label}</p>
        <h3 className="text-[2rem] leading-none font-black text-slate-800 whitespace-nowrap">{value}</h3>
        {sub && <p className="text-[11px] text-slate-400 mt-2 truncate">{sub}</p>}
      </div>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner flex-shrink-0">
        {icon}
      </div>
    </div>
  </div>
);

export const ProductsPage = () => {
  const { products, fetchProducts, deleteProduct } = useProductsStore();
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProductos = products.filter(p => p.type === "PRODUCTO").length;
  const totalServicios = products.filter(p => p.type === "SERVICIO").length;

  return (
    <div className="max-w-5xl mx-auto">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071126] via-[#0d1b36] to-[#15264a] p-8 md:p-10 shadow-2xl shadow-slate-900/20 mb-8">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] left-[-80px] w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
                Gestión de productos y servicios
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Gestión de
              <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                productos y servicios
              </span>
            </h1>

            <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
              Administra y supervisa todos los productos y servicios disponibles.
            </p>
          </div>

          {/* Action */}
          <div className="flex flex-col items-start lg:items-end gap-4">

            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[220px]">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Total productos</p>
              <h2 className="text-4xl font-black text-white">{products.length}</h2>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-medium">Sistema actualizado</span>
              </div>
            </div>

            {/* Botón negro igual DepositPage */}
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-3 rounded-2xl bg-black/80 hover:bg-black text-white font-semibold shadow-lg transition"
            >
              + Nuevo Producto
            </button>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total registrados" value={products.length} sub="Productos y servicios" color="bg-indigo-500" icon="📦" />
        <StatCard label="Productos" value={totalProductos} sub="Productos activos" color="bg-blue-500" icon="🛒" />
        <StatCard label="Servicios" value={totalServicios} sub="Servicios activos" color="bg-purple-500" icon="⚡" />
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="rounded-[30px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/50 overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-slate-400">{product._id.slice(-4)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.type === "SERVICIO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{product.type}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-3">{product.description}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-black text-indigo-600">Q {Number(product.price).toLocaleString("es-GT",{minimumFractionDigits:2})}</span>
              <div className="flex gap-2">
                <button onClick={() => setViewProduct(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">Ver</button>
                <button onClick={() => setEditProduct(product)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">Editar</button>
                <button onClick={() => deleteProduct(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALES */}
      {viewProduct && <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} />}
      {editProduct && <CreateProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
      {showCreate && <CreateProductModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};