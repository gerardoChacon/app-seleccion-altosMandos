import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./RegistrarEvaluacionPage.module.css";

export default function RegistrarEvaluacionPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [aptitudes, setAptitudes] = useState([]);
  const [scores,    setScores]    = useState({});   // { id_aptitud: porcentaje_obtenido }
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    api.get("/aptitudes")
      .then((res) => {
        setAptitudes(res.data);
        const inicial = {};
        res.data.forEach((a) => { inicial[a.id_aptitud] = 0; });
        setScores(inicial);
      })
      .catch(console.error);
  }, []);

  async function handleGuardar() {
    setError(""); setLoading(true);
    try {
      const invalida = aptitudes.find((a) => {
        const v = Number(scores[a.id_aptitud] ?? 0);
        return v < 0 || v > 100;
      });
      if (invalida) {
        setError(`El valor de "${invalida.nombre_aptitud}" debe estar entre 0 y 100.`);
        setLoading(false);
        return;
      }

      const aptitudesData = aptitudes.map((a) => ({
        id_aptitud:          a.id_aptitud,
        porcentaje_obtenido: Number(scores[a.id_aptitud] ?? 0),
      }));

      await api.post(`/empleados/${id}/aptitudes`, { aptitudes: aptitudesData });
      navigate(`/perfil-evaluado/${id}`);
    } catch (err) {
      setError(err.message ?? "Error al guardar la evaluación.");
    } finally {
      setLoading(false);
    }
  }

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
            {aptitudes.map((a) => (
              <div key={a.id_aptitud} className={styles.fieldGroup}>
                <label className={styles.label}>{a.nombre_aptitud}</label>
                <input
                  type="number"
                  className={styles.input}
                  min="0"
                  max="100"
                  value={scores[a.id_aptitud] ?? 0}
                  onChange={(e) => {
                    const v = e.target.value === "" ? "" : Math.min(100, Math.max(0, Number(e.target.value)));
                    setScores((prev) => ({ ...prev, [a.id_aptitud]: v }));
                  }}
                />
              </div>
            ))}
          </div>

          {error && <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>}

          <button className={styles.saveBtn} onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </main>
    </div>
  );
}
