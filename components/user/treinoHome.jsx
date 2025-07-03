import Logo from "components/logo";
import styles from "./treinoHome.module.css"
import ListDiaTreino from "./components/listDiaTreino";
import { CirclePlay,  Salad } from "lucide-react";

export default function TreinoHome({ setActiveComponent }){
    return(
        <div>
            <div className={styles.header}>
                <Logo />
                <button onClick={() => setActiveComponent("")} className={styles.btnVoltar}>Voltar</button>
            </div>
            <ListDiaTreino />
            <div className={styles.wrapperLinks}>
                <a className={styles.btnLinks} onClick={() => setActiveComponent("treino")}><div className={styles.wraperTextLink}> Iniciar Treino <div className={styles.iconLinks}><CirclePlay  color="#FFFFFF" size={26} /> </div></div></a>
                <a className={styles.btnLinks} onClick={() => setActiveComponent("dieta")}><div className={styles.wraperTextLink}> Minha Dieta <div className={styles.iconLinks}><Salad  color="#FFFFFF" size={26} /></div></div></a>
            </div>
        </div>
    )
}