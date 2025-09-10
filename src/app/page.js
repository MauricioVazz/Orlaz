import Head from "next/head";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Attractions from "@/components/Attractions";
<<<<<<< HEAD
import ContactUs from "@/components/ContactUs";
=======
import Cards from "@/components/Cards";
>>>>>>> 7735defdfc543527594a3dba6cb2f067f36743fc

export default function Home() {
    return (
        <>
            <Head>
                <title>Orlaz</title>
                <meta
                    name="description"
                    content="Site de turismo para explorar cidades e atrações"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header />

            <Banner />
            
            <section>
            < Cards/>
            </section>

            <section>
                <Attractions />
            </section>

            <ContactUs />
        </>
    );
}
