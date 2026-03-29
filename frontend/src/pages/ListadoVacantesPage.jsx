import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "./ListadoVacantesPage.module.css";

export default function ListadoVacantesPage() {
  const [vacantes, setVacantes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [aplicando, setAplicando] = useState(new Set());
  const [resultados, setResultados] = useState({});

  const { usuario } = useAuth();
  const esEmpleado = usuario?.rol?.nombre_rol === 'empleado';

  useEffect(() => {
    api.get("/vacantes?estatus=disponible&per_page=50")
      .then((res) => setVacantes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleAplicar(id_vacante) {
    setAplicando((prev) => new Set(prev).add(id_vacante));
    try {
      const res = await api.post(`/vacantes/${id_vacante}/aplicar`);
      setResultados((prev) => ({ ...prev, [id_vacante]: { compatible: res.compatible, message: res.message } }));
    } catch (err) {
      setResultados((prev) => ({ ...prev, [id_vacante]: { compatible: false, message: err.message ?? "Error al aplicar." } }));
    } finally {
      setAplicando((prev) => { const s = new Set(prev); s.delete(id_vacante); return s; });
    }
  }

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
            {vacantes.map((v) => {
              const resultado = resultados[v.id_vacante];
              return (
                <div key={v.id_vacante} className={styles.card}>
                  <div className={styles.cardTop}>
                    <img src="/logo.png" alt="logo empresa" className={styles.logo} />
                    <div className={styles.cardInfo}>
                      <p className={styles.cardTitle}>{v.puesto?.nombre_puesto}</p>
                      <p className={styles.cardDesc}>{v.descripcion ?? v.area?.nombre_area}</p>
                    </div>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.fecha}>{v.fecha_apertura?.slice(0, 10).split('-').reverse().join('/')}</span>
                    <span className={styles.badge}>Activa</span>
                  </div>

                  {esEmpleado && (
                    <div style={{ marginTop: 12 }}>
                      {resultado ? (
                        <p style={{
                          fontSize: 13,
                          color: resultado.compatible ? "#0d7a5f" : "#b91c1c",
                          background: resultado.compatible ? "#d1fae5" : "#fee2e2",
                          borderRadius: 8,
                          padding: "6px 10px",
                        }}>
                          {resultado.message}
                        </p>
                      ) : (
                        <button
                          onClick={() => handleAplicar(v.id_vacante)}
                          disabled={aplicando.has(v.id_vacante)}
                          style={{
                            width: "100%", padding: "8px 0",
                            background: "#5b7290", color: "#fff",
                            border: "none", borderRadius: 8,
                            fontSize: 13, cursor: "pointer",
                            opacity: aplicando.has(v.id_vacante) ? 0.6 : 1,
                          }}
                        >
                          {aplicando.has(v.id_vacante) ? "Aplicando..." : "Aplicar"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {vacantes.length === 0 && (
              <p style={{ color: "#6b7d8e" }}>No hay vacantes disponibles.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
