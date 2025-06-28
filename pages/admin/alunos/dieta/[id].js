import Header from "components/admin/header";
import styles from "./layout.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Dieta() {
  const [metaDiaria, setMetaDiaria] = useState("");
  const [metaCarboidratos, setMetaCarboidratos] = useState("");
  const [metaProteinas, setMetaProteinas] = useState("");
  const [metaGorduras, setMetaGorduras] = useState("");
  const router = useRouter();
  const { id } = router.query;

  async function insertRefeicao(e) {
    e.preventDefault();

    const res = await fetch("/api/client/insert-dieta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_client: id,
        meta_protein: metaProteinas,
        meta_carboidratos: metaCarboidratos,
        meta_gordura: metaGorduras,
        meta_calorias: metaDiaria,
        data_inicio: "2025-06-28T00:00:00.000Z",
        data_final: null,
        refeicoes: {
          cafe: 200,
          almoco: 800,
          lanche: 300,
          janta: 400,
        },
      }),
    });

    const data = await res.json();
    console.log("Resposta da API:", data);
  }

  return (
    <>
        <Header url="" />

        <div className={styles.container}>
        <h2>Crie e Edite Dieta</h2>

        <form onSubmit={insertRefeicao} className={styles.form}>
            <input
            type="text"
            placeholder="Meta de Calorias Diária"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(e.target.value)}
            className={styles.input}
            />

            <input
            type="text"
            placeholder="Carboidratos"
            value={metaCarboidratos}
            onChange={(e) => setMetaCarboidratos(e.target.value)}
            className={styles.input}
            />

            <input
            type="text"
            placeholder="Proteínas"
            value={metaProteinas}
            onChange={(e) => setMetaProteinas(e.target.value)}
            className={styles.input}
            />

            <input
            type="text"
            placeholder="Gorduras"
            value={metaGorduras}
            onChange={(e) => setMetaGorduras(e.target.value)}
            className={styles.input}
            />

            <button type="submit" className={styles.botao}>Salvar Dieta</button>
        </form>
        </div>
    </>
  );
}
