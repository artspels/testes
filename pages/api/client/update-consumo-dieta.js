import pool from '/lib/db';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end("Método não permitido");

  const {
    id_client,
    consumer_protein,
    consumer_carboidratos,
    consumer_gordura,
    consumer_calorias,
    consumer_refeicao,
  } = req.body;

  const dataHoje = dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DD');

  try {
    const selectQuery = 'SELECT * FROM dietaconsumo WHERE id_client = $1 AND date::date = $2';
    const existingResult = await pool.query({ text: selectQuery, values: [id_client, dataHoje] });
    const existing = existingResult.rows;

    if (existing.length > 0) {
      const atual = existing[0];
      const refeicaoAtual = atual.consumer_refeicao || {};
      const refeicaoNova = consumer_refeicao || {};

      function mergeRefeicoes(antigas, novas) {
        const resultado = { ...antigas };
        for (const nomeRefeicao in novas) {
          if (!resultado[nomeRefeicao]) {
            resultado[nomeRefeicao] = novas[nomeRefeicao];
          } else {
            resultado[nomeRefeicao].refeicoes = [
              ...(resultado[nomeRefeicao].refeicoes || []),
              ...(novas[nomeRefeicao].refeicoes || [])
            ];
            resultado[nomeRefeicao].consumototal += novas[nomeRefeicao].consumototal || 0;
          }
        }
        return resultado;
      }

      const refeicaoAtualizada = mergeRefeicoes(refeicaoAtual, refeicaoNova);

      const newConsumo = {
        consumer_protein: Number(atual.consumer_protein) + Number(consumer_protein),
        consumer_carboidratos: Number(atual.consumer_carboidratos) + Number(consumer_carboidratos),
        consumer_gordura: Number(atual.consumer_gordura) + Number(consumer_gordura),
        consumer_calorias: Number(atual.consumer_calorias) + Number(consumer_calorias),
        consumer_refeicao: refeicaoAtualizada
      };

      await pool.query({
        text: `
          UPDATE dietaconsumo
          SET consumer_protein = $1,
              consumer_carboidratos = $2,
              consumer_gordura = $3,
              consumer_calorias = $4,
              consumer_refeicao = $5
          WHERE id = $6
        `,
        values: [
          newConsumo.consumer_protein,
          newConsumo.consumer_carboidratos,
          newConsumo.consumer_gordura,
          newConsumo.consumer_calorias,
          JSON.stringify(newConsumo.consumer_refeicao),
          atual.id
        ]
      });

      return res.status(200).json({ message: "Consumo atualizado com sucesso." });
    }

    const resultMetas = await pool.query({
      text: 'SELECT * FROM objetivodieta WHERE id_client = $1',
      values: [id_client],
    });

    const metas = resultMetas.rows;

    if (!Array.isArray(metas) || metas.length === 0 || !metas[0].meta_protein) {
      return res.status(404).json({ error: "Metas não encontradas para o cliente." });
    }

    await pool.query({
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
      `,
      values: [
        id_client,
        consumer_protein,
        metas[0].meta_protein,
        consumer_carboidratos,
        metas[0].meta_carboidratos,
        consumer_gordura,
        metas[0].meta_gordura,
        consumer_calorias,
        metas[0].meta_calorias,
        dataHoje,
        JSON.stringify(consumer_refeicao),
        JSON.stringify(metas[0].refeicoes),
      ]
    });

    return res.status(201).json({ message: "Consumo inserido com sucesso." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
