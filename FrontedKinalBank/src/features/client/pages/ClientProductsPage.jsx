import { useEffect, useState } from "react";
import { useProductsStore } from "../store/useProductsStore.js";
import { ProductModal } from "../components/ProductModal.jsx";

const TYPE_CONFIG = {
    PRODUCTO: {
        label: "Producto",
        icon: "📦",
        gradient: "from-indigo-500 to-blue-600",
        gradientHover: "from-indigo-600 to-blue-700",
        badge: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
        glow: "group-hover:shadow-indigo-200",
        bar: "from-indigo-400 to-blue-500",
    },
    SERVICIO: {
        label: "Servicio",
        icon: "⚡",
        gradient: "from-amber-500 to-orange-500",
        gradientHover: "from-amber-600 to-orange-600",
        badge: "bg-orange-500/10 text-orange-600 border-orange-200",
        glow: "group-hover:shadow-orange-200",
        bar: "from-amber-400 to-orange-500",
    },
};

const ProductCard = ({ product, setSelectedProduct }) => {
    const config = TYPE_CONFIG[product.type] ?? {
        label: product.type,
        icon: "🏦",
        gradient: "from-slate-500 to-slate-700",
        badge: "bg-slate-500/10 text-slate-600 border-slate-200",
        glow: "group-hover:shadow-slate-200",
        bar: "from-slate-400 to-slate-600",
    };

    return (
        <div className={`group relative overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-md hover:shadow-2xl ${config.glow} hover:-translate-y-1.5 transition-all duration-500 flex flex-col`}>

            {/* Top color bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${config.bar}`} />

            {/* Decorative background shape */}
            <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${config.gradient} opacity-[0.06] group-hover:opacity-[0.12] transition-all duration-500 pointer-events-none`} />

            <div className="relative p-6 flex flex-col flex-1">

                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                    <div className={`w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {config.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.badge}`}>
                        {config.label}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-base font-black text-slate-900 mb-2 leading-snug">
                        {product.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Precio</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                            Q {Number(product.price ?? 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <button
                        onClick={() => setSelectedProduct(product)}
                        className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer tracking-wide`}
                    >
                        Ver más →
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ClientProductsPage = () => {
    const { products, loading, error, fetchProducts } = useProductsStore();
    const [filter, setFilter] = useState("TODOS");
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => { fetchProducts(); }, []);

    const FILTERS = ["TODOS", "PRODUCTO", "SERVICIO"];

    const visible = products.filter(p => {
        const matchType   = filter === "TODOS" || p.type === filter;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.description.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const counts = {
        TODOS:    products.length,
        PRODUCTO: products.filter(p => p.type === "PRODUCTO").length,
        SERVICIO: products.filter(p => p.type === "SERVICIO").length,
    };

    return (
        <div className="max-w-6xl mx-auto px-2 py-2 pb-16 space-y-8">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden rounded-[28px] bg-[#060f24] shadow-2xl p-8 md:p-10">

                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.25em] mb-5">
                            🏦 KinalBank Marketplace
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
                            Productos &<br />Servicios
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed">
                            Soluciones bancarias diseñadas para ayudarte a crecer, ahorrar y administrar mejor tu dinero.
                        </p>
                    </div>

                    {/* Stat pills */}
                    <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[180px]">
                        {[
                            { label: "Total disponibles", value: counts.TODOS,    color: "text-white",        bg: "bg-white/8"  },
                            { label: "Productos",         value: counts.PRODUCTO, color: "text-indigo-300",   bg: "bg-indigo-500/10" },
                            { label: "Servicios",         value: counts.SERVICIO, color: "text-orange-300",   bg: "bg-orange-500/10" },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 ${s.bg} border border-white/8 rounded-2xl px-5 py-3 backdrop-blur-sm`}>
                                <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-tight">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Filter tabs */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                                filter === f
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {f === "TODOS" ? "Todos" : f === "PRODUCTO" ? "Productos" : "Servicios"}
                            <span className={`ml-1.5 text-[10px] ${filter === f ? "text-slate-400" : "text-slate-300"}`}>
                                ({counts[f]})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar productos o servicios…"
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all placeholder-slate-300"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition cursor-pointer"
                        >✕</button>
                    )}
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-600 text-sm font-medium flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* ── Content ── */}
            {loading && products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Cargando productos…</p>
                </div>

            ) : visible.length === 0 ? (
                <div className="rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 py-24 text-center">
                    <p className="text-5xl mb-4">📦</p>
                    <h3 className="text-lg font-black text-slate-700 mb-1">Sin resultados</h3>
                    <p className="text-sm text-slate-400">Intenta cambiar el filtro o buscar otro término.</p>
                </div>

            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {visible.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                setSelectedProduct={setSelectedProduct}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-slate-400 text-center pt-2">
                        Mostrando <span className="font-bold text-slate-600">{visible.length}</span> de <span className="font-bold text-slate-600">{products.length}</span> elementos
                    </p>
                </>
            )}

            {/* Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};