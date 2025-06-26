import database from "/infra/database.js"; 

async function status(request, response) {
  try {
    const result = await database.query({
        text: "SELECT * FROM objetivodieta WHERE id_client = $1;",
        values: [2]
    });

    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default status;
