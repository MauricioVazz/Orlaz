import styles from "./Caraguatatuba.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import SobreCidade from "@/components/SobreCidade";

export default function Caraguatatuba() {
    return (
        <div>
            <Header />
            <Banner
                image="/images/banner-home.png"
                title="Caraguatatuba"
            />
            <SobreCidade
                nome="Caraguatatuba"
                descricao="Caraguatatuba, conhecida como “Caraguá”, é uma cidade litorânea no estado de São Paulo, que integra a Região Metropolitana do Vale do Paraíba e Litoral Norte."
                curiosidades="Cidade com belas praias e muita história."
                populacao="~125 mil habitantes"
                area="485 km²"
                melhorEpoca="Dezembro a Março"
                mapaUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58731.16956774998!2d-45.447!3d-23.622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cd52df83f7c4a9%3A0x7c6e77cbfc5f9c9d!2sCaraguatatuba%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1694460892957!5m2!1spt-BR!2sbr"
            />
            <Footer />
        </div>
    );
}
