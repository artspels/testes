import styles from "./footer.module.css"
export default function Footer(){
    return(
        <footer className={styles.footer}>
            {/* <Logo /> */}
            <div>
                <a href="#Home" className={styles.btnNavs}>Home</a>
                <a href="#Perfil" className={styles.btnNavs}>Perfil</a>
                <a href="#Planos" className={styles.btnNavs}>Planos</a>
                <a href="#Sobre" className={styles.btnNavs}>Sobre</a>
            </div>
        </footer>
    )
}