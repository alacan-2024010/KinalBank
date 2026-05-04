import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore.js"
import toast from "react-hot-toast"
import { useState } from "react"

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
  },
  label: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#6b7280",
    display: "block",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    color: "#111827",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "2px",
    padding: "11px 14px",
    outline: "none",
    display: "block",
    transition: "border-color 180ms, box-shadow 180ms",
    appearance: "none",
    WebkitAppearance: "none",
  },
  errorMsg: {
    fontSize: "11px",
    color: "#dc2626",
    margin: "4px 0 0",
  },
  btn: {
    width: "100%",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#ffffff",
    background: "#1f2937",
    border: "1px solid #1f2937",
    borderRadius: "2px",
    padding: "14px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 180ms, box-shadow 180ms",
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  backLink: {
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
    fontSize: "12px",
    color: "#6b7280",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationColor: "transparent",
    textUnderlineOffset: "2px",
    transition: "color 180ms, text-decoration-color 180ms",
  },
}

const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={styles.label}>{label}</label>
    {children}
    {error && <p style={styles.errorMsg}>{error}</p>}
  </div>
)

export const ForgotPasswordForm = ({ onSwitch }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const newPassword = watch("newPassword")
  const forgotPassword = useAuthStore(state => state.forgotPassword)
  const loading = useAuthStore(state => state.loading)
  const [hoverBtn, setHoverBtn] = useState(false)
  const [hoverLink, setHoverLink] = useState(false)

  const onSubmit = async (data) => {
    const res = await forgotPassword(data)
    if (res.success) {
      toast.success("Contraseña actualizada")
      onSwitch()
    }
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'); .forgot-input:focus { border-color: #374151 !important; box-shadow: 0 0 0 3px rgba(31,41,55,.08) !important; }`}</style>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>

        <Field label="Username" error={errors.username && "Requerido"}>
          <input
            className="forgot-input"
            style={errors.username ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" } : styles.input}
            placeholder="tuusername"
            {...register("username", { required: true })}
          />
        </Field>

        <Field label="DPI" error={errors.dpi && "Requerido"}>
          <input
            className="forgot-input"
            style={errors.dpi ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" } : styles.input}
            placeholder="1234567890101"
            {...register("dpi", { required: true })}
          />
        </Field>

        <Field label="Nueva contraseña" error={errors.newPassword && "Requerido"}>
          <input
            className="forgot-input"
            style={errors.newPassword ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" } : styles.input}
            type="password"
            placeholder="••••••••"
            {...register("newPassword", { required: true })}
          />
        </Field>

        <Field label="Confirmar contraseña" error={errors.confirmPassword?.message}>
          <input
            className="forgot-input"
            style={errors.confirmPassword ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" } : styles.input}
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              validate: value => value === newPassword || "Las contraseñas no coinciden"
            })}
          />
        </Field>

        <button
          type="submit"
          style={loading ? { ...styles.btn, ...styles.btnDisabled } : hoverBtn ? { ...styles.btn, background: "#111827", boxShadow: "0 4px 12px rgba(17,24,39,.18)" } : styles.btn}
          disabled={loading}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
        >
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </button>

        <p style={{ textAlign: "center", margin: 0 }}>
          <button
            type="button"
            onClick={onSwitch}
            style={hoverLink ? { ...styles.backLink, color: "#111827", textDecorationColor: "#111827" } : styles.backLink}
            onMouseEnter={() => setHoverLink(true)}
            onMouseLeave={() => setHoverLink(false)}
          >
            ← Volver al login
          </button>
        </p>

      </form>
    </>
  )
}