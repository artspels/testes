import GraficoBarras from "./graficBarras";
import styles from "./GraficHistoric.module.css";

export default function GraficHistoric(){
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const hoje = new Date();

  // Gera os últimos 7 dias + hoje
  const dias = Array.from({ length: 8 }, (_, i) => {
    const data = new Date();
    data.setDate(hoje.getDate() - (7 - i));
    return {
      dia: data.getDate(),
      sigla: diasSemana[data.getDay()],
      isHoje: i === 7, // o último da lista é o dia atual
    };
  });

  return ( 
    <div className={styles.container}>
        
      {dias.map((d, i) => (
        <div
          key={i}
          className={`${styles.dia} ${d.isHoje ? styles.inativo : ""}`}
        >
          {d.dia}
          <div className={styles.sigla}>{d.sigla}</div>
        </div>
      ))}
    </div>
  );
}