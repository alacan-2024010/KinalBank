import { useEffect, useState } from "react";
import { useUsersStore } from "../store/UserStore";
import { ApproveModal } from "../components/ApproveModal";

export const UsersPage = () => {
    const {
        pendingUsers = [], loading, error,
        getPendingUsers, approveUser, clearError,
    } = useUsersStore();

    const [selected, setSelected] = useState(null);

    useEffect(() => { getPendingUsers(); }, []);

    const handleApprove = async (userId, role) => {
        const result = await approveUser(userId, role);
        if (result?.success) setSelected(null);
    };

    return (
        <>
            <div className="w-full max-w-7xl mx-auto font-sans">

                {/* Error */}
                {error && (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
                        <span>{error}</span>
                        <button onClick={clearError} className="text-red-400 hover:text-red-600 text-base ml-4">✕</button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Solicitudes pendientes
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {pendingUsers.length} usuario{pendingUsers.length !== 1 ? "s" : ""} esperando aprobación
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {loading && pendingUsers.length === 0 ? (
                        <div className="flex flex-col items-center py-20 gap-3">
                            <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 border-t-orange-500 animate-spin" />
                            <p className="text-sm text-gray-400">Cargando solicitudes…</p>
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-5xl mb-3">✅</p>
                            <p className="font-semibold text-gray-500 text-sm">Sin solicitudes pendientes</p>
                            <p className="text-gray-400 text-xs mt-1">Todos los usuarios han sido procesados.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">

                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        {["Nombre", "Usuario", "Correo", "DPI", "Teléfono", "Trabajo", "Ingreso", "Acciones"].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {pendingUsers.map((user) => (
                                        <tr key={user.Id} className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors">

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
                                                        {user.Name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        {user.Name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                                    @{user.Username}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {user.Email}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                                    {user.DPI}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {user.Phone}
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {user.Job}
                                            </td>

                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                Q {Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                            </td>

                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setSelected(user)}
                                                    className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-xs font-semibold text-orange-600 hover:bg-orange-100 hover:border-orange-300 transition-colors"
                                                >
                                                    Revisar →
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selected && (
                <ApproveModal
                    user={selected}
                    onClose={() => setSelected(null)}
                    onConfirm={handleApprove}
                    loading={loading}
                />
            )}
        </>
    );
};