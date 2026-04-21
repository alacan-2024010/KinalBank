import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore.js"
import toast from "react-hot-toast"

export const ForgotPasswordForm = ({ onSwitch }) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const newPassword = watch("newPassword")
    const forgotPassword = useAuthStore(state => state.forgotPassword)
    const loading = useAuthStore(state => state.loading)

    const onSubmit = async (data) => {
        const res = await forgotPassword(data)
        if (res.success) {
            toast.success("Contraseña actualizada")
            onSwitch()
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
                <label className="field-label">Username</label>
                <input placeholder="tuusername" {...register("username", { required: true })} />
            </div>

            <div>
                <label className="field-label">DPI</label>
                <input placeholder="1234567890101" {...register("dpi", { required: true })} />
            </div>

            <div>
                <label className="field-label">Nueva contraseña</label>
                <input type="password" placeholder="••••••••" {...register("newPassword", { required: true })} />
            </div>

            <div>
                <label className="field-label">Confirmar contraseña</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                        validate: value => value === newPassword || "Las contraseñas no coinciden"
                    })}
                />
                {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Actualizando..." : "Cambiar contraseña"}
            </button>

            <p style={{ textAlign: "center" }}>
                <button type="button" onClick={onSwitch} className="auth-link">
                    ← Volver al login
                </button>
            </p>

        </form>
    )
}