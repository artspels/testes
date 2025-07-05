import pool from "/lib/db.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { jwtDecode } from "jwt-decode";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function updateObjetivoDieta(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  const {
    token,
    id_client,
    meta_protein,
    meta_carboidratos,
    meta_gordura,
    meta_calorias,
    data_final,
    refeicoes,
    contentrefeicaonutri
  } = req.body;

  const data_inicio = dayjs().tz("America/Sao_Paulo").format("YYYY-MM-DD");

  
  try {
    const { permission } = jwtDecode(token);

    if (String(permission) !== 'admin') {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    }


    // Verifica se já existe objetivo para o cliente
    const selectResult = await pool.query({
      text: "SELECT * FROM objetivodieta WHERE id_client = $1",
      values: [id_client],
    });

    let dbResult;

    if (Array.isArray(selectResult.rows) && selectResult.rows.length > 0) {
      // Atualiza se já existe
      dbResult = await pool.query({
        text: `
          UPDATE objetivodieta
          SET meta_protein = $2,
              meta_carboidratos = $3,
              meta_gordura = $4,
              meta_calorias = $5,
              refeicoes = $6,
              contentrefeicaonutri = $7
          WHERE id_client = $1
          RETURNING *;
        `,
        values: [
          id_client,
          meta_protein,
          meta_carboidratos,
          meta_gordura,
          meta_calorias,
          refeicoes,
          contentrefeicaonutri,
        ],
      });

      
    } else {
      // Insere se não existe
      dbResult = await pool.query({
        text: `
          INSERT INTO objetivodieta (
            id_client,
            meta_protein,
            meta_carboidratos,
            meta_gordura,
            meta_calorias,
            data_inicio,
            data_final,
            refeicoes,
            contentrefeicaonutri
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
        `,
        values: [
          id_client,
          meta_protein,
          meta_carboidratos,
          meta_gordura,
          meta_calorias,
          data_inicio,
          data_final,
          refeicoes,
          contentrefeicaonutri,
        ],
      });
    }

    return res.status(200).json(dbResult.rows[0]); // Retorna só o primeiro registro
  } catch (error) {
    console.error("Erro ao atualizar/inserir objetivo da dieta:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
