import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { number, password } = req.body;

  const result = await pool.query("SELECT * FROM cliente WHERE number = $1 AND password = $2", [
    number,
    password,
  ]);

  const user = result.rows[0];
  
  console.log('user permission:', user.permission);

  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign({ id: user.id, name: user.name , permission: user.permission}, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.status(200).json({ token });
}
