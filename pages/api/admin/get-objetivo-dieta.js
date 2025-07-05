
import pool from "/lib/db";
import jwt from "jsonwebtoken"; // use se quiser validar assinatura do token
import {jwtDecode} from "jwt-decode"; // se não for assinado, apenas para leitura

export default async function showDieta(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id_client } = req.body;

  console.log('id do clienteeee: ',id_client)

  if (!id_client) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {


    const query = `SELECT * FROM objetivodieta WHERE id_client = $1`;

    const result = await pool.query({
      text: query,
      values: [id_client],
    });

    console.log('Respostaaa: ',result.rows)

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
