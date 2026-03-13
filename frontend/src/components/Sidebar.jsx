import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  FilePlus,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",      to: "/dashboard" },
  { icon: Users,           label: "Empleados",      to: "/empleados" },
  { icon: UserPlus,        label: "Nuevo Empleado", to: "/empleados/nuevo" },
  { icon: Briefcase,       label: "Vacantes",       to: "/vacantes" },
  { icon: FilePlus,        label: "Nueva Vacante",  to: "/vacantes/nueva" },
];

export default function Sidebar() {
  // Controla si el sidebar esta abierto o colapsado
  const [open, setOpen] = useState(true);
  // useLocation nos dice en que ruta estamos para resaltar el item activo
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${open ? styles.expanded : styles.collapsed}`}>
      {/* Boton hamburguesa */}
      <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={styles.nav}>
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className={`${styles.navItem} ${location.pathname === to ? styles.active : ""}`}
          >
            <Icon size={20} />
            {/* El texto solo aparece cuando el sidebar esta expandido */}
            {open && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
