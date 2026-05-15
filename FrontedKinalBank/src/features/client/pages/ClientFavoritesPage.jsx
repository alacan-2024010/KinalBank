import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore.js";
import { AddFavoriteModal } from "../components/AddFavoriteModal.jsx";
import { EditFavoriteModal } from "../components/EditFavoriteModal.jsx";

const FavoriteCard = ({ favorite, onEdit, onDelete, onTransfer, deleting }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all group">
        <div className="flex items-center gap-4">
        {/* Ícono */}
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
            ⭐
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{favorite.alias}</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5 tracking-wider">
            {favorite.accountNumber}
            </p>
        </div>

        {/* Acciones — visibles con hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {/* Editar */}
            <button
            onClick={() => onEdit(favorite)}
            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center text-sm transition cursor-pointer"
            title="Editar favorito"
            >
            ✏️
            </button>
            {/* Eliminar */}
            <button
            onClick={() => onDelete(favorite._id)}
            disabled={deleting === favorite._id}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-sm transition cursor-pointer disabled:opacity-50"
            title="Eliminar favorito"
            >
            {deleting === favorite._id ? "…" : "✕"}
            </button>
        </div>
        </div>

        {/* Botón transferir */}
        <button
        onClick={() => onTransfer(favorite)}
        className="mt-4 w-full text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl py-2 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
        <span>↗️</span> Transferir a esta cuenta
        </button>
    </div>
);

export const ClientFavoritesPage = () => {
    const navigate = useNavigate();
    const {
        favorites,
        loading,
        error,
        successMessage,
        fetchFavorites,
        deleteFavorite,
        clearMessages,
    } = useFavoritesStore();

    const [showAddModal, setShowAddModal]   = useState(false);
    const [editTarget, setEditTarget]       = useState(null);
    const [deleting, setDeleting]           = useState(null);
    const [search, setSearch]               = useState("");

    useEffect(() => {
        fetchFavorites();
        return () => clearMessages();
    }, []);

    const handleDelete = async (id) => {
        setDeleting(id);
        await deleteFavorite(id);
        setDeleting(null);
    };

    const handleTransfer = (favorite) => {
        navigate("/dashboard/client/transfer", {
        state: { toAccount: favorite.accountNumber, alias: favorite.alias },
        });
    };

    const filtered = favorites.filter(
        (f) =>
        f.alias.toLowerCase().includes(search.toLowerCase()) ||
        f.accountNumber.includes(search)
    );

    return (
        <div className="max-w-3xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="flex items-start justify-between">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
            <p className="text-sm text-gray-400 mt-1">
                Cuentas guardadas para transferencias rápidas.
            </p>
            </div>
            <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2"
            >
            <span className="text-base leading-none">＋</span>
            Agregar favorito
            </button>
        </div>

        {/* Alertas */}
        {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
            </div>
        )}
        {successMessage && (
            <div className="bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl px-4 py-3">
            {successMessage}
            </div>
        )}

        {/* Buscador */}
        {favorites.length > 0 && (
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por alias o número de cuenta…"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
        )}

        {/* Lista */}
        {loading && favorites.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
            Cargando favoritos…
            </div>
        ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <p className="text-4xl mb-3">⭐</p>
            <p className="text-gray-500 font-medium">
                {search
                ? "Sin resultados para tu búsqueda."
                : "Aún no tienes cuentas favoritas."}
            </p>
            {!search && (
                <p className="text-sm text-gray-400 mt-1">
                Agrega una cuenta para transferir más rápido.
                </p>
            )}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((fav) => (
                <FavoriteCard
                key={fav._id}
                favorite={fav}
                onEdit={setEditTarget}
                onDelete={handleDelete}
                onTransfer={handleTransfer}
                deleting={deleting}
                />
            ))}
            </div>
        )}

        {favorites.length > 0 && (
            <p className="text-xs text-gray-400 text-right">
            {filtered.length} favorito{filtered.length !== 1 ? "s" : ""}
            </p>
        )}

        {/* Modal agregar */}
        {showAddModal && (
            <AddFavoriteModal
            onClose={() => {
                setShowAddModal(false);
                clearMessages();
            }}
            />
        )}

        {/* Modal editar */}
        {editTarget && (
            <EditFavoriteModal
            favorite={editTarget}
            onClose={() => {
                setEditTarget(null);
                clearMessages();
            }}
            />
        )}
        </div>
    );
};