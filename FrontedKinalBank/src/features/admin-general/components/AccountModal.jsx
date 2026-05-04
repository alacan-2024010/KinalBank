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
        if (!isEdit && form.balance === undefined) return setErr("El saldo es obligatorio.");
        setErr("");
        const result = await onSave(form);
        if (result?.success === false) setErr(result.message);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isEdit ? "Editar cuenta" : "Nueva cuenta"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {!isEdit && (
                        <Field label="ID del propietario">
                            <input
                                className={inputClass()}
                                value={form.ownerId}
                                onChange={(e) => set("ownerId", e.target.value)}
                                placeholder="Mongo ObjectId del usuario"
                            />
                        </Field>
                    )}

                    <Field label="Tipo de cuenta">
                        <select className={inputClass()} value={form.accountType} onChange={(e) => set("accountType", e.target.value)}>
                            {["AHORRO", "MONETARIA", "CREDITO"].map((t) => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Moneda">
                        <select className={inputClass()} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                            {["GTQ", "USD", "EUR"].map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </Field>

                    {!isEdit && (
                        <Field label="Saldo inicial">
                            <input
                                type="number"
                                min="0"
                                className={inputClass()}
                                value={form.balance}
                                onChange={(e) => set("balance", Number(e.target.value))}
                                placeholder="0.00"
                            />
                        </Field>
                    )}

                    {isEdit && (
                        <Field label="Estado">
                            <select className={inputClass()} value={form.status} onChange={(e) => set("status", e.target.value)}>
                                {["ACTIVA", "BLOQUEADA"].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </Field>
                    )}

                    {err && <p className="text-xs text-orange-500">{err}</p>}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors"
                    >
                        {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cuenta"}
                    </button>
                </div>
            </div>
        </div>
    );
};

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {label}
            </label>
            {children}
        </div>
    );
}

const inputClass = () =>
    `w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-orange-500 text-sm outline-none transition-colors bg-white`;