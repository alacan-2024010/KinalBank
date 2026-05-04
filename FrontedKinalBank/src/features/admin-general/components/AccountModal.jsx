import { useState } from "react";
import { Badge } from "./Badge"; 

export const AccountModal = ({ initial, onClose, onSave, loading }) => {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(
    isEdit
      ? { accountType: initial.accountType, currency: initial.currency, status: initial.status }
      : { accountType: "AHORRO", currency: "GTQ", balance: 0, ownerId: "" }
  );
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!isEdit && !form.ownerId.trim()) return setErr("El ID del propietario es obligatorio.");
    if (!form.balance) return setErr("El saldo es obligatorio.");
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
              {["AHORRO", "MONETARIA", "CREDITO"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Moneda">
            <select className="input-std" value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {["GTQ", "USD", "EUR"].map((c) => <option key={c}>{c}</option>)}
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
                {["ACTIVA", "BLOQUEADA"].map((s) => <option key={s} value={s}>{s}</option>)}
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
