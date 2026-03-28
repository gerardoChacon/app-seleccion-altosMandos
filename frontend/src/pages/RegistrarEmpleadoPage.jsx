import { useState, useEffect } from "react";
import { UserCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./RegistrarEmpleadoPage.module.css";

function Field({ label, type = "text", value, onChange, className = "", required = false }) {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

function Select({ label, value, onChange, options = [], className = "" }) {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>{label}</label>
      <select className={styles.input} value={value} onChange={onChange}>
        <option value="">-- Seleccionar --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function RegistrarEmpleadoPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    curp: "", nss: "", rfc: "", correo: "",
    fecha_ingreso: "", fecha_nacimiento: "",
    id_puesto: "", id_area: "",
    calle: "", numero: "", colonia: "", codigo_postal: "",
    id_estado: "", id_municipio: "",
  });

  const [foto,       setFoto]       = useState(null);
  const [cv,         setCv]         = useState(null);
  const [puestos,    setPuestos]    = useState([]);
  const [areas,      setAreas]      = useState([]);
  const [estados,    setEstados]    = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/puestos"),
      api.get("/areas"),
      api.get("/estados"),
    ]).then(([p, a, e]) => {
      setPuestos(p.data.map((x) => ({ value: x.id_puesto, label: x.nombre_puesto })));
      setAreas(a.data.map((x)   => ({ value: x.id_area,   label: x.nombre_area   })));
      setEstados(e.data.map((x) => ({ value: x.id_estado, label: x.nombre_estado })));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.id_estado) { setMunicipios([]); return; }
    api.get(`/municipios?id_estado=${form.id_estado}`)
      .then((res) => setMunicipios(res.data.map((x) => ({ value: x.id_municipio, label: x.nombre_municipio }))))
      .catch(console.error);
  }, [form.id_estado]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleGuardar() {
    setError(""); setLoading(true);
    try {
      const res = await api.post("/empleados", {
        ...form,
        numero: form.numero || "S/N",
      });
      const idEmpleado = res.data.id_empleado;

      if (foto) {
        const fd = new FormData();
        fd.append("foto", foto);
        await api.postForm(`/empleados/${idEmpleado}/foto`, fd);
      }
      if (cv) {
        const fd = new FormData();
        fd.append("cv", cv);
        await api.postForm(`/empleados/${idEmpleado}/cv`, fd);
      }

      navigate("/empleados");
    } catch (err) {
      setError(err.message ?? "Error al guardar el empleado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Registrar Empleado</h1>
        <p className={styles.pageSubtitle}>Completa la información del empleado</p>
        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Información Personal</h2>
        <div className={styles.grid}>
          <Field label="Nombres"            value={form.nombre}           onChange={set("nombre")}           required />
          <Field label="Fecha de ingreso"   value={form.fecha_ingreso}    onChange={set("fecha_ingreso")}    type="date" required />
          <Field label="Apellido Paterno"   value={form.apellido_paterno} onChange={set("apellido_paterno")} required />
          <Select label="Puesto"            value={form.id_puesto}        onChange={set("id_puesto")}        options={puestos} />
          <Field label="Apellido Materno"   value={form.apellido_materno} onChange={set("apellido_materno")} />
          <Select label="Área"              value={form.id_area}          onChange={set("id_area")}          options={areas} />
          <Field label="CURP"               value={form.curp}             onChange={set("curp")}             required />
          <Field label="Fecha de Nacimiento" value={form.fecha_nacimiento} onChange={set("fecha_nacimiento")} type="date" required />
          <Field label="NSS"                value={form.nss}              onChange={set("nss")}              required />
          <Field label="RFC"                value={form.rfc}              onChange={set("rfc")}              required />
          <Field label="Correo"             value={form.correo}           onChange={set("correo")}           type="email" className={styles.fullWidth} />
        </div>

        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Documentación</h2>
        <div className={styles.docRow}>
          <button className={styles.uploadBtn} onClick={() => document.getElementById("inputFoto").click()}>
            <div className={styles.uploadIcon}><UserCircle size={40} /></div>
            {foto ? foto.name : "Subir fotografía"}
          </button>
          <input id="inputFoto" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setFoto(e.target.files[0])} />

          <button className={styles.uploadBtn} onClick={() => document.getElementById("inputCv").click()}>
            <div className={styles.uploadIconSquare}><FileText size={36} /></div>
            {cv ? cv.name : "Adjuntar CV"}
          </button>
          <input id="inputCv" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => setCv(e.target.files[0])} />
        </div>

        <hr className={styles.divider} />

        <h2 className={styles.sectionTitle}>Dirección</h2>
        <div className={styles.grid}>
          <Field label="Calle"     value={form.calle}          onChange={set("calle")}          required />
          <Field label="CP"        value={form.codigo_postal}  onChange={set("codigo_postal")}  required />
          <Select label="Estado"   value={form.id_estado}      onChange={set("id_estado")}      options={estados} />
          <Select label="Municipio" value={form.id_municipio}  onChange={set("id_municipio")}   options={municipios} />
          <Field label="Colonia"   value={form.colonia}        onChange={set("colonia")}        required />
          <Field label="Número"    value={form.numero}         onChange={set("numero")} />
        </div>

        {error && <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>}

        <button className={styles.saveBtn} onClick={handleGuardar} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </main>
    </div>
  );
}
