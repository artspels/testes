import database from "/lib/db.js"; 

async function status(req, response) {
  if (req.method !== 'POST') return response.status(405).end("Método não permitido");

  const {id_client} = req.body;

  try {
    const result = await database.query({
        text: "SELECT * FROM objetivodieta WHERE id_client = $1;",
        values: [id_client]
    });

    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default status;
