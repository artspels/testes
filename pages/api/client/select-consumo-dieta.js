import  pool  from '/lib/db'; 
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end("Método não permitido");

//   const {
//     id_client,
//   } = req.body;

const id_client = 2

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const dataHoje = dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DD');

  try {

    const textquery = 'SELECT * FROM dietaconsumo WHERE id_client = $1 AND date::date = $2'


    const existingResult = await pool.query({
        text: textquery,
        values: [id_client,dataHoje],
    });

    const existing = existingResult.rows
    console.log('aqui o exist:',existing.length)
    

    return res.status(200).json(existing);

    return res.status(201).json({ message: "Consumo inserido com sucesso." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
