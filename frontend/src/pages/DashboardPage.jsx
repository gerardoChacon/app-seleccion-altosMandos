import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import Sidebar from "../components/Sidebar";
import styles from "./DashboardPage.module.css";

const vacantesData = [
  { area: "Finanzas",    cantidad: 2, color: "#fecaca" },
  { area: "Operaciones", cantidad: 3, color: "#fef08a" },
  { area: "Tecnología",  cantidad: 2, color: "#99f6e4" },
  { area: "Comercial",   cantidad: 1, color: "#ddd6fe" },
];

const stats = [
  {
    titulo: "Vacantes Estratégicas Activas",
    valor: "8",
    desc: "+ 2 este mes",
    color: styles.cardPink,
  },
  {
    titulo: "Candidatos en Evaluación",
    valor: "23",
    desc: "En 5 procesos",
    color: styles.cardGreen,
  },
  {
    titulo: "Tiempo Promedio de Cobertura",
    valor: "47 días",
    desc: "- 6 días vs trimestre anterior",
    color: styles.cardYellow,
  },
];

export default function DashboardPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Dashboard</h1>

        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Vacantes por area</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vacantesData} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e5eaf0" />
              <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#6b7d8e" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#6b7d8e" }} allowDecimals={false} />
              <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {vacantesData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.titulo} className={`${styles.statCard} ${s.color}`}>
              <h3>{s.titulo}</h3>
              <p className={styles.statValue}>{s.valor}</p>
              <p className={styles.statDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

