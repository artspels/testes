import Footer from "../components/footer";
import GraficHeader from "../components/graficHeader";
import {  Montserrat, Open_Sans } from 'next/font/google';

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

    

    return (
        <>
        <div className={`${montserrat.variable} ${openSans.variable}`}>
            <GraficHeader />
        </div>
            
        </>
    )
}