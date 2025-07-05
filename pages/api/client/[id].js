import pool from "/lib/db";
import { verifyToken } from "/lib/auth/verify-token";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id } = req.query;
  const { name, password } = req.body;

  

  // Verificação do token
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: "Token inválido ou ausente" });
  }


  if (!name && !password) {
    return res.status(400).json({ error: "Informe nome ou senha para atualizar" });
  }

  try {
    const fields = [];
    const values = [];

    // Mapeia os campos dinamicamente
    if (name) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(name);
      
    }

    if (password) {
      fields.push(`password = $${fields.length + 1}`);
      values.push(password);
      
    }

    values.push(id);

    const query = `UPDATE clients SET ${fields.join(", ")} WHERE id = $${fields.length + 1}`;

    await pool.query({
      text: query,
      values: values
    });

    res.status(200).json({ message: "Cliente atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
