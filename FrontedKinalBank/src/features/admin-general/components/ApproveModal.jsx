import { useState } from "react";

export const ApproveModal = ({ user, onClose, onConfirm, loading }) => {
    const [role, setRole] = useState("CLIENT");

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
                    <h2 className="text-lg font-semibold text-gray-900">Aprobar solicitud</h2>
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
                        <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-bold text-base flex items-center justify-center flex-shrink-0">
                            {user.Name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.Name}</p>
                            <p className="text-xs text-gray-400">{user.Email}</p>
                        </div>
                    </div>

                    {/* Grid de campos */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        {fields.map(([label, val]) => (
                            <div key={label}>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                                <p className="text-sm text-gray-900 font-medium">{val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Select de rol */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Asignar rol
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-orange-500 text-sm outline-none transition-colors bg-white"
                        >
                            <option value="CLIENT">CLIENT</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
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
                        onClick={() => onConfirm(user.Id, role)}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
                    >
                        {loading ? "Aprobando…" : "✓ Aprobar"}
                    </button>
                </div>
            </div>
        </div>
    );
};