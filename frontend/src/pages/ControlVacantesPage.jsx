import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./ControlVacantesPage.module.css";

function ModalEditarVacante({ vacante, onClose, onGuardado }) {
  const [puestos, setPuestos] = useState([]);
  const [areas,   setAreas]   = useState([]);
  const [form, setForm] = useState({
    id_puesto:      vacante.id_puesto      ?? "",
    id_area:        vacante.id_area        ?? "",
    descripcion:    vacante.descripcion    ?? "",
    fecha_apertura: vacante.fecha_apertura ?? "",
    estatus:        vacante.estatus        ?? "disponible",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    Promise.all([api.get("/puestos"), api.get("/areas")])
      .then(([p, a]) => { setPuestos(p.data); setAreas(a.data); })
      .catch(console.error);
  }, []);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleGuardar() {
    setError(""); setLoading(true);
    try {
      await api.put(`/vacantes/${vacante.id_vacante}`, form);
      onGuardado();
    } catch (err) {
      setError(err.message ?? "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: 16, color: "#1e2d3d", fontSize: 18 }}>Editar Vacante</h2>

        <label style={lbl}>Puesto</label>
        <select style={inp} value={form.id_puesto} onChange={set("id_puesto")}>
          <option value="">-- Seleccionar --</option>
          {puestos.map((p) => <option key={p.id_puesto} value={p.id_puesto}>{p.nombre_puesto}</option>)}
        </select>

        <label style={lbl}>Área</label>
        <select style={inp} value={form.id_area} onChange={set("id_area")}>
          <option value="">-- Seleccionar --</option>
          {areas.map((a) => <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>)}
        </select>

        <label style={lbl}>Descripción</label>
        <textarea style={{ ...inp, height: 80, resize: "vertical" }} value={form.descripcion} onChange={set("descripcion")} />

        <label style={lbl}>Fecha de Apertura</label>
        <input style={inp} type="date" value={form.fecha_apertura} onChange={set("fecha_apertura")} />

        <label style={lbl}>Estatus</label>
        <select style={inp} value={form.estatus} onChange={set("estatus")}>
          <option value="disponible">Disponible</option>
          <option value="no_disponible">No disponible</option>
        </select>

        {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button style={btnPrimary} onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button style={btnSecondary} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

const overlay      = { position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000 };
const modal        = { background:"#fff",borderRadius:12,padding:28,width:400,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.18)" };
const lbl          = { display:"block",fontSize:13,color:"#6b7d8e",marginBottom:4,marginTop:12 };
const inp          = { width:"100%",padding:"8px 12px",borderRadius:6,border:"1px solid #d0d7e0",fontSize:14,boxSizing:"border-box" };
const btnPrimary   = { flex:1,padding:"9px 0",background:"#5b7290",color:"#fff",border:"none",borderRadius:8,fontSize:14,cursor:"pointer" };
const btnSecondary = { flex:1,padding:"9px 0",background:"#f0f4f8",color:"#4a5e72",border:"none",borderRadius:8,fontSize:14,cursor:"pointer" };

export default function ControlVacantesPage() {
  const [vacantes,       setVacantes]       = useState([]);
  const [busqueda,       setBusqueda]       = useState("");
  const [loading,        setLoading]        = useState(true);
  const [vacanteEditar,  setVacanteEditar]  = useState(null);

  useEffect(() => { cargar(); }, []);

  function cargar() {
    setLoading(true);
    api.get("/vacantes?per_page=50")
      .then((res) => setVacantes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar esta vacante?")) return;
    try {
      await api.delete(`/vacantes/${id}`);
      setVacantes((prev) => prev.filter((v) => v.id_vacante !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const vacantesFiltradas = vacantes.filter((v) =>
    v.puesto?.nombre_puesto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Control Vacantes</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar ..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} />
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Vacantes</h2>
          </div>

          {loading ? (
            <p style={{ padding: "1rem", color: "#6b7d8e" }}>Cargando...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Puesto</th>
                  <th>Área</th>
                  <th>Fecha de Apertura</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vacantesFiltradas.map((v) => (
                  <tr key={v.id_vacante}>
                    <td>{v.puesto?.nombre_puesto}</td>
                    <td>{v.area?.nombre_area}</td>
                    <td>{v.fecha_apertura}</td>
                    <td className={v.estatus === "disponible" ? styles.disponible : ""}>
                      {v.estatus === "disponible" ? "Disponible" : "No disponible"}
                    </td>
                    <td>
                      <button
                        className={styles.btnEdit}
                        onClick={() => setVacanteEditar(v)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleEliminar(v.id_vacante)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {vacantesFiltradas.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#6b7d8e" }}>Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {vacanteEditar && (
        <ModalEditarVacante
          vacante={vacanteEditar}
          onClose={() => setVacanteEditar(null)}
          onGuardado={() => { setVacanteEditar(null); cargar(); }}
        />
      )}
    </div>
  );
}
