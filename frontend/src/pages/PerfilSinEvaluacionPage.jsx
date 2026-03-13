import { UserCircle, ClipboardList } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./PerfilSinEvaluacionPage.module.css";

const empleado = {
  nombre: "Diego Lopez Gonzales",
  departamento: "Finanzas",
  fechaNacimiento: "24 de mayo de 1995",
  correo: "diegolop@gmail.com",
};

const metricas = [
  { label: "Asistencia",     color: styles.pink   },
  { label: "Cump. Horario",  color: styles.yellow },
  { label: "Incr. Ingreso",  color: styles.green  },
  { label: "Reducc. Costos", color: styles.purple },
];

export default function PerfilSinEvaluacionPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <img src="/waves.png" alt="" className={styles.bgWaves} />

        <div className={styles.body}>

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

          <div className={styles.rightCard}>
            <div className={styles.resultSection}>
              <p className={styles.sinEvalTitle}>Sin evaluación</p>
              <div className={styles.iconCircle}>
                <ClipboardList size={56} color="rgba(255,255,255,0.85)" />
              </div>
              <p className={styles.sinEvalDesc}>Este empleado aún no ha sido evaluado</p>
              <button className={styles.evalBtn}>Realizar evaluación</button>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.summaryTitle}>Resumen</p>
              <div className={styles.metricList}>
                {metricas.map((m) => (
                  <div key={m.label} className={`${styles.metricItem} ${m.color}`}>
                    <span>{m.label}</span>
                    <span>-- / --</span>
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

