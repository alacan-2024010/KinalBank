export const ConfirmModal = ({ account, onClose, onConfirm, loading }) => (
    <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7 text-center"
            onClick={(e) => e.stopPropagation()}
        >
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="font-semibold text-base text-gray-900 mb-2">Eliminar cuenta</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                ¿Seguro que deseas eliminar la cuenta{" "}
                <span className="font-mono font-semibold text-gray-700">{account.accountNumber}</span>?
                Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-center">
                <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
                >
                    {loading ? "Eliminando…" : "Eliminar"}
                </button>
            </div>
        </div>
    </div>
);