import { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./ControlVacantesPage.module.css";

const vacantesEjemplo = [
  { id: 1, puesto: "Technical Writer",           area: "Documentacion Tecnica", fecha: "03/03/2026", estatus: "Disponible" },
  { id: 2, puesto: "Especialista en Cumplimiento", area: "Calidad",             fecha: "03/03/2026", estatus: "Disponible" },
  { id: 3, puesto: "Project Manager",             area: "Gestion de Proyectos", fecha: "01/03/2026", estatus: "Disponible" },
];

export default function ControlVacantesPage() {
  const [busqueda, setBusqueda] = useState("");

  const vacantesFiltradas = vacantesEjemplo.filter((v) =>
    v.puesto.toLowerCase().includes(busqueda.toLowerCase())
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
                <tr key={v.id}>
                  <td>{v.puesto}</td>
                  <td>{v.area}</td>
                  <td>{v.fecha}</td>
                  <td className={styles.disponible}>{v.estatus}</td>
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

