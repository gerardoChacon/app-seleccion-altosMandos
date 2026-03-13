import { UserCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./PerfilEvaluadoPage.module.css";

const empleado = {
  nombre: "Diego Lopez Gonzales",
  departamento: "Finanzas",
  fechaNacimiento: "24 de mayo de 1995",
  correo: "diegolop@gmail.com",
};

const metricas = [
  { label: "Asistencia",     puntaje: 80, color: styles.pink   },
  { label: "Cump. Horario",  puntaje: 70, color: styles.yellow },
  { label: "Incr. Ingreso",  puntaje: 80, color: styles.green  },
  { label: "Reducc. Costos", puntaje: 90, color: styles.purple },
];

const puntajeTotal = 80;

export default function PerfilEvaluadoPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <img src="/waves.png" alt="" className={styles.bgWaves} />

        <div className={styles.body}>

          {/* columna izquierda: avatar arriba fijo, infoCard abajo */}
          <div className={styles.left}>
            <div className={styles.avatar}>
              <UserCircle size={80} />
            </div>
            <div className={styles.infoCard}>
              <p className={styles.nombre}>{empleado.nombre}</p>
              <p className={styles.infoItem}>Departamento: {empleado.departamento}</p>
              <p className={styles.infoItem}>Fecha de nacimiento: {empleado.fechaNacimiento}</p>
              <p className={styles.infoItem}>Correo: {empleado.correo}</p>
            </div>
          </div>

          {/* card derecha: resultado + resumen dentro de una sola card */}
          <div className={styles.rightCard}>
            <div className={styles.resultSection}>
              <p className={styles.resultTitle}>Tu Resultado</p>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNum}>{puntajeTotal}</span>
                <span className={styles.scoreMax}>de 100</span>
              </div>
              <p className={styles.resultLabel}>¡Bien!</p>
              <p className={styles.resultDesc}>
                Tu puntaje es mas alto que el 65% de los empleados que han tomado los examenes
              </p>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.summaryTitle}>Resumen</p>
              <div className={styles.metricList}>
                {metricas.map((m) => (
                  <div key={m.label} className={`${styles.metricItem} ${m.color}`}>
                    <span>{m.label}</span>
                    <span>{m.puntaje} / 100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}


