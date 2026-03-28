import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import api from "../services/api";
import styles from "./RecuperarContrasenaPage.module.css";

// Pasos: 1 = ingresar correo, 2 = ingresar código, 3 = nueva contraseña
export default function RecuperarContrasenaPage() {
  const [paso,          setPaso]          = useState(1);
  const [correo,        setCorreo]        = useState("");
  const [codigo,        setCodigo]        = useState("");
  const [nuevaPass,     setNuevaPass]     = useState("");
  const [confirmPass,   setConfirmPass]   = useState("");
  const [error,         setError]         = useState("");
  const [mensaje,       setMensaje]       = useState("");
  const [loading,       setLoading]       = useState(false);

  const navigate = useNavigate();

  async function handleEnviarCodigo() {
    if (!correo) return;
    setError(""); setMensaje(""); setLoading(true);
    try {
      await api.post("/auth/forgot-password", { correo });
      setMensaje("Código enviado. Revisa tu correo.");
      setPaso(2);
    } catch (err) {
      setError(err.message ?? "Error al enviar el código.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerificarCodigo() {
    if (!codigo) return;
    setError(""); setLoading(true);
    try {
      await api.post("/auth/verify-code", { correo, codigo });
      setMensaje("Código válido. Ingresa tu nueva contraseña.");
      setPaso(3);
    } catch (err) {
      setError(err.message ?? "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuardarContrasena() {
    if (nuevaPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (nuevaPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        correo,
        codigo,
        nueva_contrasena: nuevaPass,
      });
      navigate("/");
    } catch (err) {
      setError(err.message ?? "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.leftPanel} />

        <div className={styles.rightPanel}>
          <h1 className={styles.title}>RECUPERAR<br />CONTRASEÑA</h1>

          <div className={styles.avatarWrapper}>
            <UserCircle size={48} color="#2d3e50" />
          </div>

          {/* Paso 1: correo */}
          <input
            type="email"
            placeholder="Correo"
            className={styles.input}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={paso > 1}
          />
          <button
            className={styles.button}
            onClick={handleEnviarCodigo}
            disabled={loading || paso > 1}
          >
            {loading && paso === 1 ? "Enviando..." : "Enviar código"}
          </button>

          <hr className={styles.divider} />

          {/* Paso 2: código */}
          <p className={styles.hint}>Ingresa el código que se envió a tu correo</p>
          <input
            type="text"
            placeholder="Código"
            className={styles.input}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={paso < 2 || paso > 2}
          />
          {paso === 2 && (
            <button
              className={styles.button}
              onClick={handleVerificarCodigo}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          )}

          {/* Paso 3: nueva contraseña */}
          {paso === 3 && (
            <>
              <input
                type="password"
                placeholder="Nueva contraseña"
                className={styles.input}
                value={nuevaPass}
                onChange={(e) => setNuevaPass(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className={styles.input}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <button
                className={styles.button}
                onClick={handleGuardarContrasena}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </>
          )}

          {error   && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>}
          {mensaje && <p style={{ color: "#0d7a5f", fontSize: "0.85rem", marginTop: "0.5rem" }}>{mensaje}</p>}
        </div>

      </div>
    </div>
  );
}
