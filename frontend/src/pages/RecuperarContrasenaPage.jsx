import { useState } from "react";
import { UserCircle } from "lucide-react";
import styles from "./RecuperarContrasenaPage.module.css";

export default function RecuperarContrasenaPage() {
  // useState guarda si el usuario ya envio el codigo o no
  // false = aun no envio, true = ya envio y mostramos el campo codigo
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Panel izquierdo: imagen decorativa ── */}
        <div className={styles.leftPanel} />

        {/* ── Panel derecho: formulario ── */}
        <div className={styles.rightPanel}>
          <h1 className={styles.title}>RECUPERAR<br />CONTRASEÑA</h1>

          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            <UserCircle size={48} color="#2d3e50" />
          </div>

          {/* Seccion 1: ingresar correo */}
          <input
            type="email"
            placeholder="Correo"
            className={styles.input}
          />
          {/* Si hacemos clic enviamos el codigo */}
          <button
            className={styles.button}
            onClick={() => setCodigoEnviado(true)}
          >
            Enviar código
          </button>

          {/* Linea divisora */}
          <hr className={styles.divider} />

          {/* Seccion 2: ingresar codigo */}
          <p className={styles.hint}>Ingresa el código que se envió a tu correo</p>
          <input
            type="text"
            placeholder="Codigo"
            className={styles.input}
            disabled={!codigoEnviado}  /* Aqui esta deshabilitado hasta que se mande el codigo */
          />
          <button className={styles.button}>Entrar</button>
        </div>

      </div>
    </div>
  );
}

