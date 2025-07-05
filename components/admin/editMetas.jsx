import { useEffect, useState } from 'react';
import styles from './editMetas.module.css';
import { useRouter } from 'next/router';

const nomesPadrao = ['Café da manhã', 'Almoço', 'Janta', 'Lanche', 'Ceia'];

export default function EditMetas() {
  const [refeicoes, setRefeicoes] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const getToken = localStorage.getItem("token");

  

  // 🚀 Carrega dados do backend
  useEffect(() => {

    async function fetchObjetivo() {
      const res = await fetch("/api/admin/get-objetivo-dieta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_client: id }),
      });

      const data = await res.json();
      const recebidas = data[0]?.contentrefeicaonutri?.refeicoes;

      // Garante que seja array, mesmo que venha como objeto
      const lista = Array.isArray(recebidas) ? recebidas : Object.values(recebidas || {});
      setRefeicoes(lista);
    }

    fetchObjetivo();
  }, []);

  // 🚀 Calcula calorias com base nos macros
  const calcularCalorias = (refeicao) => {
    const c = parseFloat(refeicao.carboidratos || 0);
    const p = parseFloat(refeicao.proteinas || 0);
    const g = parseFloat(refeicao.gorduras || 0);
    return c * 4 + p * 4 + g * 8;
  };

  // 🚀 Atualiza um campo da refeição
  const atualizarRefeicao = (index, campo, valor) => {
    const novas = [...refeicoes];
    novas[index][campo] = valor;
    novas[index].calorias = calcularCalorias(novas[index]);
    setRefeicoes(novas);
  };

  const adicionarRefeicao = () => {
    setRefeicoes([
      ...refeicoes,
      {
        nome: '',
        carboidratos: '',
        proteinas: '',
        gorduras: '',
        calorias: 0,
      },
    ]);
  };

  const removerRefeicao = (index) => {
    const novas = refeicoes.filter((_, i) => i !== index);
    setRefeicoes(novas);
  };

  // 🚀 Função de salvar
  const salvarRefeicao = async () => {
    const contentrefeicaonutri = {
      refeicoes: Object.assign({}, refeicoes), // transforma em objeto
    };

    const totalCalorias = refeicoes.reduce((acc, r) => acc + r.calorias, 0);
    const totalCarboidratos = refeicoes.reduce((acc, r) => acc + Number(r.carboidratos), 0);
    const totalProteinas = refeicoes.reduce((acc, r) => acc + Number(r.proteinas), 0);
    const totalGorduras = refeicoes.reduce((acc, r) => acc + Number(r.gorduras), 0);
    const refeicoesFormatadas = refeicoes.reduce((acc, item) => {
      acc[item.nome] = Number(item.calorias);
      return acc;
    }, {});

    const payload = {
      token: getToken,
      id_client: id,
      meta_protein: totalProteinas,
      meta_carboidratos: totalCarboidratos,
      meta_gordura: totalGorduras,
      meta_calorias: totalCalorias,
      refeicoes: refeicoesFormatadas,
      contentrefeicaonutri: contentrefeicaonutri,
    };

    try {
      const res = await fetch("/api/admin/update-objetivo-dieta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao salvar:", data?.error || "Erro desconhecido");
        return;
      }

      alert("Objetivo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  const salvar = (e) => {
    e.preventDefault();
    salvarRefeicao();
  };

  const totalCalorias = refeicoes.reduce((acc, r) => acc + r.calorias, 0);

  return (
    <div className={styles.container}>
      {refeicoes.map((r, i) => (
        <div key={i} className={styles.refeicao}>
          <input
            className={styles.nome}
            value={r.nome}
            onChange={(e) => atualizarRefeicao(i, 'nome', e.target.value)}
            list="nomes"
            placeholder="Nome da refeição"
          />
          <datalist id="nomes">
            {nomesPadrao.map((nome, i) => (
              <option key={i} value={nome} />
            ))}
          </datalist>
          <div className={styles.macroInputs}>
            <input
              placeholder="Carboidratos"
              type="number"
              value={r.carboidratos}
              onChange={(e) => atualizarRefeicao(i, 'carboidratos', e.target.value)}
              className={styles.inputNumber}
            />
            <input
              placeholder="Proteínas"
              type="number"
              value={r.proteinas}
              onChange={(e) => atualizarRefeicao(i, 'proteinas', e.target.value)}
              className={styles.inputNumber}
            />
            <input
              placeholder="Gorduras"
              type="number"
              value={r.gorduras}
              onChange={(e) => atualizarRefeicao(i, 'gorduras', e.target.value)}
              className={styles.inputNumber}
            />
          </div>
          <div className={styles.total}>Total Calorias: {r.calorias}</div>
          <button onClick={() => removerRefeicao(i)} className={styles.remover}>
            Remover Refeição
          </button>
        </div>
      ))}
      <div className={styles.acoes}>
        <button onClick={adicionarRefeicao}>Nova Refeição</button>
      </div>
      <div className={styles.totalDieta}>Total Calorias da Dieta: {totalCalorias}</div>
      <button onClick={salvar} className={styles.salvar}>
        Salvar Dieta
      </button>
    </div>
  );
}
