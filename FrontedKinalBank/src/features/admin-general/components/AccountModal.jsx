import { useState, useEffect, useRef } from "react";
import { getApprovedUsers } from "../../../shared/api/users";

export const AccountModal = ({ initial, onClose, onSave, loading }) => {
    const isEdit = Boolean(initial?._id);

    const [form, setForm] = useState(
        isEdit
            ? { accountType: initial.accountType, currency: initial.currency, status: initial.status }
            : { accountType: "AHORRO", currency: "GTQ", balance: 0, ownerId: "" }
    );

    const [search, setSearch]             = useState("");
    const [results, setResults]           = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searching, setSearching]       = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);

    const [err, setErr] = useState("");

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    useEffect(() => {
        if (isEdit) return;

        if (!search.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await getApprovedUsers(search);
                setResults(res.data.users ?? []);
                setShowDropdown(true);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);

        return () => clearTimeout(debounceRef.current);
    }, [search]);

    const selectUser = (user) => {
        setSelectedUser(user);
        set("ownerId", user.Id);
        setSearch(`${user.Name} — ${user.DPI}`);
        setShowDropdown(false);
        setResults([]);
    };

    const clearUser = () => {
        setSelectedUser(null);
        set("ownerId", "");
        setSearch("");
    };

    const handleSubmit = async () => {
        if (!isEdit && !form.ownerId) return setErr("Debes seleccionar un propietario.");
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
                        <Field label="Propietario">
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <input
                                        className={inputClass()}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            if (selectedUser) clearUser();
                                        }}
                                        placeholder="Buscar por nombre o DPI…"
                                        autoComplete="off"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {searching && (
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
                                        )}
                                        {selectedUser && !searching && (
                                            <button
                                                onClick={clearUser}
                                                className="text-gray-300 hover:text-gray-500 text-sm leading-none"
                                                title="Limpiar selección"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {showDropdown && (
                                    <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                                        {results.length === 0 ? (
                                            <li className="px-4 py-3 text-xs text-gray-400 text-center">
                                                Sin resultados
                                            </li>
                                        ) : results.map((u) => (
                                            <li
                                                key={u.Id}
                                                onClick={() => selectUser(u)}
                                                className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                    {u.Name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{u.Name}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{u.DPI}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {selectedUser && (
                                <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                                    <span className="text-xs text-blue-800 font-semibold">{selectedUser.Name}</span>
                                    <span className="text-[10px] text-blue-400 font-mono">— {selectedUser.DPI}</span>
                                </div>
                            )}
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

                    {err && <p className="text-xs text-red-500">{err}</p>}
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
                        className="px-5 py-2 rounded-lg bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
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
    `w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 text-sm outline-none transition-colors bg-white`;