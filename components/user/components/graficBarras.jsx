import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from "./graficBarras.module.css"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from 'recharts';
import ConsultarMetaClient from 'controller/consultar-meta-cliente';

function comparar(valor, limite, operador) {
  switch (operador) {
    case '>': return valor > limite;
    case '<': return valor < limite;
    default: return false;
  }
}

export default function GraficoBarras() {
  const [dieta, setDieta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [metaDieta, setMetaDieta] = useState([])
  const operador = '>';
  const router = useRouter();

  useEffect(() => {
    async function fetchDieta() {
      const { id } = router.query;
      const id_client = id;

      try {
        const token = localStorage.getItem('token');
        

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
          const hoje = new Date();
          const diasCompletos = [];

          for (let i = 7; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() - i);

            const dataFormatada = data.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });

            const diaSemana = data.toLocaleDateString("pt-BR", {
              weekday: "short",
            }).replace('.', '');

            const sigla = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

            diasCompletos.push({
              nome: `${dataFormatada} (${sigla})`,
              dataISO: data.toISOString().slice(0, 10),
            });
          }

          const dadosAPI = result.map((item) => ({
            dataISO: new Date(item.date).toISOString().slice(0, 10),
            calorias: Number(item.consumer_calorias),
            meta: Number(item.total_calorias),
          }));
          const dadosFinal = diasCompletos.map((dia) => {
            const encontrado = dadosAPI.find((item) => item.dataISO === dia.dataISO);
            return {
              nome: dia.nome,
              calorias: encontrado ? encontrado.calorias : 0,
              meta: encontrado ? encontrado.meta : 2000,
            };
          });

          setDieta(dadosFinal);
        } else {
          setErro(result.error || 'Erro ao buscar dieta');
        }
      } catch (err) {
        console.error(err);
        setErro('Erro na requisição');
      } finally {
        setLoading(false);
      }

      const valueMetaTratado = await ConsultarMetaClient(id_client);
      setMetaDieta(valueMetaTratado[0].meta_calorias);
    }

    fetchDieta();

  }, [router.query]);

  if (loading) return <p>Carregando dieta...</p>;
  if (erro) return <p>Erro: {erro}</p>;


  return (
    <div className={styles.container}>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer  tabIndex={-1} >
          <BarChart
            data={dieta}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="nome"
              interval={0}
              tick={({ x, y, payload }) => {
                // Divide a string: "23/06 (Seg)" => ["23/06", "Seg"]
                const [data, siglaRaw] = payload.value.split(' ');
                const sigla = siglaRaw?.replace(/[()]/g, '').toLowerCase(); // "Seg" => "seg"

                return (
                  <g className={styles.datasigle} transform={`translate(${x},${y})`}>
                    <rect
                      x={-10}  // desloca para a esquerda para centralizar o fundo no texto
                      y={-1}    // ajusta a posição vertical para começar um pouco acima do primeiro texto
                      width={20}  // largura suficiente para cobrir o texto
                      height={16} // altura suficiente para cobrir ambos os textos
                      fill="rgba(0, 0, 0, 0.1)" // cor de fundo semi-transparente, você pode mudar
                      rx={10}    // arredonda as bordas
                      ry={10}
                    />
                    
                    <text
                      x={0}
                      y={12}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight="800"
                      fill="rgba(0,0,0,0.8)"
                      fontFamily="'Montserrat', sans-serif"
                    >
                      {data.split('/')[0]} {/* apenas o dia */}
                    </text>
                    
                    <text
                      x={0}
                      y={22}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="800"
                      fill="rgba(0,0,0,0.4)"
                      fontFamily="'Montserrat', sans-serif"
                    >
                      {sigla}
                    </text>
                  </g>

                );
              }}
            />

            <Tooltip />
 
            <ReferenceLine y={metaDieta} stroke="limegreen" strokeWidth={2} />
            <Bar dataKey="calorias" radius={[10, 10, 0, 0]}>
              {dieta.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={comparar(entry.calorias, metaDieta, operador) ? "#e76f6f" : "#80d4ff"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
