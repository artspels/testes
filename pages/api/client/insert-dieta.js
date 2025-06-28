import pool  from "/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const {
    id_client,
    meta_protein,
    meta_carboidratos,
    meta_gordura,
    meta_calorias,
    data_inicio,
    data_final,
    refeicoes
  } = req.body;

  if (!id_client || !meta_calorias || !data_inicio || !refeicoes) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Etapa 1: Verifica se o cliente já tem uma dieta ativa

    const queryObject = 'SELECT * FROM objetivodieta WHERE id_client = $1'


    const existing = await pool.query({
        text: queryObject,
        values: [id_client],
    });



    if (existing.rows.length > 0) {
      // Etapa 2: Atualiza a dieta existente
      const result = await pool.query({
        text: `UPDATE objetivodieta SET 
                 meta_protein = $1,
                 meta_carboidratos = $2,
                 meta_gordura = $3,
                 meta_calorias = $4,
                 data_inicio = $5,
                 refeicoes = $6
               WHERE id_client = $7 AND data_final IS NULL
               RETURNING *`,
        values: [
          meta_protein,
          meta_carboidratos,
          meta_gordura,
          meta_calorias,
          data_inicio,
          JSON.stringify(refeicoes),
          id_client,
        ],
      });

      return res.status(200).json({ dieta: result.rows[0], message: "Dieta atualizada com sucesso" });

    } else {
      // Etapa 3: Cria nova dieta
      const result = await pool.query({
        text: `INSERT INTO objetivodieta (
                id_client, meta_protein, meta_carboidratos, meta_gordura,
                meta_calorias, data_inicio, data_final, refeicoes
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING *`,
        values:[
          id_client,
          meta_protein,
          meta_carboidratos,
          meta_gordura,
          meta_calorias,
          data_inicio,
          data_final,
          JSON.stringify(refeicoes)
        ]
      });

      return res.status(201).json({ dieta: result.rows[0], message: "Dieta criada com sucesso" });
    }

  } catch (error) {
    console.error("Erro ao salvar dieta:", error);
    return res.status(500).json({ error: "Erro interno ao salvar dieta" });
  }
}
