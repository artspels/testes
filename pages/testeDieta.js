// /pages/cliente/dieta.js
import { useEffect, useState } from 'react';

export default function DietaPage() {
  const [dieta, setDieta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchDieta() {
      try {
        const token = localStorage.getItem('token');
        const id_client = 3;

        if (!token || !id_client) {
          setErro('Token ou ID do cliente ausente.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/client/show-dieta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, id_client }),
        });

        const result = await response.json();

        if (response.ok) {
          setDieta(result);
          
        } else {
          setErro(result.error || 'Erro ao buscar dieta');
        }
      } catch (err) {
        console.error(err);
        setErro('Erro na requisição');
      } finally {
        setLoading(false);
      }
    }

    fetchDieta();
  }, []);



  if (loading) return <p>Carregando dieta...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div>
      <h1>Sua Dieta</h1>
      {Array.isArray(dieta) && dieta.length === 0 ? (
        <p>Nenhuma dieta encontrada.</p>
      ) : (
        <ul>
          {dieta.map((item, index) => (
            <li key={index}>
              proteina: {item.consumer_protein} / {item.total_protein}g  <br />
              Carboidrato: {item.consumer_carboidratos} / {item.total_carboidratos}g <br />
              gordura: {item.consumer_gordura} / {item.total_gordura}g <br />
              Calorias: {item.consumer_calorias} / {item.total_calorias}g <br />
              Data: {item.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
