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
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Sidebar.module.css";

const ALL_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",        to: "/dashboard",       roles: ['superadmin', 'admin'] },
  { icon: Users,           label: "Empleados",        to: "/empleados",       roles: ['superadmin', 'admin'] },
  { icon: UserPlus,        label: "Nuevo Empleado",   to: "/empleados/nuevo", roles: ['superadmin', 'admin'] },
  { icon: Briefcase,       label: "Vacantes",         to: "/vacantes",        roles: ['superadmin', 'admin'] },
  { icon: FilePlus,        label: "Nueva Vacante",    to: "/vacantes/nueva",  roles: ['superadmin', 'admin'] },
  { icon: List,            label: "Listado Vacantes", to: "/vacantes/listado" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { logout, usuario } = useAuth();

  const rol = usuario?.rol?.nombre_rol;
  const navItems = [
    ...ALL_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(rol)),
    ...(rol === 'empleado' && usuario?.id_empleado
      ? [{ icon: UserCircle, label: "Mi Perfil", to: `/perfil-evaluado/${usuario.id_empleado}` }]
      : []),
  ];

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
