import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
          <div className={styles.tableHeader}>
            <h2>Lista de Empleados</h2>
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
