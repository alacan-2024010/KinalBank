// front/src/features/admin-general/pages/AccountsPage.jsx
import { useEffect, useState } from "react";
import { useAccountsStore } from "../store/accountStore.js";

/* ─── Constantes ──────────────────────────────────────────── */
const ACCOUNT_TYPES = ["AHORRO", "MONETARIA", "CREDITO"];
const CURRENCIES = ["GTQ", "USD", "EUR"];
const STATUS_LABELS = { ACTIVA: "Activa", BLOQUEADA: "Bloqueada" };
const EMPTY_FORM = { accountType: "AHORRO", currency: "GTQ", balance: 0, ownerId: "" };

/* ─── Badges ──────────────────────────────────────────────── */
const Badge = ({ value }) => {
  const colors = {
    ACTIVA:    "bg-emerald-100 text-emerald-700",
    BLOQUEADA: "bg-red-100 text-red-600",
    AHORRO:    "bg-sky-100 text-sky-700",
    MONETARIA: "bg-violet-100 text-violet-700",
    CREDITO:   "bg-amber-100 text-amber-700",
    GTQ: "bg-green-100 text-green-700",
    USD: "bg-blue-100 text-blue-700",
    EUR: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[value] ?? "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[value] ?? value}
    </span>
  );
};

/* ─── Modal Crear / Editar ────────────────────────────────── */
const AccountModal = ({ initial, onClose, onSave, loading }) => {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(
    isEdit
      ? { accountType: initial.accountType, currency: initial.currency, status: initial.status }
      : { ...EMPTY_FORM }
  );
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!isEdit && !form.ownerId.trim()) return setErr("El ID del propietario es obligatorio.");
    setErr("");
    const result = await onSave(form);
    if (result?.success === false) setErr(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg tracking-tight">
            {isEdit ? "Editar cuenta" : "Nueva cuenta"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!isEdit && (
            <Field label="ID del propietario">
              <input
                className="input-std"
                value={form.ownerId}
                onChange={(e) => set("ownerId", e.target.value)}
                placeholder="Mongo ObjectId del usuario"
              />
            </Field>
          )}

          <Field label="Tipo de cuenta">
            <select className="input-std" value={form.accountType} onChange={(e) => set("accountType", e.target.value)}>
              {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Moneda">
            <select className="input-std" value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          {!isEdit && (
            <Field label="Saldo inicial">
              <input
                type="number"
                min="0"
                className="input-std"
                value={form.balance}
                onChange={(e) => set("balance", Number(e.target.value))}
              />
            </Field>
          )}

          {isEdit && (
            <Field label="Estado">
              <select className="input-std" value={form.status} onChange={(e) => set("status", e.target.value)}>
                {Object.keys(STATUS_LABELS).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </Field>
          )}

          {err && <p className="text-red-500 text-sm">{err}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

/* ─── Modal Confirmar eliminar ────────────────────────────── */
const ConfirmModal = ({ account, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
      <div className="text-4xl mb-3">🗑️</div>
      <h3 className="font-bold text-slate-800 text-lg mb-1">Eliminar cuenta</h3>
      <p className="text-slate-500 text-sm mb-6">
        ¿Seguro que deseas eliminar la cuenta <span className="font-mono font-semibold text-slate-700">{account.accountNumber}</span>? Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger">
          {loading ? "Eliminando…" : "Eliminar"}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Página principal ────────────────────────────────────── */
export const AccountsPage = () => {
  const { accounts, pagination, loading, error, fetchAccounts, addAccount, editAccount, removeAccount, clearError } =
    useAccountsStore();

  const [modal, setModal] = useState(null); // null | { type: 'create' | 'edit' | 'delete', account?: {} }

  useEffect(() => { fetchAccounts(); }, []);

  const handleCreate = async (form) => {
    const result = await addAccount(form);
    if (result.success) setModal(null);
    return result;
  };

  const handleEdit = async (form) => {
    const result = await editAccount(modal.account._id, form);
    if (result.success) setModal(null);
    return result;
  };

  const handleDelete = async () => {
    const result = await removeAccount(modal.account._id);
    if (result.success) setModal(null);
  };

  const changePage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    fetchAccounts(p);
  };

  return (
    <>
      {/* ── Estilos globales inline ── */}
      <style>{`
        .input-std {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.625rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
          transition: border-color .15s;
          background: #f8fafc;
        }
        .input-std:focus { border-color: #6366f1; background: #fff; }
        .btn-primary {
          background: #1e293b; color: #fff; border-radius: 0.625rem;
          padding: 0.5rem 1.25rem; font-weight: 600; font-size: 0.875rem;
          transition: background .15s; border: none; cursor: pointer;
        }
        .btn-primary:hover:not(:disabled) { background: #334155; }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        .btn-secondary {
          background: #f1f5f9; color: #475569; border-radius: 0.625rem;
          padding: 0.5rem 1.25rem; font-weight: 600; font-size: 0.875rem;
          transition: background .15s; border: none; cursor: pointer;
        }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn-danger {
          background: #ef4444; color: #fff; border-radius: 0.625rem;
          padding: 0.5rem 1.25rem; font-weight: 600; font-size: 0.875rem;
          transition: background .15s; border: none; cursor: pointer;
        }
        .btn-danger:hover:not(:disabled) { background: #dc2626; }
        .btn-danger:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div className="p-6 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cuentas bancarias</h1>
            <p className="text-slate-400 text-sm mt-0.5">{pagination.totalRecords} cuentas registradas</p>
          </div>
          <button onClick={() => setModal({ type: "create" })} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Nueva cuenta
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span>{error}</span>
            <button onClick={clearError} className="ml-4 font-bold">×</button>
          </div>
        )}

        {/* ── Tabla ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Número de cuenta", "Tipo", "Moneda", "Saldo", "Estado", "Propietario", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && !accounts.length ? (
                  <tr><td colSpan={7} className="py-16 text-center text-slate-400">Cargando…</td></tr>
                ) : accounts.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-slate-400">No hay cuentas aún.</td></tr>
                ) : accounts.map((acc) => (
                  <tr key={acc._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-700 text-xs">{acc.accountNumber}</td>
                    <td className="px-4 py-3"><Badge value={acc.accountType} /></td>
                    <td className="px-4 py-3"><Badge value={acc.currency} /></td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {acc.balance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3"><Badge value={acc.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 max-w-[120px] truncate">{acc.ownerId}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ type: "edit", account: acc })}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Editar
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => setModal({ type: "delete", account: acc })}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Paginación ── */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => changePage(Number(pagination.currentPage) - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => changePage(Number(pagination.currentPage) + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modales ── */}
      {modal?.type === "create" && (
        <AccountModal onClose={() => setModal(null)} onSave={handleCreate} loading={loading} />
      )}
      {modal?.type === "edit" && (
        <AccountModal initial={modal.account} onClose={() => setModal(null)} onSave={handleEdit} loading={loading} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal account={modal.account} onClose={() => setModal(null)} onConfirm={handleDelete} loading={loading} />
      )}
    </>
  );
};
