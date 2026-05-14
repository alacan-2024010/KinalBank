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
  alertError: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "4px",
    border: "1px solid #fca5a5",
    background: "#fef2f2",
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
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm()
  const newPassword = watch("newPassword")
  const forgotPassword = useAuthStore(state => state.forgotPassword)
  const loading = useAuthStore(state => state.loading)
  const [hoverBtn, setHoverBtn] = useState(false)
  const [hoverLink, setHoverLink] = useState(false)
  const [formError, setFormError] = useState(null)

  const onSubmit = async (data) => {
    setFormError(null)
    const res = await forgotPassword(data)

    if (res.success) {
      toast.success("Contraseña actualizada")
      onSwitch()
    } else {
      setFormError(res.error)

      const msg = res.error?.toLowerCase() || ""

      if (msg.includes("username") || msg.includes("usuario")) {
        setError("username", { message: "Username incorrecto" })
      }
      if (msg.includes("dpi")) {
        setError("dpi", { message: "DPI incorrecto" })
      }
      // Si el backend no especifica cuál falló, marcar ambos
      if (!msg.includes("username") && !msg.includes("usuario") && !msg.includes("dpi")) {
        setError("username", { message: "Verifique su username" })
        setError("dpi", { message: "Verifique su DPI" })
      }
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        .forgot-input:focus { border-color: #374151 !important; box-shadow: 0 0 0 3px rgba(31,41,55,.08) !important; }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>

        <Field label="Username" error={errors.username?.message}>
          <input
            className="forgot-input"
            style={errors.username
              ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" }
              : styles.input
            }
            placeholder="tuusername"
            {...register("username", { required: "Requerido" })}
          />
        </Field>

        <Field label="DPI" error={errors.dpi?.message}>
          <input
            className="forgot-input"
            style={errors.dpi
              ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" }
              : styles.input
            }
            placeholder="1234567890101"
            {...register("dpi", {
              required: "Requerido",
              pattern: { value: /^\d{13}$/, message: "El DPI debe tener 13 dígitos" }
            })}
          />
        </Field>

        <Field label="Nueva contraseña" error={errors.newPassword?.message}>
          <input
            className="forgot-input"
            style={errors.newPassword
              ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" }
              : styles.input
            }
            type="password"
            placeholder="••••••••"
            {...register("newPassword", {
              required: "Requerido",
              minLength: { value: 8, message: "Mínimo 8 caracteres" }
            })}
          />
        </Field>

        <Field label="Confirmar contraseña" error={errors.confirmPassword?.message}>
          <input
            className="forgot-input"
            style={errors.confirmPassword
              ? { ...styles.input, borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.07)" }
              : styles.input
            }
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Requerido",
              validate: value => value === newPassword || "Las contraseñas no coinciden"
            })}
          />
        </Field>

        {formError && (
          <div style={styles.alertError}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18"
              style={{ flexShrink: 0, marginTop: "1px", color: "#dc2626" }}>
              <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M10 7v3.5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#991b1b", margin: "0 0 3px", letterSpacing: "0.04em" }}>
                No se pudo actualizar la contraseña
              </p>
              <p style={{ fontSize: "12px", color: "#b91c1c", lineHeight: 1.55, margin: 0 }}>
                {formError}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          style={
            loading
              ? { ...styles.btn, ...styles.btnDisabled }
              : hoverBtn
                ? { ...styles.btn, background: "#111827", boxShadow: "0 4px 12px rgba(17,24,39,.18)" }
                : styles.btn
          }
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
            style={hoverLink
              ? { ...styles.backLink, color: "#111827", textDecorationColor: "#111827" }
              : styles.backLink
            }
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