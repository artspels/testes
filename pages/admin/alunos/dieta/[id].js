import Header from "components/admin/header";
import styles from "./layout.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import EditMetas from "components/admin/editMetas";

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

        <EditMetas />
    </>
  );
}
