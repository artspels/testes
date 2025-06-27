import styles from "./toast.module.css";

export default function Toast({ mensagem, tipo, onClose }) {
  return (
    <div className={`${styles.toast} ${tipo === "erro" ? styles.erro : styles.sucesso}`}>
      {mensagem}
      <button onClick={onClose}>×</button>
    </div>
  );
}