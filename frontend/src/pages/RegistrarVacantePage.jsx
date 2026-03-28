import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./RegistrarVacantePage.module.css";

export default function RegistrarVacantePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_puesto: "", id_area: "", fecha_apertura: "", estatus: "disponible",
  });

  const [puestos,    setPuestos]    = useState([]);
  const [areas,      setAreas]      = useState([]);
  const [aptitudes,  setAptitudes]  = useState([]);   // todas las aptitudes disponibles
  const [seleccion,  setSeleccion]  = useState({});    // { id_aptitud: { checked, porcentaje_minimo } }
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/puestos"),
      api.get("/areas"),
      api.get("/aptitudes"),
    ]).then(([p, a, apt]) => {
      setPuestos(p.data);
      setAreas(a.data);
      setAptitudes(apt.data);
      const inicial = {};
      apt.data.forEach((a) => { inicial[a.id_aptitud] = { checked: false, porcentaje_minimo: 70 }; });
      setSeleccion(inicial);
    }).catch(console.error);
  }, []);

  function toggleAptitud(id) {
    setSeleccion((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked },
    }));
  }

  function setPorcentaje(id, val) {
    setSeleccion((prev) => ({
      ...prev,
      [id]: { ...prev[id], porcentaje_minimo: val },
    }));
  }

  async function handleGuardar() {
    setError(""); setLoading(true);
    try {
      const aptitudesSeleccionadas = aptitudes
        .filter((a) => seleccion[a.id_aptitud]?.checked)
        .map((a) => ({
          id_aptitud:       a.id_aptitud,
          porcentaje_minimo: Number(seleccion[a.id_aptitud].porcentaje_minimo),
        }));

      await api.post("/vacantes", {
        ...form,
        aptitudes: aptitudesSeleccionadas,
      });

      navigate("/vacantes");
    } catch (err) {
      setError(err.message ?? "Error al guardar la vacante.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Registrar Vacante</h1>
        <p className={styles.pageSubtitle}>Completa la información de la vacante</p>
        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Información general</h2>
        <div className={styles.grid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Puesto</label>
            <select className={styles.input} value={form.id_puesto} onChange={(e) => setForm((f) => ({ ...f, id_puesto: e.target.value }))}>
              <option value="">-- Seleccionar --</option>
              {puestos.map((p) => <option key={p.id_puesto} value={p.id_puesto}>{p.nombre_puesto}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Fecha de Apertura</label>
            <input type="date" className={styles.input} value={form.fecha_apertura} onChange={(e) => setForm((f) => ({ ...f, fecha_apertura: e.target.value }))} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Área</label>
            <select className={styles.input} value={form.id_area} onChange={(e) => setForm((f) => ({ ...f, id_area: e.target.value }))}>
              <option value="">-- Seleccionar --</option>
              {areas.map((a) => <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Estatus</label>
            <select className={styles.input} value={form.estatus} onChange={(e) => setForm((f) => ({ ...f, estatus: e.target.value }))}>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No disponible</option>
            </select>
          </div>
        </div>

        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Aptitudes necesarias</h2>
        <div className={styles.checkGrid}>
          {aptitudes.map((apt) => (
            <label key={apt.id_aptitud} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={seleccion[apt.id_aptitud]?.checked ?? false}
                onChange={() => toggleAptitud(apt.id_aptitud)}
              />
              {apt.nombre_aptitud}
              {seleccion[apt.id_aptitud]?.checked && (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={seleccion[apt.id_aptitud].porcentaje_minimo}
                  onChange={(e) => setPorcentaje(apt.id_aptitud, e.target.value)}
                  style={{ width: "60px", marginLeft: "8px", padding: "2px 4px" }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {seleccion[apt.id_aptitud]?.checked && <span style={{ fontSize: "0.75rem", color: "#6b7d8e" }}>% mín.</span>}
            </label>
          ))}
        </div>

        {error && <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>}

        <button className={styles.saveBtn} onClick={handleGuardar} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </main>
    </div>
  );
}
