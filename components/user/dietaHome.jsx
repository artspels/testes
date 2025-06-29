import Logo from "components/logo"
import styles from "./dietaHome.module.css"
import { useRouter } from "next/router"
import { useState } from "react";
import { CircleAlert, CirclePlay } from "lucide-react";


export default function DietaHome({ setActiveComponent }){
    const router = useRouter("");
    const [activeComponentGrafic, setActiveComponentGrafic] = useState("");
    const renderComponent = () => {
        if (activeComponentGrafic === "") return <h1>teste</h1>;
        if (activeComponentGrafic === "startDieta") return <h1>iniciando dieta</h1>;
        return null;
    };

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Logo />
                <button onClick={() => setActiveComponent("")} className={styles.btnVoltar}>Voltar</button>
            </div>
            <div className={styles.wraperContent}>
                <div >      
                    Grafico              
                </div>
                <div className={styles.containerAviso}>
                    <div className={styles.wrapperAviso}>
                        <div className={styles.wrapperTitle}>
                            <div className={styles.iconLinks}><CircleAlert  color="#FFFFFF" size={26} /></div>
                            <h1 className={styles.title}>Importante !</h1>
                        </div>      
                        <p className={styles.text}>
                            É importante lembrar que você está seguindo uma dieta cut, com foco na perda de peso e redução de gordura corporal. Por isso, procure manter o consumo de carboidratos e gorduras mais baixo, priorizando alimentos ricos em proteína e com boa qualidade nutricional. 
                            Pequenas escolhas no dia a dia fazem toda a diferença para alcançar seus resultados de forma saudável e eficiente.
                        </p>         
                    </div>
                </div>
                {renderComponent()}
                <button className={styles.btnLinks} onClick={() => setActiveComponentGrafic("startDieta")}> <div className={styles.wraperTextLink}>Marcar Dieta <div className={styles.iconLinks}><CirclePlay  color="#FFFFFF" size={26} /> </div></div></button>
            </div>
        </div>
    )
}