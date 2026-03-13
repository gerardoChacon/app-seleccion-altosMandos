import { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./ControlEmpleadosPage.module.css";

const empleadosEjemplo = [
  { id: 1, nombre: "Ricardo López García",  area: "Calidad",              curp: "TOSR880720HDFLVR03", rfc: "TOSR880720PL8", puesto: "Gerente de área" },
  { id: 2, nombre: "Javier Hernández Cruz", area: "Gestión de Proyectos", curp: "SARP910323MDFNVR08", rfc: "TOSR880720PL8", puesto: "Project Manager"  },
];

export default function ControlEmpleadosPage() {
  const [busqueda, setBusqueda] = useState("");

  const empleadosFiltrados = empleadosEjemplo.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} />
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Empleados</h2>
          </div>

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
              {empleadosFiltrados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.nombre}</td>
                  <td>{emp.area}</td>
                  <td>{emp.curp}</td>
                  <td>{emp.rfc}</td>
                  <td>{emp.puesto}</td>
                  <td>
                    <button className={styles.btnEdit}>Editar</button>
                    <button className={styles.btnDelete}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

