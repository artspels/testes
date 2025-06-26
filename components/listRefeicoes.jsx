import { useEffect, useRef, useState } from "react";
import styles from "./listRefeicoes.module.css"
import axios from "axios";

export default function ListRefeicoes({ dados }) {
  const totalRefeicao = dados.total_refeicao;
  const consumerRefeicao = dados.consumer_refeicao;

  if (totalRefeicao && typeof totalRefeicao === "object") {
    return (
      <>
        {Object.entries(totalRefeicao).map(([nome, valor], index) => {
          const consumido = consumerRefeicao?.[nome] ?? 0; // pega o valor consumido ou 0
          return (
            <div className={styles.container} key={index}>
              <ul className={styles.ulRefeicoes}>
                <li className={styles.liRefeicoes}>
                  <img src="cofe.png" alt={`imagem ${nome}`} className={styles.iconeRefeicao} />
                  <div className={styles.wrapperText}>
                    <h2 className={styles.title}>{nome}</h2>
                    <div className={styles.values}>{consumido} / {valor} kcal</div>
                  </div>
                  <a className={styles.btnAddRefeicao}>+</a>
                </li>
              </ul>
            </div>
          );
        })}
      </>
    );
  }

  return null;
}