import { useEffect } from "react";

export const ProductModal = ({ product, onClose }) => {

    useEffect(() => {

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };

    }, []);

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl rounded-[32px] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="relative bg-[#071126] px-8 py-7 overflow-hidden">

                    {/* Glow */}
                    <div className="absolute top-[-80px] right-[-80px] w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex items-start justify-between gap-4">

                        <div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-semibold uppercase tracking-wide mb-4">
                                {product.type === "PRODUCTO" ? "📦 Producto" : "⚡ Servicio"}
                            </div>

                            <h2 className="text-3xl font-black text-white leading-tight">
                                {product.name}
                            </h2>

                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xl transition cursor-pointer"
                        >
                            ✕
                        </button>

                    </div>

                </div>

                {/* Body */}
                <div className="p-8 space-y-8">

                    {/* Description */}
                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                            Descripción
                        </p>

                        <p className="text-gray-600 leading-relaxed text-sm">
                            {product.description}
                        </p>

                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                                Tipo
                            </p>

                            <h3 className="text-lg font-bold text-gray-900">
                                {product.type}
                            </h3>

                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                                Precio
                            </p>

                            <h3 className="text-2xl font-black text-indigo-600">
                                Q{" "}
                                {Number(product.price ?? 0).toLocaleString("es-GT", {
                                    minimumFractionDigits: 2,
                                })}
                            </h3>

                        </div>

                    </div>

                    {/* Benefits */}
                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                            Beneficios
                        </p>

                        <div className="space-y-3">

                            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                                <span className="text-emerald-500">
                                    ✔
                                </span>

                                <p className="text-sm text-emerald-700">
                                    Gestión rápida y segura
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                                <span className="text-indigo-500">
                                    ✔
                                </span>

                                <p className="text-sm text-indigo-700">
                                    Disponible desde cualquier dispositivo
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                                <span className="text-orange-500">
                                    ✔
                                </span>

                                <p className="text-sm text-orange-700">
                                    Respaldo y seguridad bancaria
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">

                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition font-semibold cursor-pointer"
                    >
                        Cerrar
                    </button>

                    <button
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                        Solicitar
                    </button>

                </div>

            </div>

        </div>
    );
};