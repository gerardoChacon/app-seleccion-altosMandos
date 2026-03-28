import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./ListadoVacantesPage.module.css";

export default function ListadoVacantesPage() {
  const [vacantes, setVacantes] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get("/vacantes?estatus=disponible&per_page=50")
      .then((res) => setVacantes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Vacantes</h1>
        <hr className={styles.divider} />

        {loading ? (
          <p style={{ color: "#6b7d8e" }}>Cargando vacantes...</p>
        ) : (
          <div className={styles.grid}>
            {vacantes.map((v) => (
              <div key={v.id_vacante} className={styles.card}>
                <div className={styles.cardTop}>
                  <img src="/logo.png" alt="logo empresa" className={styles.logo} />
                  <div className={styles.cardInfo}>
                    <p className={styles.cardTitle}>{v.puesto?.nombre_puesto}</p>
                    <p className={styles.cardDesc}>{v.descripcion ?? v.area?.nombre_area}</p>
                  </div>
                </div>
                <div className={styles.cardBottom}>
                  <span className={styles.fecha}>{v.fecha_apertura}</span>
                  <span className={styles.badge}>Activa</span>
                </div>
              </div>
            ))}
            {vacantes.length === 0 && (
              <p style={{ color: "#6b7d8e" }}>No hay vacantes disponibles.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
