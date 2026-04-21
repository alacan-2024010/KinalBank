import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

export const RegisterForm = ({ onSwitch }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const registerUser = useAuthStore(state => state.register)
    const loading = useAuthStore(state => state.loading)

    const onSubmit = async (data) => {
        const res = await registerUser(data)
        if (res.success) {
            toast.success("Registro exitoso")
            onSwitch()
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div className="scroll-fields">

                <div className="two-col">
                    <div>
                        <label className="field-label">Nombre completo</label>
                        <input placeholder="Ana García" {...register("name", { required: true })} />
                    </div>
                    <div>
                        <label className="field-label">Username</label>
                        <input placeholder="anagarcia" {...register("username", { required: true })} />
                    </div>
                </div>

                <div>
                    <label className="field-label">Correo electrónico</label>
                    <input type="email" placeholder="correo@ejemplo.com" {...register("email", { required: true })} />
                </div>

                <div>
                    <label className="field-label">Contraseña</label>
                    <input type="password" placeholder="••••••••" {...register("password", { required: true })} />
                </div>

                <div className="two-col">
                    <div>
                        <label className="field-label">DPI</label>
                        <input placeholder="1234567890101" {...register("dpi", { required: true })} />
                    </div>
                    <div>
                        <label className="field-label">Teléfono</label>
                        <input placeholder="+502 0000-0000" {...register("phone", { required: true })} />
                    </div>
                </div>

                <div>
                    <label className="field-label">Dirección</label>
                    <input placeholder="Ciudad de Guatemala, Zona 10" {...register("address", { required: true })} />
                </div>

                <div className="two-col">
                    <div>
                        <label className="field-label">Ocupación</label>
                        <input placeholder="Desarrollador" {...register("job", { required: true })} />
                    </div>
                    <div>
                        <label className="field-label">Ingresos mensuales</label>
                        <input type="number" placeholder="Q 5,000" {...register("monthlyIncome", { required: true })} />
                    </div>
                </div>

            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Registrando..." : "Crear cuenta"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={onSwitch} className="auth-link">
                    Iniciar sesión
                </button>
            </p>

        </form>
    )
}