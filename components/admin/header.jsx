import Image from "next/image";
import styles from "./header.module.css"
import { useRouter } from "next/router";

export default function Header({ url }) {
  const router = useRouter();

  const Voltar = () => {
    router.back();
  };

  return (
    <div className={styles.container}>

      <Image src="/logo.png" alt="Logo" width={40} height={40} className={styles.image} />

      <button onClick={Voltar} className={styles.btnVoltar}>Voltar</button>
    </div>
  );
}
