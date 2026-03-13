import Sidebar from "../components/Sidebar";
import styles from "./RegistrarEvaluacionPage.module.css";

export default function RegistrarEvaluacionPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Registrar de Evaluación</h1>
        <p className={styles.pageSubtitle}>Completa la información de los resultados de la evaluación</p>
        <hr className={styles.divider} />

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Información general</h2>

          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Asistencia</label>
              <input type="number" className={styles.input} min="0" max="100" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Incremento de Ingresos</label>
              <input type="number" className={styles.input} min="0" max="100" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Cumplimiento de Horario</label>
              <input type="number" className={styles.input} min="0" max="100" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Reduccion de costos</label>
              <input type="number" className={styles.input} min="0" max="100" />
            </div>
          </div>

          <button className={styles.saveBtn}>Guardar</button>
        </div>
      </main>
    </div>
  );
}
