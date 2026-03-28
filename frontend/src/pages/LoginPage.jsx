import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [correo,     setCorreo]     = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(correo, contrasena);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message ?? "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.leftPanel}>
          <h1 className={styles.title}>LOGIN</h1>

          <div className={styles.avatarWrapper}>
            <UserCircle size={48} color="#2d3e50" />
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo"
              className={styles.input}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              className={styles.input}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            {error && (
              <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                {error}
              </p>
            )}

            <Link to="/recuperar-contrasena" className={styles.forgotPassword}>
              ¿Olvidaste la contraseña?
            </Link>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div className={styles.rightPanel} />
      </div>
    </div>
  );
}
