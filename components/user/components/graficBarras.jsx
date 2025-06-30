import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from 'recharts';

function comparar(valor, limite, operador) {
  switch (operador) {
    case '>': return valor > limite;
    case '<': return valor < limite;
    default: return false;
  }
}

export default function GraficoBarras({id}) {
  const [dieta, setDieta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const operador = '<'; 
  const router = useRouter();


  useEffect(() => {
    async function fetchDieta() {
      try {
        const token = localStorage.getItem('token');
        const { id } = router.query;
        const id_client = id;

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
          // Transforma os dados para o formato usado no gráfico
          const dadosTransformados = result.map((item) => ({
            nome: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            calorias: Number(item.consumer_calorias),
            meta: Number(item.total_calorias),
          }));
          setDieta(dadosTransformados);
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
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={dieta}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> linhas grid */}
          <XAxis dataKey="nome" />
          {/* <YAxis /> linha vertical */}
          <Tooltip />

          <ReferenceLine y={2000} stroke="limegreen" strokeWidth={2} />
          <Bar dataKey="calorias" radius={[10, 10, 0, 0]}>
            {dieta.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={comparar(entry.calorias, entry.meta, operador) ? "#e76f6f" : "#80d4ff"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
