import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Panel izquierdo (form) */}
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>LOGIN</h1>

          <div className={styles.avatarWrapper}>
            <UserCircle size={48} color="#2d3e50" />
          </div>

          {/* Correo */}
          <input
            type="email"
            placeholder="Correo"
            className={styles.input}
          />

          {/* Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            className={styles.input}
          />

          {/* Recuperar contraseña, aqui usamos el Link de React Router para navegar sin recargar la pagina */}
          <Link to="/recuperar-contrasena" className={styles.forgotPassword}>
            ¿Olvidaste la contraseña?
          </Link>

          {/* Boton entrar */}
          <button className={styles.button}>Entrar</button>
        </div>

        {/* Panel derecho */}
        <div className={styles.rightPanel} />
      </div>
    </div>
  );
}

