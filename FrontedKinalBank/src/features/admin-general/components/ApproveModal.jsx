import { useState } from "react";

export const ApproveModal = ({ user, onClose, onConfirm, onDeny, loading }) => {
    const [role, setRole]             = useState("CLIENT");
    const [confirming, setConfirming] = useState(false);

    const fields = [
        ["Usuario",         user.Username],
        ["DPI",             user.DPI],
        ["Teléfono",        user.Phone],
        ["Trabajo",         user.Job],
        ["Ingreso mensual", `Q ${Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`],
        ["Dirección",       user.Address],
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Revisar solicitud</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Avatar + nombre */}
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 font-bold text-base flex items-center justify-center flex-shrink-0">
                            {user.Name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.Name}</p>
                            <p className="text-xs text-gray-400">{user.Email}</p>
                        </div>
                    </div>

                    {/* Grid de campos */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        {fields.map(([label, val]) => (
                            <div key={label}>
                                <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wide mb-0.5">{label}</p>
                                <p className="text-sm text-gray-900 font-medium">{val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Confirmación de denegación */}
                    {confirming ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-3">
                            <p className="text-sm font-semibold text-red-700">¿Seguro que deseas denegar esta solicitud?</p>
                            <p className="text-xs text-red-500">
                                El usuario <span className="font-semibold">{user.Name}</span> será eliminado permanentemente.
                            </p>
                            <div className="flex justify-center gap-3 pt-1">
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => onDeny(user.Id)}
                                    disabled={loading}
                                    className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold disabled:opacity-60 transition-colors"
                                >
                                    {loading ? "Denegando…" : "Sí, denegar"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Asignar rol
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 text-sm outline-none transition-colors bg-white"
                            >
                                <option value="CLIENT">CLIENT</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!confirming && (
                    <div className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => setConfirming(true)}
                            disabled={loading}
                            className="px-5 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 disabled:opacity-60 transition-colors"
                        >
                            ✕ Denegar
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => onConfirm(user.Id, role)}
                                disabled={loading}
                                className="px-5 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
                            >
                                {loading ? "Aprobando…" : "✓ Aprobar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};