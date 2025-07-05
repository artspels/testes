import { jwtDecode } from "jwt-decode";
import database from "/lib/db.js"; 

async function status(request, response) {
 
  if (request.method !== 'POST') return response.status(405).end("Método não permitido");

  const {id_client,token} = request.body;

  if (!id_client || !token) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  

  try {
    const { id: idToken } = jwtDecode(token);
    if (String(idToken) !== String(id_client)) {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    } 

    
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
    });
    const today = formatter.format(new Date()); 

    const result = await database.query({
      text: "SELECT * FROM dietaconsumo WHERE id_client = $1 AND date::date = $2",
      values: [id_client, today]
    });
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default status;