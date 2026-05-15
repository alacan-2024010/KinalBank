import { useEffect, useState } from "react";
import { useProductsStore } from "../store/useProductsStore.js";
import { ProductModal } from "../components/ProductModal.jsx";

const TYPE_CONFIG = {
    PRODUCTO: {
        label: "Producto",
        icon: "📦",
        gradient: "from-indigo-500 to-blue-500",
        badge: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    },
    SERVICIO: {
        label: "Servicio",
        icon: "⚡",
        gradient: "from-amber-500 to-orange-500",
        badge: "bg-orange-500/10 text-orange-600 border-orange-100",
    },
};

const ProductCard = ({ product, setSelectedProduct }) => {

    const config = TYPE_CONFIG[product.type] ?? {
        label: product.type,
        icon: "🏦",
        gradient: "from-slate-500 to-slate-700",
        badge: "bg-slate-500/10 text-slate-600 border-slate-100",
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">

            {/* Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${config.gradient} blur-3xl transition-all duration-700`} />

            <div className="relative p-6 flex flex-col h-full">

                {/* Top */}
                <div className="flex items-start justify-between mb-5">

                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center text-2xl shadow-lg`}>
                        {config.icon}
                    </div>

                    <span className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide ${config.badge}`}>
                        {config.label}
                    </span>

                </div>

                {/* Content */}
                <div className="flex-1">

                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {product.description}
                    </p>

                </div>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">

                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Precio
                        </p>

                        <h4 className="text-xl font-black text-gray-900">
                            Q{" "}
                            {Number(product.price ?? 0).toLocaleString("es-GT", {
                                minimumFractionDigits: 2,
                            })}
                        </h4>
                    </div>

                    <button
                        onClick={() => setSelectedProduct(product)}
                        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold shadow-lg hover:scale-105 transition cursor-pointer`}
                    >
                        Ver más
                    </button>

                </div>

            </div>

        </div>
    );
};

export const ClientProductsPage = () => {

    const {
        products,
        loading,
        error,
        fetchProducts
    } = useProductsStore();

    const [filter, setFilter] = useState("TODOS");
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const FILTERS = ["TODOS", "PRODUCTO", "SERVICIO"];

    const visible = products.filter((p) => {

        const matchType =
            filter === "TODOS" || p.type === filter;

        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());

        return matchType && matchSearch;
    });

    const counts = {
        TODOS: products.length,
        PRODUCTO: products.filter((p) => p.type === "PRODUCTO").length,
        SERVICIO: products.filter((p) => p.type === "SERVICIO").length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#f4f7fc] to-[#eef2ff]">

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* Hero */}
                <div className="relative overflow-hidden rounded-[32px] bg-[#071126] p-10 shadow-2xl">

                    {/* Glow */}
                    <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-120px] left-[-100px] w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        <div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-semibold uppercase tracking-[0.2em] mb-5">
                                🏦 KinalBank Marketplace
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl">
                                Productos y servicios financieros
                            </h1>

                            <p className="mt-4 text-slate-300 text-lg max-w-2xl leading-relaxed">
                                Descubre soluciones bancarias diseñadas para ayudarte
                                a crecer, ahorrar y administrar mejor tu dinero.
                            </p>

                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 min-w-[320px]">

                            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md">
                                <p className="text-3xl font-black text-white">
                                    {counts.TODOS}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                                    Total
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md">
                                <p className="text-3xl font-black text-indigo-300">
                                    {counts.PRODUCTO}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                                    Productos
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md">
                                <p className="text-3xl font-black text-orange-300">
                                    {counts.SERVICIO}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                                    Servicios
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">

                        {FILTERS.map((f) => (

                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                                    filter === f
                                        ? "bg-[#071126] text-white shadow-xl"
                                        : "bg-white text-gray-500 border border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                                }`}
                            >
                                {f === "TODOS"
                                    ? "Todos"
                                    : f === "PRODUCTO"
                                    ? "Productos"
                                    : "Servicios"}

                                <span className="ml-2 opacity-70">
                                    ({counts[f]})
                                </span>
                            </button>

                        ))}

                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar productos o servicios..."
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-5 pr-14 py-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                        />


                    </div>


                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading && products.length === 0 ? (

                    <div className="flex items-center justify-center py-32">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                            <p className="text-gray-500 font-medium">
                                Cargando productos...
                            </p>
                        </div>
                    </div>

                ) : visible.length === 0 ? (

                    <div className="bg-white rounded-[32px] border border-dashed border-gray-200 py-24 text-center shadow-sm">

                        <div className="text-6xl mb-5">
                            📦
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No se encontraron resultados
                        </h3>

                        <p className="text-gray-500">
                            Intenta cambiar el filtro o buscar otro término.
                        </p>

                    </div>

                ) : (

                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

                            {visible.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    setSelectedProduct={setSelectedProduct}
                                />
                            ))}

                        </div>

                        <div className="flex items-center justify-between pt-2">

                            <p className="text-sm text-gray-400">
                                Mostrando{" "}
                                <span className="font-bold text-gray-700">
                                    {visible.length}
                                </span>{" "}
                                de{" "}
                                <span className="font-bold text-gray-700">
                                    {products.length}
                                </span>{" "}
                                elementos
                            </p>

                        </div>
                    </>

                )}

            </div>

            {/* Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

        </div>
    );
};