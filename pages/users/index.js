import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css"

export default function Users(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

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
        <div>
            <div className={styles.header}></div>
            <div>
                <div>
                    <a>Meu Treino</a>
                    <a>Minha Dieta</a>
                    <a>Minha Evolução</a>
                </div>
                <a></a>
            </div>
        </div>
    )
}