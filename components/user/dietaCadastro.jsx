import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./dietaCadastro.module.css";

export default function DietaCadastro() {
  const router = useRouter();
  const { id } = router.query; // id do cliente vindo da rota

  const alimentosDisponiveis = {
    "Frango grelhado": {
      calorias: 165,
      proteinas: 31,
      gorduras: 3.6,
      carboidratos: 0,
    },
    "Arroz branco cozido": {
      calorias: 130,
      proteinas: 2.7,
      gorduras: 0.3,
      carboidratos: 28,
    },
  };

  const calcularNutrientes = (nomeAlimento, quantidade) => {
    const alimento = alimentosDisponiveis[nomeAlimento];
    const qtd = parseFloat(quantidade);

    if (!alimento || isNaN(qtd))
      return { calorias: 0, proteinas: 0, gorduras: 0, carboidratos: 0 };

    const fator = qtd / 100;

    return {
      calorias: (alimento.calorias * fator).toFixed(1),
      proteinas: (alimento.proteinas * fator).toFixed(1),
      gorduras: (alimento.gorduras * fator).toFixed(1),
      carboidratos: (alimento.carboidratos * fator).toFixed(1),
    };
  };

  const [refeicoes, setRefeicoes] = useState([
    {
      nome: "Café da Manhã",
      alimentos: [
        {
          nome: "",
          quantidade: "",
          calorias: 0,
          proteinas: 0,
          gorduras: 0,
          carboidratos: 0,
        },
      ],
    },
  ]);

  const adicionarRefeicao = () => {
    setRefeicoes([
      ...refeicoes,
      {
        nome: "",
        alimentos: [
          {
            nome: "",
            quantidade: "",
            calorias: 0,
            proteinas: 0,
            gorduras: 0,
            carboidratos: 0,
          },
        ],
      },
    ]);
  };

  const removerRefeicao = (index) => {
    if (refeicoes.length === 1)
      return alert("A dieta deve ter pelo menos uma refeição.");
    const novaLista = [...refeicoes];
    novaLista.splice(index, 1);
    setRefeicoes(novaLista);
  };

  const alterarNomeRefeicao = (index, nome) => {
    const novaLista = [...refeicoes];
    novaLista[index].nome = nome;
    setRefeicoes(novaLista);
  };

  const alterarAlimento = (refIndex, aliIndex, campo, valor) => {
    const novaLista = [...refeicoes];
    novaLista[refIndex].alimentos[aliIndex][campo] = valor;

    const nome = novaLista[refIndex].alimentos[aliIndex].nome;
    const quantidade = novaLista[refIndex].alimentos[aliIndex].quantidade;
    const nutrientes = calcularNutrientes(nome, quantidade);

    novaLista[refIndex].alimentos[aliIndex] = {
      ...novaLista[refIndex].alimentos[aliIndex],
      ...nutrientes,
    };

    setRefeicoes(novaLista);
  };

  const adicionarAlimento = (refIndex) => {
    const novaLista = [...refeicoes];
    novaLista[refIndex].alimentos.push({
      nome: "",
      quantidade: "",
      calorias: 0,
      proteinas: 0,
      gorduras: 0,
      carboidratos: 0,
    });
    setRefeicoes(novaLista);
  };

  const removerAlimento = (refIndex, aliIndex) => {
    const novaLista = [...refeicoes];
    if (novaLista[refIndex].alimentos.length === 1) {
      return alert("Cada refeição deve ter pelo menos um alimento.");
    }
    novaLista[refIndex].alimentos.splice(aliIndex, 1);
    setRefeicoes(novaLista);
  };

  const calcularTotaisRefeicao = (alimentos) => {
    return alimentos.reduce(
      (totais, item) => ({
        calorias: totais.calorias + parseFloat(item.calorias || 0),
        proteinas: totais.proteinas + parseFloat(item.proteinas || 0),
        gorduras: totais.gorduras + parseFloat(item.gorduras || 0),
        carboidratos: totais.carboidratos + parseFloat(item.carboidratos || 0),
      }),
      { calorias: 0, proteinas: 0, gorduras: 0, carboidratos: 0 }
    );
  };

  const calcularTotaisDieta = () => {
    return refeicoes.reduce(
      (totais, refeicao) => {
        const t = calcularTotaisRefeicao(refeicao.alimentos);
        return {
          calorias: totais.calorias + t.calorias,
          proteinas: totais.proteinas + t.proteinas,
          gorduras: totais.gorduras + t.gorduras,
          carboidratos: totais.carboidratos + t.carboidratos,
        };
      },
      { calorias: 0, proteinas: 0, gorduras: 0, carboidratos: 0 }
    );
  };

  const salvarDieta = async () => {
    if (!id) return alert("ID do cliente não identificado.");

    const totaisGerais = calcularTotaisDieta();

    const refeicoesConsumidas = {};

    refeicoes.forEach((refeicao) => {
      const nomeFormatado = refeicao.nome.trim().toLowerCase();
      const totais = calcularTotaisRefeicao(refeicao.alimentos);

      refeicoesConsumidas[nomeFormatado] = {
        refeicoes: refeicao.alimentos.map((item) => ({
          [item.nome.toLowerCase()]: parseFloat(item.quantidade || 0),
        })),
        consumototal: parseFloat(totais.calorias.toFixed(1)),
      };
    });

    const payload = {
      id_client: parseInt(id),
      consumer_protein: parseFloat(totaisGerais.proteinas.toFixed(1)),
      consumer_carboidratos: parseFloat(totaisGerais.carboidratos.toFixed(1)),
      consumer_gordura: parseFloat(totaisGerais.gorduras.toFixed(1)),
      consumer_calorias: parseFloat(totaisGerais.calorias.toFixed(1)),
      consumer_refeicao: refeicoesConsumidas,
    };

    try {
      const res = await fetch("/api/client/update-consumo-dieta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Dieta salva com sucesso!");
      } else {
        console.error("Erro:", data);
        alert("Erro ao salvar dieta.");
      }
    } catch (error) {
      console.error("Erro ao conectar com API:", error);
      alert("Erro ao salvar dieta.");
    }
  };

  const totaisGerais = calcularTotaisDieta();

  return (
    <div className={styles.card}>
      <h1 className={styles.titulo}>Incluir Dieta</h1>

      {refeicoes.map((refeicao, i) => {
        const totais = calcularTotaisRefeicao(refeicao.alimentos);

        return (
          <div key={i} className={styles.refeicao}>
            <input
              type="text"
              value={refeicao.nome}
              onChange={(e) => alterarNomeRefeicao(i, e.target.value)}
              className={styles.input}
              placeholder="Nome da Refeição"
            />

            {refeicao.alimentos.map((alimento, j) => (
              <div key={j} className={styles.alimento}>
                <select
                  value={alimento.nome}
                  onChange={(e) => alterarAlimento(i, j, "nome", e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione um alimento</option>
                  {Object.keys(alimentosDisponiveis).map((nome) => (
                    <option key={nome} value={nome}>
                      {nome}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={alimento.quantidade}
                  onChange={(e) =>
                    alterarAlimento(i, j, "quantidade", e.target.value)
                  }
                  className={styles.input}
                  placeholder="Quantidade (g)"
                />

                <div className={styles.resumo}>
                  {alimento.calorias} kcal | {alimento.proteinas}g prot |{" "}
                  {alimento.gorduras}g gord | {alimento.carboidratos}g carb
                </div>

                <button
                  onClick={() => removerAlimento(i, j)}
                  className={styles.btnPequeno}
                >
                  Remover Alimento
                </button>
              </div>
            ))}

            <div className={styles.resumo}>
              Total: {totais.calorias.toFixed(1)} kcal |{" "}
              {totais.proteinas.toFixed(1)}g prot |{" "}
              {totais.gorduras.toFixed(1)}g gord |{" "}
              {totais.carboidratos.toFixed(1)}g carb
            </div>

            <button
              onClick={() => adicionarAlimento(i)}
              className={styles.btnPequeno}
            >
              + Adicionar Alimento
            </button>

            <button
              onClick={() => removerRefeicao(i)}
              className={styles.btnPequeno}
            >
              Remover Refeição
            </button>
          </div>
        );
      })}

      <div className={styles.totalGeral}>
        <strong>Total da Dieta:</strong> {totaisGerais.calorias.toFixed(1)} kcal
        | {totaisGerais.proteinas.toFixed(1)}g prot |{" "}
        {totaisGerais.gorduras.toFixed(1)}g gord |{" "}
        {totaisGerais.carboidratos.toFixed(1)}g carb
      </div>

      <button onClick={adicionarRefeicao} className={styles.btnSecundario}>
        + Adicionar Nova Refeição
      </button>

      <button onClick={salvarDieta} className={styles.btnPrincipal}>
        Salvar Dieta
      </button>
    </div>
  );
}
