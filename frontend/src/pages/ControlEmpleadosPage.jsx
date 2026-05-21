import { useEffect, useState } from "react";
import { Search, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./ControlEmpleadosPage.module.css";

export default function ControlEmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda,  setBusqueda]  = useState("");
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargar();
  }, []);

  function cargar(buscar = "") {
    setLoading(true);
    api.get(`/empleados?buscar=${buscar}&estatus=activo&per_page=50`)
      .then((res) => setEmpleados(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function handleBuscar(e) {
    const val = e.target.value;
    setBusqueda(val);
    clearTimeout(window._buscarTimer);
    window._buscarTimer = setTimeout(() => cargar(val), 400);
  }

  function descargarPDF() {
    const filas = empleados.map((emp) => `
      <tr>
        <td>${emp.nombre} ${emp.apellido_paterno} ${emp.apellido_materno ?? ""}</td>
        <td>${emp.curp}</td>
        <td>${emp.rfc}</td>
        <td>${emp.puesto?.nombre_puesto ?? "-"}</td>
        <td>${emp.area?.nombre_area ?? "-"}</td>
        <td>${emp.correo ?? "-"}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Listado de Empleados</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #1e2d3d; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    p.sub { font-size: 12px; color: #6b7d8e; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1e2d3d; color: #fff; padding: 8px 10px; text-align: left; }
    td { padding: 7px 10px; border-bottom: 1px solid #e0e6ed; }
    tr:nth-child(even) td { background: #f4f6f9; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Listado de Empleados</h1>
  <p class="sub">Grupo Empresarial Quetzal &mdash; ${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p>
  <table>
    <thead>
      <tr><th>Nombre</th><th>CURP</th><th>RFC</th><th>Puesto</th><th>Área</th><th>Correo</th></tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar este empleado?")) return;
    try {
      await api.delete(`/empleados/${id}`);
      cargar(busqueda);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Control Empleados</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar ..."
            value={busqueda}
            onChange={handleBuscar}
          />
          <Search size={18} />
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Lista de Empleados</h2>
            <button
              onClick={descargarPDF}
              disabled={loading || empleados.length === 0}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#1e2d3d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
            >
              <FileDown size={15} />
              Descargar PDF
            </button>
          </div>

          {loading ? (
            <p style={{ padding: "1rem", color: "#6b7d8e" }}>Cargando...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Área</th>
                  <th>CURP</th>
                  <th>RFC</th>
                  <th>Puesto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id_empleado}>
                    <td>{emp.nombre} {emp.apellido_paterno} {emp.apellido_materno}</td>
                    <td>{emp.area?.nombre_area}</td>
                    <td>{emp.curp}</td>
                    <td>{emp.rfc}</td>
                    <td>{emp.puesto?.nombre_puesto}</td>
                    <td>
                      <button
                        className={styles.btnEdit}
                        onClick={() => navigate(`/perfil-evaluado/${emp.id_empleado}`)}
                      >
                        Ver perfil
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleEliminar(emp.id_empleado)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {empleados.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#6b7d8e" }}>Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
