import { useEffect, useRef, useState } from "react";
import styles from "./listRefeicoes.module.css"
import axios from "axios";

export default function ListRefeicoes({ dados, setActiveComponent, setDataIndex }) {
  const totalRefeicao = dados.total_refeicao;
  const consumerRefeicao = dados.consumer_refeicao;

  

  if (totalRefeicao && typeof totalRefeicao === "object") {
    return (
      <div className={styles.container}>
        {Object.entries(totalRefeicao).map(([nome, valor], index) => {
          // Extrai calorias de total e do consumo
          const totalCalorias = valor ?? 0;
          const consumidoCalorias = consumerRefeicao?.[nome]?.consumototal?.calorias ?? 0;

          return (
            <ul key={nome} className={styles.ulRefeicoes}>
              <li className={styles.liRefeicoes}>
                <img src="cofe.png" alt={`imagem ${nome}`} className={styles.iconeRefeicao} />
                <div className={styles.wrapperText}>
                  <h2 className={styles.title}>{nome}</h2>
                  <div className={styles.values}>{Number(consumidoCalorias.toFixed(2))} / {totalCalorias} kcal</div>
                </div>
                <a
                  className={styles.btnAddRefeicao}
                  onClick={() => {
                    setActiveComponent("editDietas");
                    setDataIndex(index);
                  }}
                >
                  +
                </a>
              </li>
            </ul>
          );
        })}
        <a className={styles.btnNewRefeicao} onClick={() => setActiveComponent("cadastroDieta")}>+</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <a className={styles.btnNewRefeicao} onClick={() => setActiveComponent("cadastroDieta")}>+</a>
    </div>
  );
}

