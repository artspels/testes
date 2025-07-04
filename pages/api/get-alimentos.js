import database from "/lib/db.js"; 

async function getAlimentos(request, response) {
  if (request.method !== 'GET') return response.status(405).end("Método não permitido");

  try {
    const result = await database.query("SELECT * FROM alimentos;");

    return response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default getAlimentos;