import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Admin from "/components/admin/admin"; 

export default function HomeAdmin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
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
          router.push("/admin/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/admin/login");
      });
  }, []);

  if (!authorized) return null; // ou um loading...

  return <Admin />;
}
