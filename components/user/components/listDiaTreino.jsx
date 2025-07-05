import { useEffect, useState } from "react";
import styles from "./listDiaTreino.module.css";
import { useRouter } from "next/router";
import { format } from "date-fns"; // Instalar com: npm install date-fns
import { BadgeX } from "lucide-react";

export default function ListDiaTreino() {
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchTreinos() {
      const token = localStorage.getItem('token');
      const { id } = router.query;
      const id_client = id;

      if (!token || !id_client) return;

      const response = await fetch('/api/client/show-history-treino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id_client }),
      });

      const result = await response.json();

      // Formatando datas dos treinos
      const treinosFormatados = result.map(treino => ({
        ...treino,
        dataFormatada: format(new Date(treino.data), 'yyyy-MM-dd')
      }));

      const hoje = new Date();

      const diasComTreino = Array.from({ length: 8 }, (_, i) => {
        const data = new Date();
        data.setDate(hoje.getDate() - (7 - i));
        const dataFormatada = format(data, 'yyyy-MM-dd');

        const treinoDoDia = treinosFormatados.find(t => t.dataFormatada === dataFormatada);

        return {
          dia: data.getDate(),
          sigla: i === 7 ? "Hoje" : diasSemana[data.getDay()],
          isHoje: i === 7,
          treino: treinoDoDia?.name || null,
        };
      });

      setData(diasComTreino);
    }

    fetchTreinos();
  }, [router.query]);

  if (!data) {
    return <div>Carregando gráfico...</div>; 
  }

  return (
    <div>
      <div className={styles.container}>
        {data.map((d, i) => (
          <div key={i} className={styles.wrapperDia}>
            <div className={styles.dianumber}>{d.dia}</div>
            <div className={`${styles.dia} ${d.isHoje ? styles.inativo : ""}`}>
              {d.treino || <div className={styles.iconLinks}><BadgeX size={14} /> </div>}
            </div>
            <div className={styles.sigla}>{d.sigla}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
