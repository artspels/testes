import database from "/lib/db.js"; 

async function users(request, response) {
  try {
    const { id } = request.query; // captura o parâmetro ?id= do request

    let result;

    if (id) {
      // busca pelo ID
      result = await database.query({
        text: "SELECT id, name FROM clients WHERE id = $1;",
        values: [id],
      });

      if (result.rows.length === 0) {
        return response.status(404).json({ error: "Cliente não encontrado" });
      }
    } else {
      // busca todos os clientes
      result = await database.query({
        text: "SELECT id, name FROM clients;",
      });
    }

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default users;
