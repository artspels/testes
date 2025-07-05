import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import styles from "./graficDieta.module.css";
import axios from "axios";
import ListRefeicoes from "components/listRefeicoes";
import Logo from "components/logo";
import { useRouter } from "next/router";
import SalvarConsumoInicialDiario from "controller/cunsumo-inicial-diario";

export default function GraficHeader({ setActiveComponent , setDataIndex}) {
  const [consumoData, setConsumoData] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const router = useRouter();
  const { id } = router.query;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Função auxiliar para calcular o percentual restante (evita negativo)
  const calcularPercentualRestante = (consumido, total) => {
    const restante = total - consumido;
    return Math.max((restante / total) * 100, 0);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dieta-consumer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_client: id, token }),
        });

        const response = await res.json();
        const dados = response[0];

        if (!dados) {
          const dadosIniciais = await SalvarConsumoInicialDiario(id);
          setConsumoData(dadosIniciais[0]);
        } else {
          setConsumoData(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    if (id) fetchData();
  }, [id, token]);

  useEffect(() => {
    if (!consumoData || !chartRef.current) return;

    const consumoCal = Number(consumoData.consumer_calorias);
    const totalCal = Number(consumoData.total_calorias);
    const percentualRestante = calcularPercentualRestante(consumoCal, totalCal);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [100 - percentualRestante, percentualRestante],
            backgroundColor: ["#65bbe0", "#F1EBEB"],
            borderWidth: 0,
            borderRadius: 6,
            cutout: "70%",
          },
        ],
      },
      options: {
        rotation: 220,
        circumference: 280,
        responsive: true,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }, 
        },
      },
    });
  }, [consumoData]);

  if (!consumoData) return <div>Carregando gráfico...</div>;

  // Variáveis desestruturadas e com nomes claros
  const {
    consumer_calorias,
    total_calorias,
    consumer_protein,
    total_protein,
    consumer_carboidratos,
    total_carboidratos,
    consumer_gordura,
    total_gordura,
  } = consumoData;

  const restanteCalorias = total_calorias - consumer_calorias;
  const restanteProteina = total_protein - consumer_protein;
  const restanteCarbo = total_carboidratos - consumer_carboidratos;
  const restanteGordura = total_gordura - consumer_gordura;

  return (
    <div>
      <div className={styles.header}>
        <Logo />
        <button onClick={() => setActiveComponent("dieta")} className={styles.btnVoltar}>Voltar</button>
      </div>

      <div className={styles.container}>
        <div className={styles.containerHeader}>
          <div className={styles.containerCenter}>
            <div className={styles.centerText}>
              <div className={styles.number}>{consumer_calorias}</div>
              <div className={styles.label}>Consumidas</div>
            </div>
          </div>

          <div className={styles.containerCenter}>
            <canvas ref={chartRef} />
            <div className={styles.centerText}>
              <div className={styles.number}>
                {restanteCalorias <= 0 ? 'Bateu a meta' : restanteCalorias.toFixed(2)}
              </div>
              <div className={styles.label}>Restantes</div>
            </div>
          </div>

          <div className={styles.containerCenter}>
            <div className={styles.centerText}>
              <div className={styles.number}>{total_calorias}</div>
              <div className={styles.label}>Total</div>
            </div>
          </div>
        </div>

        <div className={styles.containerNutrients}>
          {[
            {
              label: "Proteínas",
              consumido: consumer_protein,
              total: total_protein,
              restante: restanteProteina,
            },
            {
              label: "Carboidratos",
              consumido: consumer_carboidratos,
              total: total_carboidratos,
              restante: restanteCarbo,
            },
            {
              label: "Gorduras",
              consumido: consumer_gordura,
              total: total_gordura,
              restante: restanteGordura,
            },
          ].map((nutriente, idx) => (
            <div key={idx} className={styles.wrapperProgressBar}>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: `${100 - calcularPercentualRestante(
                      nutriente.consumido,
                      nutriente.total
                    )}%`,
                  }}
                ></div>
              </div>
              <div className={styles.progressTitle}>{nutriente.label}</div>
              <div className={styles.progressText}>
                {nutriente.consumido} /{" "}
                <span className={styles.total}>{nutriente.total} g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ListRefeicoes dados={consumoData} setActiveComponent={setActiveComponent} setDataIndex={setDataIndex}/>
    </div>
  );
}
