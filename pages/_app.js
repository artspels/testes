import '../styles/global.css'
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

function MyApp({ Component, pageProps }) {
  return <Component className={`${montserrat.variable} ${openSans.variable}`} {...pageProps} />
}

export default MyApp
