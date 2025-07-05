import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css"
import UserHome from "components/user/userHome";
import DietaGrafics from "components/user/dietaGrafics";
import DietaHome from "components/user/dietaHome";
import TreinoHome from "components/user/treinoHome";
import EvolucaoHome from "components/user/evolucaoHome";
import {jwtDecode} from "jwt-decode";
import GraficHeader from "components/user/graficDieta";
import DietaCadastro from "components/user/dietaCadastro";
import EditConsumoDiario from "components/user/components/editConsumoDiario";
import Toast from "components/admin/toast";
import ConfigureHome from "components/user/configureHome";

export default function Users(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [activeComponent, setActiveComponent] = useState("");
    const [dataIndex, setDataIndex] = useState("");
    const [toast, setToast] = useState(null);


    const renderComponent = () => {
        if (activeComponent === "") return <UserHome setActiveComponent={setActiveComponent} />;
        if (activeComponent === "treino") return <TreinoHome setActiveComponent={setActiveComponent}/>;
        if (activeComponent === "dieta") return <DietaHome setActiveComponent={setActiveComponent} />;
        if (activeComponent === "evolucao") return <EvolucaoHome setActiveComponent={setActiveComponent} />;
        if (activeComponent === "graficDieta") return <GraficHeader setActiveComponent={setActiveComponent} setDataIndex={setDataIndex}/>;
        if (activeComponent === "cadastroDieta") return <DietaCadastro setActiveComponent={setActiveComponent} />;
        if (activeComponent === "editDietas") return <EditConsumoDiario setActiveComponent={setActiveComponent} index={dataIndex} setToast={setToast}/>;
        if (activeComponent === "configuracao") return <ConfigureHome setActiveComponent={setActiveComponent}/>;
         
        return null;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/users/login"); 
            return;
        }

        if (!router.isReady) return; // Espera o Next.js terminar de montar a rota
        const { id } = router.query;
        if (!id) return;

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            localStorage.removeItem("token");
            router.push("/users/login");
            return;
        }

        const userIdFromToken = String(decoded.id);

        if (userIdFromToken !== id) {
            router.push("/users/login");
            return;
        }

        // Validação opcional com o backend
        fetch("/api/client/auth/verify-token", {
            headers: {
            authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (res.ok) {
            setAuthorized(true);
        } else {
            localStorage.removeItem("token");
            router.push("/users/login");
          }
        })
        .catch(() => {
            localStorage.removeItem("token");
            router.push("/users/login");
        });

    }, [router.isReady, router.query.id]);


    if (!authorized) return null;


    


    return(
        <div className={styles.container}>
            {toast && (
                <Toast
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onClose={() => setToast(null)}
                />
            )}
            <div className={styles.wrapper}>
                {renderComponent()}
            </div>
            {/* <div className={styles.marginBot}>

            </div> */}
        </div>
    )
}