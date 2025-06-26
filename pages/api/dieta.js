import database from "/infra/database.js"; 

async function status(request, response) {
  try {
    
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
    });
    const today = formatter.format(new Date()); 

    const result = await database.query({
      text: "SELECT * FROM dietaconsumo WHERE id_client = $1 AND date::date = $2",
      values: [2, today]
    });

    console.log(result.rows)
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao buscar dados" });
  }
}

export default status;