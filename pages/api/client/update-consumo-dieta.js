import pool from '/lib/db';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { jwtDecode } from "jwt-decode";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end("Método não permitido");
  }

  const {
    id_client,
    consumer_refeicao,
    token,
  } = req.body;

  const dataHoje = dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DD');

  if (!id_client || !token) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const { id: idToken } = jwtDecode(token);
    if (String(idToken) !== String(id_client)) {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    }

    // 🔎 Busca metas do usuário
    const resultadoMetas = await pool.query({
      text: 'SELECT * FROM objetivodieta WHERE id_client = $1',
      values: [id_client],
    });

    const metasUsuario = resultadoMetas.rows[0];

    if (!metasUsuario?.meta_protein || !metasUsuario.refeicoes) {
      return res.status(404).json({ error: "Você ainda não possui nenhuma dieta." });
    }

    // 🟡 Se não veio nenhuma refeição, gera com base nas metas
    let refeicaoFinal = consumer_refeicao;
    const isRefeicaoVazia =
      !consumer_refeicao ||
      (typeof consumer_refeicao === 'object' && Object.keys(consumer_refeicao).length === 0);

    if (isRefeicaoVazia) {
      refeicaoFinal = {};

      for (const [nomeRefeicao, alimentos] of Object.entries(metasUsuario.refeicoes)) {
        // Garante que alimentos seja array
        const listaAlimentos = Array.isArray(alimentos)
          ? alimentos
          : typeof alimentos === 'object' && alimentos !== null
            ? [alimentos]
            : [];

        // Estrutura com todos alimentos zerados
        const refeicoesZeradas = listaAlimentos.map((item) => {
          const nomeAlimento = Object.keys(item)[0];
          return { [nomeAlimento]: 0 };
        });

        refeicaoFinal[nomeRefeicao] = {
          refeicoes: refeicoesZeradas,
          consumototal: {
            carboidratos: 0,
            proteinas: 0,
            gorduras: 0,
            calorias: 0,
          },
        };
      }
    }

    // 🔢 Soma os valores totais de todas as refeições
    let totalProteina = 0;
    let totalCarboidratos = 0;
    let totalGordura = 0;
    let totalCalorias = 0;

    for (const nomeRefeicao in refeicaoFinal) {
      const refeicao = refeicaoFinal[nomeRefeicao];
      if (refeicao?.consumototal) {
        totalProteina += Number(refeicao.consumototal.proteinas || 0);
        totalCarboidratos += Number(refeicao.consumototal.carboidratos || 0);
        totalGordura += Number(refeicao.consumototal.gorduras || 0);
        totalCalorias += Number(refeicao.consumototal.calorias || 0);
      }
    }

    totalProteina = Number(totalProteina.toFixed(2));
    totalCarboidratos = Number(totalCarboidratos.toFixed(2));
    totalGordura = Number(totalGordura.toFixed(2));
    totalCalorias = Number(totalCalorias.toFixed(2));

    // 🔍 Verifica se já existe consumo para o dia
    const selectQuery = `
      SELECT * FROM dietaconsumo 
      WHERE id_client = $1 AND date::date = $2
    `;
    const registrosExistentes = await pool.query({
      text: selectQuery,
      values: [id_client, dataHoje]
    });

    // Atualização de registro existente
    if (registrosExistentes.rows.length > 0) {
      const registroAtual = registrosExistentes.rows[0];
      const refeicaoAtual = registroAtual.consumer_refeicao || {};
      const refeicaoNova = refeicaoFinal || {};

      const mergeRefeicoes = (antigas, novas) => {
        const resultado = { ...antigas };
        for (const nome in novas) {
          if (!resultado[nome]) {
            resultado[nome] = novas[nome];
          } else {
            resultado[nome].refeicoes = [
              ...(resultado[nome].refeicoes || []),
              ...(novas[nome].refeicoes || [])
            ];

            const atual = resultado[nome].consumototal || {};
            const novo = novas[nome].consumototal || {};
            resultado[nome].consumototal = {
              carboidratos: Number(atual.carboidratos || 0) + Number(novo.carboidratos || 0),
              proteinas: Number(atual.proteinas || 0) + Number(novo.proteinas || 0),
              gorduras: Number(atual.gorduras || 0) + Number(novo.gorduras || 0),
              calorias: Number(atual.calorias || 0) + Number(novo.calorias || 0),
            };
          }
        }
        return resultado;
      };

      // const refeicaoAtualizada = mergeRefeicoes(refeicaoAtual, refeicaoNova);
      const refeicaoAtualizada = { ...refeicaoAtual, ...refeicaoNova };

      const resultadoUpdate = await pool.query({
        text: `
          UPDATE dietaconsumo
          SET consumer_protein = $1,
              consumer_carboidratos = $2,
              consumer_gordura = $3,
              consumer_calorias = $4,
              consumer_refeicao = $5
          WHERE id = $6
          RETURNING *;
        `,
        values: [
          totalProteina,
          totalCarboidratos,
          totalGordura,
          totalCalorias,
          JSON.stringify(refeicaoAtualizada),
          registroAtual.id
        ]
      });

      return res.status(200).json({
        message: "Consumo atualizado com sucesso.",
        data: resultadoUpdate.rows
      });
    }

    // 🟢 Inserção de novo consumo
    const resultadoInsert = await pool.query({
      text: `
        INSERT INTO dietaconsumo (
          id_client,
          consumer_protein,
          total_protein,
          consumer_carboidratos,
          total_carboidratos,
          consumer_gordura,
          total_gordura,
          consumer_calorias,
          total_calorias,
          date,
          consumer_refeicao,
          total_refeicao
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *;
      `,
      values: [
        id_client,
        totalProteina,
        metasUsuario.meta_protein,
        totalCarboidratos,
        metasUsuario.meta_carboidratos,
        totalGordura,
        metasUsuario.meta_gordura,
        totalCalorias,
        metasUsuario.meta_calorias,
        dataHoje,
        JSON.stringify(refeicaoFinal),
        JSON.stringify(metasUsuario.refeicoes),
      ]
    });

    return res.status(201).json(resultadoInsert.rows);

  } catch (error) {
    console.error("Erro no handler dieta:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
