import database from "/lib/db.js"; 

async function status(request, response) {
  try {
    const result = await database.query("SELECT * FROM objetivodieta;");
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default status;
