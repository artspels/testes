export default async function SalvarConsumoInicialDiario(id) {

  const token = localStorage.getItem("token");

  const payload = {
    id_client: parseInt(id),
    consumer_protein: '0',
    consumer_carboidratos: '0',
    consumer_gordura: '0',
    consumer_calorias: '0',
    consumer_refeicao: [], 
    token,
  };

  try {
    
    const res = await fetch("/api/client/update-consumo-dieta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      return(data);
    } else {
      console.error("Erro ao salvar dieta:", data);
    }
  } catch (error) {
    console.error("Erro ao conectar com API:", error);
    alert("Erro ao conectar com API:", error)
  }
}






