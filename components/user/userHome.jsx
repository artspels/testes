import { ChartNoAxesCombined, ClipboardList, Salad, UserRoundCog } from 'lucide-react'
import styles from './userHome.module.css'
import Logo from 'components/logo'
import { useRouter } from 'next/router';

export default function UserHome({ setActiveComponent }){
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/users/login");
    };
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Logo />
                <button onClick={handleLogout} className={styles.btnVoltar}>Sair</button>
            </div>
            <div className={styles.wraperContent}>
                <div className={styles.wrapperLinks}>
                    <a className={styles.btnLinks} onClick={() => setActiveComponent("treino")}><div className={styles.wraperTextLink}> Meu Treino <div className={styles.iconLinks}><ClipboardList  color="#FFFFFF" size={26} /> </div></div></a>
                    <a className={styles.btnLinks} onClick={() => setActiveComponent("dieta")}><div className={styles.wraperTextLink}> Minha Dieta <div className={styles.iconLinks}><Salad  color="#FFFFFF" size={26} /></div></div></a>
                    <a className={styles.btnLinks} onClick={() => setActiveComponent("evolucao")}><div className={styles.wraperTextLink}>Minha Evolução <div className={styles.iconLinks}><ChartNoAxesCombined  color="#FFFFFF" size={26} /> </div></div></a>
                </div>
                <a className={styles.btnLinks} onClick={() => setActiveComponent("configuracao")}><div className={styles.wraperTextLink}>Configuração <div className={styles.iconLinks}><UserRoundCog  color="#FFFFFF" size={26} /> </div></div></a>
        
            </div>
        </div>
    )
}