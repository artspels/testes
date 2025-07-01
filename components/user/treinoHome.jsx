import Logo from "components/logo";
import styles from "./treinoHome.module.css"
import ListDiaTreino from "./components/listDiaTreino";

export default function TreinoHome({ setActiveComponent }){
    return(
        <div>
            <div className={styles.header}>
                <Logo />
                <button onClick={() => setActiveComponent("")} className={styles.btnVoltar}>Voltar</button>
            </div>
            <ListDiaTreino />
        </div>
    )
}