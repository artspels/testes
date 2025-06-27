import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
