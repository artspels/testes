export default async function ConsultarMetaClient (id_client){
    try {
        const response = await fetch('/api/meta-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_client }),
        });

        const data = await response.json();

        if (response.ok) {
            return(data);
        } else {
            console.error("Erro ao buscar objetivo dieta:", data);
        }

    } catch (error) {
        console.error("Erro ao conectar com API:", error);
        alert("Erro ao conectar com API:", error)
    }
}
