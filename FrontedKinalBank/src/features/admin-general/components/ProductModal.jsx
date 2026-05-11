import { useEffect } from "react";

export const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!product) return null;
  const isServicio = product.type === "SERVICIO";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-[28px] bg-white shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#071126] px-6 py-6 relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-60 h-60 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-[-60px] left-[-40px] w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full" />

          <div className="relative flex items-start justify-between">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                  isServicio
                    ? "bg-violet-500/20 text-violet-300 border-violet-400/40"
                    : "bg-indigo-500/20 text-indigo-300 border-indigo-400/40"
                }`}
              >
                {product.type}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{product.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-2">
          <p className="text-sm text-slate-500">{product.description}</p>
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>ID: {product._id}</span>
            <span>Precio: Q{product.price}</span>
          </div>
        </div>

      </div>
    </div>
  );
};