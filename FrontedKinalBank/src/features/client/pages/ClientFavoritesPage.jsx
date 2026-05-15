import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore.js";
import { AddFavoriteModal } from "../components/AddFavoriteModal.jsx";
import { EditFavoriteModal } from "../components/EditFavoriteModal.jsx";

const Badge = ({ children, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const ActivityItem = ({ alias, amount, date, positive }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-base">
        ⭐
      </div>
      <div>
        <p className="text-sm font-semibold text-[#16213E]">{alias}</p>
        <p className="text-xs text-slate-400">{date}</p>
      </div>
    </div>
    <span
      className={`text-sm font-bold ${
        positive ? "text-emerald-500" : "text-red-500"
      }`}
    >
      {positive ? "+" : "-"}Q{amount}
    </span>
  </div>
);

const TipCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3 rounded-2xl bg-indigo-50 p-4">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm font-bold text-[#16213E]">{title}</p>
      <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

const FavoriteCard = ({ favorite, onEdit, onDelete, onTransfer, deleting }) => (
  <div className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    {/* Accent top bar */}
    <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {/* Icon with initials */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16213E] to-indigo-600 text-white shadow-sm">
          <span className="text-lg font-extrabold">
            {favorite.alias?.charAt(0).toUpperCase()}
          </span>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-white ring-2 ring-white">
            ✓
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-[#16213E]">{favorite.alias}</h3>
          <p className="mt-0.5 font-mono text-xs tracking-wider text-slate-400">
            {favorite.accountNumber}
          </p>
          <div className="mt-1.5">
            <Badge color="emerald">Verificado</Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={() => onEdit(favorite)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 transition hover:bg-amber-100"
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(favorite._id)}
          disabled={deleting === favorite._id}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
          title="Eliminar"
        >
          {deleting === favorite._id ? "..." : "✕"}
        </button>
      </div>
    </div>

    {/* Mini stats row */}
    <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="text-center">
        <p className="text-xs text-slate-400">Banco</p>
        <p className="mt-0.5 text-xs font-bold text-[#16213E]">KinalBank</p>
      </div>
      <div className="text-center border-l border-slate-200">
        <p className="text-xs text-slate-400">Tipo</p>
        <p className="mt-0.5 text-xs font-bold text-indigo-600">Monetaria</p>
      </div>
    </div>

    <div className="my-4 border-t border-slate-100" />

    <button
      onClick={() => onTransfer(favorite)}
      className="w-full rounded-2xl bg-gradient-to-r from-[#16213E] to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-indigo-200 hover:shadow-lg"
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
      state: { toAccount: favorite.accountNumber, alias: favorite.alias },
    });
  };

  const filtered = favorites.filter(
    (f) =>
      f.alias.toLowerCase().includes(search.toLowerCase()) ||
      f.accountNumber.includes(search)
  );

  const recentActivity = favorites.slice(0, 3).map((f, i) => ({
    alias: f.alias,
    amount: (150 + i * 75).toFixed(2),
    date: ["Hoy, 10:32 AM", "Ayer, 3:15 PM", "Lun, 8:00 AM"][i] || "—",
    positive: i % 2 === 0,
  }));

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden rounded-3xl border border-[#1f2a44] bg-gradient-to-r from-[#0f1c3f] via-[#1a2d5a] to-[#1e3a7a] p-8 shadow-xl">
          {/* Número grande de fondo */}
          <div className="absolute right-48 top-1/2 -translate-y-1/2 text-[110px] font-black text-white/5 select-none pointer-events-none leading-none tracking-tight">
            {favorites.length} FAV
          </div>

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 h-0.5 w-10 bg-indigo-400" />
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
                KinalBank
              </p>
              <h1 className="text-3xl font-black text-white leading-tight">
                Mis Favoritos
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {favorites.length} favorito{favorites.length !== 1 ? "s" : ""} · {favorites.length} activo{favorites.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Tarjeta flotante derecha */}
            <div className="flex-shrink-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 text-white min-w-[180px]">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">
                Total guardados
              </p>
              <p className="text-3xl font-black">{favorites.length}</p>
              <p className="text-xs text-slate-300 mt-1">Cuentas favoritas</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                + Agregar favorito
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid gap-5 md:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500 rounded-t-2xl" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total favoritos</p>
            <h2 className="mt-3 text-4xl font-black text-[#16213E]">{favorites.length}</h2>
            <p className="mt-1 text-xs text-slate-400">{favorites.length} activo{favorites.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500 rounded-t-2xl" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transferencias rápidas</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-600">Activas</h2>
            <p className="mt-1 text-xs text-slate-400">En operación</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-red-400 rounded-t-2xl" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Seguridad</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-500">Protegido</h2>
            <p className="mt-1 text-xs text-slate-400">Cifrado de extremo a extremo</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-amber-400 rounded-t-2xl" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Límite diario</p>
            <h2 className="mt-3 text-3xl font-black text-[#16213E]">Q10,000</h2>
            <p className="mt-1 text-xs text-slate-400">Disponible hoy</p>
          </div>
        </div>

        {/* ── ALERTS ── */}
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

        {/* ── MAIN CONTENT (2-col) ── */}
        <div className="grid gap-7 lg:grid-cols-3">

          {/* LEFT: favorites list */}
          <div className="lg:col-span-2 space-y-5">

            {/* Search */}
            {favorites.length > 0 && (
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por alias o número de cuenta..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-12 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            )}

            {/* Cards */}
            {loading && favorites.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
                <p className="text-slate-400">Cargando favoritos...</p>
              </div>
            ) : filtered.length === 0 ? (
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
                  className="mt-8 rounded-2xl bg-[#16213E] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
                >
                  Agregar favorito
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
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

            {/* Footer count */}
            {favorites.length > 0 && (
              <div className="flex justify-end">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                  {filtered.length} favorito{filtered.length !== 1 ? "s" : ""} encontrado
                  {filtered.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT sidebar */}
          <div className="space-y-5">

            {/* Recent activity */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#16213E]">
                  Actividad reciente
                </h3>
                <Badge color="indigo">Últimos 7 días</Badge>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Sin actividad reciente.
                </p>
              ) : (
                recentActivity.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))
              )}
              <button className="mt-4 w-full rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition">
                Ver todos los movimientos →
              </button>
            </div>

            {/* Quick tips */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-[#16213E]">
                💡 Consejos rápidos
              </h3>
              <div className="space-y-3">
                <TipCard
                  icon="🔒"
                  title="Verifica el número"
                  desc="Siempre confirma el número de cuenta antes de transferir."
                />
                <TipCard
                  icon="⭐"
                  title="Usa alias descriptivos"
                  desc="Nombra cada favorito para identificarlos fácilmente."
                />
                <TipCard
                  icon="📲"
                  title="Notificaciones activas"
                  desc="Activa alertas para confirmar cada transferencia."
                />
              </div>
            </div>

            {/* Security badge */}
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-sm font-bold text-emerald-800">
                  Cuenta protegida
                </h3>
              </div>
              <p className="text-xs text-emerald-700">
                Tus transferencias están protegidas con cifrado bancario.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-emerald-200">
                  <div className="h-2 w-full rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-700">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODALS ── */}
        {showAddModal && (
          <AddFavoriteModal
            onClose={() => { setShowAddModal(false); clearMessages(); }}
          />
        )}
        {editTarget && (
          <EditFavoriteModal
            favorite={editTarget}
            onClose={() => { setEditTarget(null); clearMessages(); }}
          />
        )}
      </div>
    </div>
  );
};