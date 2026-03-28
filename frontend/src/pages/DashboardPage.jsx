import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import styles from "./DashboardPage.module.css";

const COLORES = ["#fecaca", "#fef08a", "#99f6e4", "#ddd6fe", "#fed7aa", "#bbf7d0"];

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const vacantesData = (stats?.vacantes_por_area ?? []).map((v, i) => ({
    area:     v.nombre_area,
    cantidad: Number(v.cantidad),
    color:    COLORES[i % COLORES.length],
  }));

  const kpis = stats
    ? [
        { titulo: "Vacantes Estratégicas Activas",  valor: stats.vacantes_activas,         desc: "puestos disponibles" },
        { titulo: "Candidatos en Evaluación",        valor: stats.candidatos_en_evaluacion, desc: "en proceso activo"   },
        { titulo: "Empleados Activos",               valor: stats.empleados_activos,        desc: "en la organización" },
      ]
    : [];

  const coloresKpi = [styles.cardPink, styles.cardGreen, styles.cardYellow];

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Dashboard</h1>

        {loading ? (
          <p style={{ color: "#6b7d8e" }}>Cargando estadísticas...</p>
        ) : (
          <>
            <div className={styles.chartCard}>
              <p className={styles.chartTitle}>Vacantes por área</p>
              {vacantesData.length > 0 ? (
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
              ) : (
                <p style={{ color: "#6b7d8e", padding: "2rem 0" }}>Sin vacantes activas.</p>
              )}
            </div>

            <div className={styles.statsGrid}>
              {kpis.map((s, i) => (
                <div key={s.titulo} className={`${styles.statCard} ${coloresKpi[i]}`}>
                  <h3>{s.titulo}</h3>
                  <p className={styles.statValue}>{s.valor}</p>
                  <p className={styles.statDesc}>{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
