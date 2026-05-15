import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore.js";
import { AddFavoriteModal } from "../components/AddFavoriteModal.jsx";
import { EditFavoriteModal } from "../components/EditFavoriteModal.jsx";

const FavoriteCard = ({
  favorite,
  onEdit,
  onDelete,
  onTransfer,
  deleting,
}) => (
  <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

    <div className="flex items-start justify-between">

      <div className="flex items-center gap-4">

        {/* ICON */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16213E] to-indigo-600 text-xl text-white shadow-sm">
          ⭐
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-base font-bold text-[#16213E]">
            {favorite.alias}
          </h3>

          <p className="mt-1 font-mono text-sm tracking-wider text-slate-400">
            {favorite.accountNumber}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 opacity-0 transition-all group-hover:opacity-100">

        <button
          onClick={() => onEdit(favorite)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 transition hover:bg-amber-100"
        >
          ✏️
        </button>

        <button
          onClick={() => onDelete(favorite._id)}
          disabled={deleting === favorite._id}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
        >
          {deleting === favorite._id ? "..." : "✕"}
        </button>
      </div>
    </div>

    {/* DIVIDER */}
    <div className="my-5 border-t border-slate-100"></div>

    {/* BUTTON */}
    <button
      onClick={() => onTransfer(favorite)}
      className="w-full rounded-2xl bg-[#16213E] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1B2A4A]"
    >
      Transferir dinero →
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

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
      state: {
        toAccount: favorite.accountNumber,
        alias: favorite.alias,
      },
    });
  };

  const filtered = favorites.filter(
    (f) =>
      f.alias.toLowerCase().includes(search.toLowerCase()) ||
      f.accountNumber.includes(search)
  );

  return (
  <div className="min-h-screen bg-[#f5f7fb] px-8 py-8">
    <div className="mx-auto max-w-7xl space-y-7">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1f2a44] bg-gradient-to-r from-[#16213E] to-[#1B2A4A] p-8 shadow-lg">

        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-indigo-200">
              CLIENTE DASHBOARD
            </p>

            <h1 className="text-4xl font-extrabold text-white">
              Mis Favoritos
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Administra tus cuentas favoritas y realiza transferencias
              rápidas de manera segura.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg"
          >
            + Agregar favorito
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-400">
            Total favoritos
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#16213E]">
            {favorites.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-400">
            Transferencias rápidas
          </p>

          <h2 className="mt-3 text-4xl font-black text-indigo-600">
            Activas
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-400">
            Seguridad
          </p>

          <h2 className="mt-3 text-4xl font-black text-emerald-500">
            Protegido
          </h2>
        </div>
      </div>

      {/* ALERTAS */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-600 shadow-sm">
          {successMessage}
        </div>
      )}

      {/* SEARCH */}
      {favorites.length > 0 && (
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por alias o número de cuenta..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-14 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

        </div>
      )}

      {/* CONTENT */}
      {loading && favorites.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
          <p className="text-slate-400">
            Cargando favoritos...
          </p>
        </div>
      ) : filtered.length === 0 ? (

        /* EMPTY STATE */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-20 text-center shadow-sm">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-5xl">
            ⭐
          </div>

          <h3 className="mt-6 text-2xl font-bold text-[#16213E]">
            No tienes favoritos todavía
          </h3>

          <p className="mt-2 text-slate-400">
            Guarda cuentas frecuentes para transferir rápidamente.
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-8 rounded-2xl bg-[#16213E] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1B2A4A]"
          >
            Agregar favorito
          </button>
        </div>
      ) : (

        /* GRID */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      {/* FOOTER */}
      {favorites.length > 0 && (
        <div className="flex justify-end">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
            {filtered.length} favorito
            {filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAddModal && (
        <AddFavoriteModal
          onClose={() => {
            setShowAddModal(false);
            clearMessages();
          }}
        />
      )}

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
  </div>
);
};