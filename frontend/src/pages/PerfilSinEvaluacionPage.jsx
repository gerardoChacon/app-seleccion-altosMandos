import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserCircle, ClipboardList } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "./PerfilSinEvaluacionPage.module.css";

const STORAGE_URL = import.meta.env.VITE_API_URL?.replace("/api", "/storage") ?? "http://localhost:8000/storage";
const COLORES = [styles.pink, styles.yellow, styles.green, styles.purple];

function ModalCrearUsuario({ empleado, onClose, onCreado }) {
  const [correo,     setCorreo]     = useState(empleado.correo ?? "");
  const [contrasena, setContrasena] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  async function handleGuardar() {
    if (!correo || !contrasena) { setError("Completa todos los campos."); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/usuarios", {
        correo,
        contrasena,
        id_rol:      3,
        id_empleado: empleado.id_empleado,
      });
      onCreado();
    } catch (err) {
      setError(err.message ?? "Error al crear el usuario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: 16, color: "#1e2d3d", fontSize: 18 }}>Crear acceso de empleado</h2>
        <label style={lbl}>Correo</label>
        <input style={inp} type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
        <label style={lbl}>Contraseña</label>
        <input style={inp} type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} />
        {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button style={btnPrimary} onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando..." : "Crear usuario"}
          </button>
          <button style={btnSecondary} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

const overlay      = { position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000 };
const modal        = { background:"#fff",borderRadius:12,padding:28,width:360,boxShadow:"0 8px 32px rgba(0,0,0,0.18)" };
const lbl          = { display:"block",fontSize:13,color:"#6b7d8e",marginBottom:4,marginTop:12 };
const inp          = { width:"100%",padding:"8px 12px",borderRadius:6,border:"1px solid #d0d7e0",fontSize:14,boxSizing:"border-box" };
const btnPrimary   = { flex:1,padding:"9px 0",background:"#5b7290",color:"#fff",border:"none",borderRadius:8,fontSize:14,cursor:"pointer" };
const btnSecondary = { flex:1,padding:"9px 0",background:"#f0f4f8",color:"#4a5e72",border:"none",borderRadius:8,fontSize:14,cursor:"pointer" };

export default function PerfilSinEvaluacionPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const esEmpleado = usuario?.rol?.nombre_rol === 'empleado';

  const [empleado,     setEmpleado]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  function cargar() {
    setLoading(true);
    api.get(`/empleados/${id}`)
      .then((res) => setEmpleado(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (esEmpleado && String(usuario?.id_empleado) !== String(id)) {
      navigate("/vacantes/listado", { replace: true });
      return;
    }
    cargar();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.content} style={{ display: "flex", alignItems: "center" }}>
          <p style={{ color: "#6b7d8e" }}>Cargando...</p>
        </main>
      </div>
    );
  }

  if (!empleado) return null;

  const nombre       = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno ?? ""}`.trim();
  const area         = empleado.area?.nombre_area ?? "";
  const nacimiento = empleado.fecha_nacimiento
    ? empleado.fecha_nacimiento.slice(0, 10).split('-').reverse().join('/')
    : "";
  const correo       = empleado.correo ?? "";
  const tieneUsuario = !!empleado.usuario;

  const metricas = [
    { label: "Aptitud 1", color: COLORES[0] },
    { label: "Aptitud 2", color: COLORES[1] },
    { label: "Aptitud 3", color: COLORES[2] },
    { label: "Aptitud 4", color: COLORES[3] },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <img src="/waves.png" alt="" className={styles.bgWaves} />

        <div className={styles.body}>
          <div className={styles.left}>
            <div className={styles.avatar}>
              {empleado.fotografia
                ? <img src={`${STORAGE_URL}/${empleado.fotografia}`} alt={nombre} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
                : <UserCircle size={80} />
              }
            </div>
            <div className={styles.infoCard}>
              <p className={styles.nombre}>{nombre}</p>
              <p className={styles.infoItem}>Departamento: {area}</p>
              <p className={styles.infoItem}>Fecha de nacimiento: {nacimiento}</p>
              <p className={styles.infoItem}>Correo: {correo}</p>
            </div>

            {!esEmpleado && (tieneUsuario ? (
              <p style={{ fontSize: 13, color: "#0d7a5f", marginTop: 12 }}>✓ Ya tiene acceso al sistema</p>
            ) : (
              <button
                onClick={() => setModalAbierto(true)}
                style={{ marginTop: 12, padding: "8px 16px", background: "#5b7290", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Crear acceso de empleado
              </button>
            ))}
          </div>

          <div className={styles.rightCard}>
            <div className={styles.resultSection}>
              <p className={styles.sinEvalTitle}>Sin evaluación</p>
              <div className={styles.iconCircle}>
                <ClipboardList size={56} color="rgba(255,255,255,0.85)" />
              </div>
              <p className={styles.sinEvalDesc}>Este empleado aún no ha sido evaluado</p>
              {!esEmpleado && (
                <button className={styles.evalBtn} onClick={() => navigate(`/evaluacion/${id}`)}>
                  Realizar evaluación
                </button>
              )}
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

      {modalAbierto && (
        <ModalCrearUsuario
          empleado={empleado}
          onClose={() => setModalAbierto(false)}
          onCreado={() => { setModalAbierto(false); cargar(); }}
        />
      )}
    </div>
  );
}
