import { UserCircle, FileText } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./RegistrarEmpleadoPage.module.css";

// Componente reutilizable para cada campo del formulario
function Field({ label, type = "text", className = "" }) {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>{label}</label>
      <input type={type} className={styles.input} />
    </div>
  );
}

export default function RegistrarEmpleadoPage() {
  return (
    <div className={styles.layout}>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Registrar Empleado</h1>
        <p className={styles.pageSubtitle}>Completa la información del empleado</p>
        <hr className={styles.divider} />

        {/* Seccion: Info personal */}
        <h2 className={styles.sectionTitle}>Información Personal</h2>
        <div className={styles.grid}>
          <Field label="Nombres" />
          <Field label="Fecha de ingreso" type="date" />
          <Field label="Apellido Paterno" />
          <Field label="Puesto" />
          <Field label="Apellido Materno" />
          <Field label="Área" />
          <Field label="CURP" />
          <Field label="Fecha de Nacimiento" type="date" />
          <Field label="NSS" />
          <Field label="RFC" />
          {/* Correo */}
          <Field label="Correo" type="email" className={styles.fullWidth} />
        </div>

        <hr className={styles.divider} />

        {/* Seccion: Documentacion */}
        <h2 className={styles.sectionTitle}>Documentación</h2>
        <div className={styles.docRow}>
          {/* Boton subir foto */}
          <button className={styles.uploadBtn}>
            <div className={styles.uploadIcon}>
              <UserCircle size={40} />
            </div>
            Subir fotografía
          </button>

          {/* Boton subir CV */}
          <button className={styles.uploadBtn}>
            <div className={styles.uploadIconSquare}>
              <FileText size={36} />
            </div>
            Adjuntar CV
          </button>
        </div>

        <hr className={styles.divider} />

        {/* Seccion: Direccion */}
        <div className={styles.grid}>
          <Field label="Calle" />
          <Field label="CP" />
          <Field label="Municipio" />
          <Field label="Domicilio" />
          <Field label="Estado" />
        </div>

        {/* Boton guardar */}
        <button className={styles.saveBtn}>Guardar</button>
      </main>

    </div>
  );
}

