import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./editConsumoDiario.module.css";
import Logo from "components/logo";


// Componente principal
export default function EditConsumoDiario({ setActiveComponent, index ,setToast}) {
  const router = useRouter();
  const { id } = router.query;
  

  const [token, setToken] = useState(null);
  const [consumoData, setConsumoData] = useState(null);
  const [alimentosDisponiveis, setAlimentosDisponiveis] = useState([]);

  const [totaisNutricionais, setTotaisNutricionais] = useState({
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
  });

  // Pega token do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Busca os alimentos disponíveis
  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        const res = await fetch("/api/get-alimentos");
        const alimentos = await res.json();
        setAlimentosDisponiveis(alimentos);
      } catch (error) {
        console.error("Erro ao buscar alimentos:", error);
      }
    };
    fetchAlimentos();
  }, []);

  // Busca os dados de consumo do cliente
  useEffect(() => {
    if (!router.isReady || !id || !token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/dieta-consumer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_client: id, token }),
        });
        const response = await res.json();
        setConsumoData(response[0]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [router.isReady, id, token]);

  // Carregando dados
  if (!consumoData || alimentosDisponiveis.length === 0) {
    return <div className={styles.card}>Carregando dados...</div>;
  }

  // Identifica a refeição pelo índice
  const nomesRefeicoes = Object.keys(consumoData.consumer_refeicao);
  const nomeRefeicao = nomesRefeicoes[index];
  const dadosRefeicao = consumoData.consumer_refeicao[nomeRefeicao];

  if (!dadosRefeicao) {
    return <div className={styles.card}>Refeição não encontrada</div>;
  }

  const alimentos = dadosRefeicao.refeicoes || [];

  // Atualiza nome ou quantidade de um alimento
  const alterarAlimento = (indexAlimento, campo, valor) => {
    const novosDados = JSON.parse(JSON.stringify(consumoData));
    const itemRef = novosDados.consumer_refeicao[nomeRefeicao].refeicoes;

    const itemAtual = itemRef[indexAlimento] || {};
    const nomeAtual = Object.keys(itemAtual)[0] || "";
    const quantidadeAtual = itemAtual[nomeAtual] || 0;

    let novoNome = nomeAtual;
    let novaQuantidade = quantidadeAtual;

    if (campo === "nome") {
      novoNome = valor;
    } else if (campo === "quantidade") {
      novaQuantidade = Number(valor);
    }

    itemRef[indexAlimento] = { [novoNome]: novaQuantidade };
    setConsumoData(novosDados);
    calcularTotaisNutricionais(novosDados);
  };

  // Adiciona novo alimento vazio
  const adicionarAlimento = () => {
    const novosDados = JSON.parse(JSON.stringify(consumoData));
    novosDados.consumer_refeicao[nomeRefeicao].refeicoes.push({ "": 0 });
    setConsumoData(novosDados);
  };

  // Remove um alimento pelo índice
  const removerAlimento = (indexAlimento) => {
    const novosDados = JSON.parse(JSON.stringify(consumoData));
    novosDados.consumer_refeicao[nomeRefeicao].refeicoes.splice(indexAlimento, 1);
    setConsumoData(novosDados);
    calcularTotaisNutricionais(novosDados);
  };

  // Calcula os totais nutricionais da refeição atual
  const calcularTotaisNutricionais = (dados = consumoData) => {
    let totais = {
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
    };

    const alimentos = dados.consumer_refeicao[nomeRefeicao].refeicoes;

    alimentos.forEach((item) => {
      const [nome, quantidade] = Object.entries(item)[0] || ["", 0];
      const info = alimentosDisponiveis.find((a) => a.nome === nome);
      if (info) {
        const fator = Number(quantidade) / 100;
        totais.calorias += Number(info["calorias "]) * fator;
        totais.proteinas += Number(info.proteinas) * fator;
        totais.carboidratos += Number(info.carboidratos) * fator;
        totais.gorduras += Number(info.gorduras) * fator;
      }
    });

    dados.consumer_refeicao[nomeRefeicao].consumototal = totais;
    setTotaisNutricionais(totais);
  };

  // Salva os dados no backend
  async function salvarDieta() {
    try {
      const payload = {
        id_client: id,
        token: token,
        consumer_refeicao: consumoData.consumer_refeicao,
      };

      const res = await fetch("/api/client/update-consumo-dieta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resposta = await res.json();

      if (res.ok) {
        setToast({ mensagem: "Dieta atualizado com sucesso!", tipo: "sucesso" });
        setActiveComponent("graficDieta");
      } else {
        console.error("Erro ao salvar dieta:", resposta.message);
        alert("Erro ao salvar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro inesperado.");
    }
  }

  setTimeout(() => setToast(null), 6000);

  // Interface do componente
  return (
    <>
      <div className={styles.header}>
        <Logo />
        <button
          onClick={() => setActiveComponent("graficDieta")}
          className={styles.btnVoltar}
        >
          Voltar
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.conatinercard}>
          <h1 className={styles.titulo}>Montar {nomeRefeicao}</h1>

          {alimentos.map((item, i) => {
            const [nome, quantidade] = Object.entries(item)[0] || ["", 0];

            return (
              <div key={i} className={styles.alimento}>
                <select
                  value={nome}
                  onChange={(e) => alterarAlimento(i, "nome", e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione um alimento</option>
                  {alimentosDisponiveis.map((alimento) => (
                    <option key={alimento.nome} value={alimento.nome}>
                      {alimento.nome}
                    </option>
                  ))}
                </select>
                <div className={styles.contValues}>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) =>
                      alterarAlimento(i, "quantidade", e.target.value)
                    }
                    className={`${styles.input} ${styles.inputNumber}`}
                    placeholder="Quantidade (g)"
                  />

                  <button
                    type="button"
                    onClick={() => removerAlimento(i)}
                    className={styles.btnRemover}
                  >
                    Remover
                  </button>

                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={adicionarAlimento}
            className={styles.btnAdicionar}
          >
            + Adicionar Alimento
          </button>

          <div className={styles.totais}>
            <h3>Totais Nutricionais</h3>
            <p>Calorias: {totaisNutricionais.calorias.toFixed(2)} kcal</p>
            <p>Proteínas: {totaisNutricionais.proteinas.toFixed(2)} g</p>
            <p>Carboidratos: {totaisNutricionais.carboidratos.toFixed(2)} g</p>
            <p>Gorduras: {totaisNutricionais.gorduras.toFixed(2)} g</p>
          </div>

          <button onClick={salvarDieta} className={styles.btnPrincipal}>
            Salvar {nomeRefeicao}
          </button>

        </div>
      </div>
    </>
  );
}
