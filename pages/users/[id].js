import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css"
import UserHome from "components/user/userHome";
import DietaGrafics from "components/user/dietaGrafics";
import DietaHome from "components/user/dietaHome";
import TreinoHome from "components/user/treinoHome";
import EvolucaoHome from "components/user/evolucaoHome";

export default function Users(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [activeComponent, setActiveComponent] = useState("");

    const renderComponent = () => {
        if (activeComponent === "") return <UserHome setActiveComponent={setActiveComponent} />;
        if (activeComponent === "treino") return <TreinoHome setActiveComponent={setActiveComponent}/>;
        if (activeComponent === "dieta") return <DietaHome setActiveComponent={setActiveComponent}/>;
        if (activeComponent === "evolucao") return <EvolucaoHome setActiveComponent={setActiveComponent}/>;
        return null;
    };

    useEffect(() => {
    const token = localStorage.getItem("token");

    
    if (!token) {
        router.push("/users/login");
        return;
    }

    // Opcional: valida o token com o backend
    fetch("/api/client/auth/verify-token", {
        headers: {
        authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
        if (res.ok) {
            console.log(res)
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
    }, []);

    if (!authorized) return null;


    


    return(
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {renderComponent()}
            </div>
        </div>
    )
}