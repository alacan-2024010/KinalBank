import React from "react";

/* ─── Modal Confirmar eliminar ────────────────────────────── */
export const ConfirmModal = ({ account, onClose, onConfirm, loading }) => (
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