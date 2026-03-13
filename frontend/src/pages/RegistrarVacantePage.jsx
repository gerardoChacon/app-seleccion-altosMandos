import { useState } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./RegistrarVacantePage.module.css";

const aptitudes = [
  "Incremento de ingresos",
  "Reduccion de costos",
  "Cumplimiento de metas estrategicas",
  "Asistencia",
  "Cumplimiento de horarios",
];

export default function RegistrarVacantePage() {
  const [seleccionadas, setSeleccionadas] = useState(
    aptitudes.map(() => true)
  );

  function toggleAptitud(index) {
    setSeleccionadas((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Registrar de Vacante</h1>
        <p className={styles.pageSubtitle}>Completa la información de la vacante</p>
        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Información general</h2>
        <div className={styles.grid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Puesto</label>
            <input type="text" className={styles.input} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Fecha de Apertura</label>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Area</label>
            <input type="text" className={styles.input} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Estatus</label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Aptitudes necesarias</h2>
        <div className={styles.checkGrid}>
          {aptitudes.map((aptitud, index) => (
            <label key={index} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={seleccionadas[index]}
                onChange={() => toggleAptitud(index)}
              />
              {aptitud}
            </label>
          ))}
        </div>

        <button className={styles.saveBtn}>Guardar</button>
      </main>
    </div>
  );
}

