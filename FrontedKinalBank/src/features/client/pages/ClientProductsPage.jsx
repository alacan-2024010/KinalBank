import { useEffect, useState } from "react";
import { useProductsStore } from "../store/productsStore.js";

const TYPE_CONFIG = {
    PRODUCTO: {
        label: "Producto",
        icon: "📦",
        color: "bg-blue-50 text-blue-600",
        badge: "bg-blue-50 text-blue-600 border-blue-100",
    },
    SERVICIO: {
        label: "Servicio",
        icon: "⚡",
        color: "bg-amber-50 text-amber-600",
        badge: "bg-amber-50 text-amber-600 border-amber-100",
    },
};

const ProductCard = ({ product }) => {
    const config = TYPE_CONFIG[product.type] ?? {
        label: product.type,
        icon: "🏦",
        color: "bg-gray-50 text-gray-500",
        badge: "bg-gray-50 text-gray-500 border-gray-100",
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-indigo-100 transition-all">
        {/* Cabecera */}
        <div className="flex items-start justify-between">
            <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${config.color}`}
            >
            {config.icon}
            </div>
            <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.badge}`}
            >
            {config.label}
            </span>
        </div>

        {/* Contenido */}
        <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
            {product.description}
            </p>
        </div>

        {/* Footer */}
        {product.price != null && (
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">Costo</span>
            <span className="text-sm font-bold text-gray-800">
                Q {Number(product.price).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </span>
            </div>
        )}
        </div>
    );
};

export const ClientProductsPage = () => {
    const { products, loading, error, fetchProducts } = useProductsStore();
    const [filter, setFilter] = useState("TODOS");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const FILTERS = ["TODOS", "PRODUCTO", "SERVICIO"];

    const visible = products.filter((p) => {
        const matchType = filter === "TODOS" || p.type === filter;
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
        <div className="max-w-5xl mx-auto space-y-8">
        {/* Encabezado */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos y Servicios</h1>
            <p className="text-sm text-gray-400 mt-1">
            Descubre todo lo que KinalBank tiene para ti.
            </p>
        </div>

        {/* Error */}
        {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
            </div>
        )}

        {/* Filtros + Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {FILTERS.map((f) => (
                <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                >
                {f === "TODOS" ? "Todos" : f === "PRODUCTO" ? "Productos" : "Servicios"}
                <span
                    className={`ml-1.5 text-[10px] ${
                    filter === f ? "text-indigo-500" : "text-gray-400"
                    }`}
                >
                    ({counts[f]})
                </span>
                </button>
            ))}
            </div>

            {/* Buscador */}
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto o servicio…"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
        </div>

        {/* Grid */}
        {loading && products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
            Cargando productos…
            </div>
        ) : visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500 font-medium">
                {search || filter !== "TODOS"
                ? "No se encontraron resultados."
                : "No hay productos disponibles en este momento."}
            </p>
            </div>
        ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((product) => (
                <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <p className="text-xs text-gray-400 text-right">
                Mostrando {visible.length} de {products.length} elemento
                {products.length !== 1 ? "s" : ""}
            </p>
            </>
        )}
        </div>
    );
};