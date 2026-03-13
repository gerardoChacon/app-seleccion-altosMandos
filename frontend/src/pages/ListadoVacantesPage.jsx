import Sidebar from "../components/Sidebar";
import styles from "./ListadoVacantesPage.module.css";

const vacantes = [
  { id: 1, titulo: "Director de Operaciones",  desc: "Responsable de la estrategia operativa, optimización de procesos y supervisión de áreas clave a nivel corporativo", fecha: "15 Feb 2026", estatus: "Activa" },
  { id: 2, titulo: "Director de RH",            desc: "Liderazgo de la estrategia de talento, cultura organizacional y desarrollo ejecutivo",                               fecha: "03 Feb 2026", estatus: "Activa" },
  { id: 3, titulo: "Director Financiero",       desc: "Supervisión de planeación financiera, control presupuestal y gestión de riesgos corporativos",                       fecha: "10 Feb 2026", estatus: "Activa" },
  { id: 4, titulo: "Gerente de Operaciones",    desc: "Coordinación estratégica de múltiples sedes y cumplimiento de indicadores de desempeño regional",                    fecha: "12 Dic 2025", estatus: "Activa" },
  { id: 5, titulo: "Director de Tecnología",   desc: "Definición de la visión tecnológica, innovación digital y liderazgo de equipos de desarrollo",                      fecha: "20 Feb 2026", estatus: "Activa" },
  { id: 6, titulo: "Gerente General",           desc: "Dirección integral de la organización, toma de decisiones estratégicas y cumplimiento de objetivos corporativos",    fecha: "15 Feb 2026", estatus: "Activa" },
];

export default function ListadoVacantesPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Vacantes</h1>
        <hr className={styles.divider} />

        <div className={styles.grid}>
          {vacantes.map((v) => (
            <div key={v.id} className={styles.card}>
              <div className={styles.cardTop}>
                <img src="/logo.png" alt="logo empresa" className={styles.logo} />
                <div className={styles.cardInfo}>
                  <p className={styles.cardTitle}>{v.titulo}</p>
                  <p className={styles.cardDesc}>{v.desc}</p>
                </div>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.fecha}>{v.fecha}</span>
                <span className={styles.badge}>{v.estatus}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

