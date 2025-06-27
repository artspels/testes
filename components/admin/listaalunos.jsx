import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./listaalunos.module.css";

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchAlunos() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao buscar alunos", error);
      }
    }

    fetchAlunos();
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.name.toLowerCase().includes(filtro.toLowerCase())
  );

  const irParaEdicao = (id) => {
    router.push(`/admin/alunos/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Lista de Alunos</h1>

      <input
        type="text"
        placeholder="Pesquisar por nome..."
        className={styles.input}
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <ul className={styles.lista}>
        {alunosFiltrados.map((aluno) => (
          <li key={aluno.id} className={styles.item}>
            <span>{aluno.name}</span>
            <button
              onClick={() => irParaEdicao(aluno.id)}
              className={styles.botao}
            >
              Editar Perfil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
