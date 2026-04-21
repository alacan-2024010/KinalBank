import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export const LoginForm = ({ onForgot, onRegister }) => {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const login = useAuthStore(state => state.login)
    const loading = useAuthStore(state => state.loading)

    const onSubmit = async (data) => {
        const res = await login(data)
        if (res.success) {
            toast.success("Bienvenido")
            navigate("/dashboard")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
                <label className="field-label">Correo electrónico</label>
                <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    {...register("email", { required: "El correo es obligatorio" })}
                />
                {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            <div>
                <label className="field-label">Contraseña</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "La contraseña es obligatoria" })}
                />
                {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                <button type="button" onClick={onForgot} className="auth-link">
                    ¿Olvidaste tu contraseña?
                </button>
            </p>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={onRegister} className="auth-link">
                    Registrarse
                </button>
            </p>

        </form>
    )
}