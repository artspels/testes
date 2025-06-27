import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id } = req.query;
  const { name, password } = req.body;

  // Autenticar
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: "Token inválido ou ausente" });
  }

  if (parseInt(user.id) !== parseInt(id)) {
    return res.status(403).json({ error: "Você não tem permissão para editar esse cliente" });
  }

  if (!name && !password) {
    return res.status(400).json({ error: "Informe nome ou senha para atualizar" });
  }

  try {
    const fields = [];
    const values = [];
    let i = 1;

    if (name) {
      fields.push(`name = $${i++}`);
      values.push(name);
    }

    if (password) {
      fields.push(`password = $${i++}`);
      values.push(password);
    }

    values.push(id);
    const query = `UPDATE cliente SET ${fields.join(", ")} WHERE id = $${i}`;

    await pool.query(query, values);

    res.status(200).json({ message: "Cliente atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
