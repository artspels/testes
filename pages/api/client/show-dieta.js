
import pool from "/lib/db";
import jwt from "jsonwebtoken"; // use se quiser validar assinatura do token
import {jwtDecode} from "jwt-decode"; // se não for assinado, apenas para leitura

export default async function showDieta(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id_client, token } = req.body;

  if (!id_client || !token) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {

    const decoded = jwtDecode(token);
    const userIdFromToken = String(decoded.id);
    console.log("ID do token:", userIdFromToken);

    if (userIdFromToken !== String(id_client)) {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    }

    const query = `SELECT * FROM dietaconsumo WHERE id_client = $1`;

    const result = await pool.query({
      text: query,
      values: [id_client],
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
