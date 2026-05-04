import { useEffect, useState } from "react";
import { useAccountsStore } from "../store/accountStore.js";
import { AccountModal } from "../components/AccountModal.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { Badge } from "../components/Badge.jsx";

export const AccountsPage = () => {
  const { accounts = [], pagination, loading, error, fetchAccounts, addAccount, editAccount, removeAccount, clearError } =
    useAccountsStore(); // Asegúrate de que `accounts` esté siempre un array

  const [modal, setModal] = useState({ type: null, account: null });

  useEffect(() => {
    fetchAccounts(); // Cargar las cuentas
  }, []);

  const handleCreate = async (form) => {
    const result = await addAccount(form);
    if (result.success) setModal({ type: null, account: null });
    return result;
  };

  const handleEdit = async (form) => {
    const result = await editAccount(modal.account._id, form);
    if (result.success) setModal({ type: null, account: null });
    return result;
  };

  const handleDelete = async () => {
    const result = await removeAccount(modal.account._id);
    if (result.success) setModal({ type: null, account: null });
  };

  const changePage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    fetchAccounts(p);
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cuentas bancarias</h1>
            <p className="text-slate-400 text-sm mt-0.5">{pagination?.totalRecords || 0} cuentas registradas</p>
          </div>
          <button onClick={() => setModal({ type: "create" })} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Nueva cuenta
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span>{error}</span>
            <button onClick={clearError} className="ml-4 font-bold">×</button>
          </div>
        )}

        {/* Tabla */}
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

          {/* Paginación */}
          {pagination?.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400">
                Página {pagination?.currentPage} de {pagination?.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => changePage(Number(pagination?.currentPage) - 1)}
                  disabled={pagination?.currentPage <= 1}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => changePage(Number(pagination?.currentPage) + 1)}
                  disabled={pagination?.currentPage >= pagination?.totalPages}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {modal?.type === "create" && (
        <AccountModal onClose={() => setModal({ type: null, account: null })} onSave={handleCreate} loading={loading} />
      )}
      {modal?.type === "edit" && (
        <AccountModal initial={modal.account} onClose={() => setModal({ type: null, account: null })} onSave={handleEdit} loading={loading} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal account={modal.account} onClose={() => setModal({ type: null, account: null })} onConfirm={handleDelete} loading={loading} />
      )}
    </>
  );
};