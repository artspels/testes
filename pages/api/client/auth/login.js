import pool from "/lib/db.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { number, password } = req.body;

  const result = await pool.query({
  text: "SELECT * FROM clients WHERE number = $1 AND password = $2",
  values: [number, password],
});

  const user = result.rows[0];

  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign({ id: user.id, name: user.name, permission: user.permission }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.status(200).json({ token });
}
