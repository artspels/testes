import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import styles from "./graficHeader.module.css";
import axios from "axios";
import ListRefeicoes from "./listRefeicoes";

export default function GraficHeader() {
  const [data, setData] = useState(null); // null em vez de []
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  

 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get("/api/dieta");
      const data = response.data[0];

      if (!data) {
        const fallback = await axios.get("/api/meta-user");
        const meta = fallback.data[0];

        // Adapta a estrutura para o mesmo formato esperado pelo gráfico
        const adaptedData = {
          consumer_protein: "0",
          total_protein: meta.meta_protein,
          consumer_carboidratos: "0",
          total_carboidratos: meta.meta_carboidratos,
          consumer_gordura: "0",
          total_gordura: meta.meta_gordura,
          consumer_calorias: "0",
          total_calorias: meta.meta_calorias,
          date: meta.data_inicio
        };

        setData(adaptedData);

      } else {
        setData(data); // Dado de consumo do dia
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  fetchData();
}, []);


  useEffect(() => {
    if (!data || !chartRef.current) return;

    const consumoCalories = Number(data.consumer_calorias);
    const totalCalories = Number(data.total_calorias);
    const currentCalories = totalCalories - consumoCalories;

    
    const caloriePercent =
      ((currentCalories / totalCalories) * 100) < 0
        ? 0
        : (currentCalories / totalCalories) * 100;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    console.log(consumoCalories,totalCalories,currentCalories,caloriePercent, ((currentCalories / totalCalories) * 100))

    const ctx = chartRef.current.getContext("2d");
console.log(100 - caloriePercent, caloriePercent)
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [100 - caloriePercent, caloriePercent],
            backgroundColor: ["#65bbe0","#F1EBEB"],
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
  }, [data]);

  if (!data) {
    return <div>Carregando gráfico...</div>; 
  }

  const consumoCalories = Number(data.consumer_calorias);
  const totalCalories = Number(data.total_calorias);
  const currentCalories = totalCalories - consumoCalories;

  const caloriePercent =
    ((currentCalories / totalCalories) * 100) < 0
      ? 100
      : (currentCalories / totalCalories) * 100;

  const consumoProtein = Number(data.consumer_protein);
  const totalProtein = Number(data.total_protein);
  const currentProtein = totalProtein - consumoProtein;
  const proteinPercent = 
  ((currentProtein / totalProtein) * 100) < 0
      ? 0
      : (currentProtein / totalProtein) * 100;

  const consumoCarbo = Number(data.consumer_carboidratos);
  const totalCarbo = Number(data.total_carboidratos);
  const currentCarbo = totalCarbo - consumoCarbo;
  const carboPercent = 
  ((currentCarbo / totalCarbo) * 100) < 0
      ? 0
      : (currentCarbo / totalCarbo) * 100;
  
  const consumoGordura = Number(data.consumer_gordura);
  const totalGordura = Number(data.total_gordura);
  const currentGordura = totalGordura - consumoGordura;
  const carboGordura = 
  ((currentGordura / totalGordura) * 100) < 0
      ? 0
      : (currentGordura / totalGordura) * 100;


  return (
    <div>
      <div className={styles.container}>
        <div className={styles.containerHeader}>
          <div className={styles.containerCenter}>
            <div className={styles.centerText}>
              <div className={styles.number}>{consumoCalories }</div>
              <div className={styles.label}>Consumidas </div>
            </div>
          </div>

          <div className={styles.containerCenter}>
            <canvas ref={chartRef} />
            <div className={styles.centerText}>
              <div className={styles.number}>{ (currentCalories <= 0 ? 'Bateu a meta' : currentCalories)}</div>
              <div className={styles.label}>Restantes</div>
            </div>
          </div>

          <div className={styles.containerCenter}>
            <div className={styles.centerText}>
              <div className={styles.number}>{totalCalories}</div>
              <div className={styles.label}>Total</div>
            </div>
          </div>
        </div>

        <div className={styles.containerNutrients}>
        <div className={styles.wrapperProgressBar}>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${100 - proteinPercent}%` }}
            ></div>
          </div>
          <div className={styles.progressTitle}>Proteinas</div>
          <div className={styles.progressText}>
            {consumoProtein} / <span className={styles.total}>{totalProtein} g</span>
          </div>
        </div>

        <div className={styles.wrapperProgressBar}>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${100 - carboPercent}%` }}
            ></div>
          </div>
          <div className={styles.progressTitle}>Carboidratos</div>
          <div className={styles.progressText}>
            {consumoCarbo} / <span className={styles.total}>{totalCarbo} g</span>
          </div>
        </div>

        <div className={styles.wrapperProgressBar}>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${100 - carboGordura}%` }}
            ></div>
          </div>
          <div className={styles.progressTitle}>Gorduras</div>
          <div className={styles.progressText}>
            {consumoGordura} / <span className={styles.total}>{totalGordura} g</span>
          </div>
        </div>
        </div>
      </div>

      <ListRefeicoes dados={data}/>

    </div>
  );
}
