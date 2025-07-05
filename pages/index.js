import { useRouter } from "next/router";
import Footer from "../components/footer";
import GraficHeader from "../components/graficHeader";
import {  Montserrat, Open_Sans } from 'next/font/google';
import { useEffect } from "react";

const montserrat = Montserrat({
subsets: ['latin'],
weight: ['400', '600', '700'],
variable: '--font-montserrat',
});

const openSans = Open_Sans({
subsets: ['latin'],
weight: ['400', '600'],
variable: '--font-open-sans',
});
 
export default function App(){
    const router = useRouter();

    useEffect(() => {
        router.push("/users/login"); 
    }, [router.isReady, router.query.id]);
   
    

    return (
        <>
        <div className={`${montserrat.variable} ${openSans.variable}`}>
        </div>
            
        </>
    )
}