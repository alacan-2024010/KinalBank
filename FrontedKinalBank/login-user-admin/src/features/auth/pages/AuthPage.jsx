import { useState } from "react"
import { ForgotPasswordForm } from "../components/ForgotPassword"
import { LoginForm } from "../components/LoginForm"
import { RegisterForm } from "../components/RegisterForm"

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    return (
        <div style={{
            width: "100%",
            padding: "2.5rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div className="auth-card fade-in" style={{
                width: "100%",
                maxWidth: "420px",
                padding: "2.5rem 2rem",
            }}>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <img
                        src="/src/assets/img/KinalBank.png"
                        alt="KinalBank"
                        style={{ height: "72px", objectFit: "contain" }}
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
                        {isForgot
                            ? "Recuperar contraseña"
                            : isRegister
                                ? "Crear cuenta"
                                : "Bienvenido"}
                    </h1>
                    <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                        {isForgot
                            ? "Ingresa tus datos para continuar"
                            : isRegister
                                ? "Completa los datos para registrarte"
                                : "Ingresa a tu cuenta"}
                    </p>
                </div>

                {isForgot ? (
                    <ForgotPasswordForm onSwitch={() => setIsForgot(false)} />
                ) : isRegister ? (
                    <RegisterForm onSwitch={() => setIsRegister(false)} />
                ) : (
                    <LoginForm
                        onForgot={() => setIsForgot(true)}
                        onRegister={() => setIsRegister(true)}
                    />
                )}

            </div>
        </div>
    )
}