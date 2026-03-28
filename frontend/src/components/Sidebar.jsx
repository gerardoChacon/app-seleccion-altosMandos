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
  List,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Sidebar.module.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",      to: "/dashboard" },
  { icon: Users,           label: "Empleados",      to: "/empleados" },
  { icon: UserPlus,        label: "Nuevo Empleado", to: "/empleados/nuevo" },
  { icon: Briefcase,       label: "Vacantes",          to: "/vacantes" },
  { icon: FilePlus,        label: "Nueva Vacante",     to: "/vacantes/nueva" },
  { icon: List,            label: "Listado Vacantes",   to: "/vacantes/listado" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${open ? styles.expanded : styles.collapsed}`}>
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
            {open && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={logout}>
        <LogOut size={20} />
        {open && <span>Cerrar sesión</span>}
      </button>
    </aside>
  );
}
