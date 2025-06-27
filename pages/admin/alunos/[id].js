import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";

export default function EditarAluno() {
  const router = useRouter();
  const { id } = router.query;
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAluno() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        const encontrado = data.find((aluno) => aluno.id === parseInt(id));
        setAluno(encontrado);
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
      }
    }

    fetchAluno();
  }, [id]);

  if (!aluno) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Editar Perfil de {aluno.name}</h1>

      <form className={styles.form}>
        <div className={styles.campo}>
          <label>Nome</label>
          <input type="text" value={aluno.name} disabled />
        </div>

        <div className={styles.campo}>
          <label>Nova Senha</label>
          <input type="password" placeholder="Digite a nova senha" />
        </div>

        <div className={styles.campo}>
          <label>Dieta</label>
          <textarea placeholder="Descreva a dieta personalizada"></textarea>
        </div>

        <div className={styles.campo}>
          <label>Treino</label>
          <textarea placeholder="Descreva o plano de treino"></textarea>
        </div>

        <button type="submit" className={styles.botao}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
