import SobreCidade from "@/components/SobreCidade";
import styles from "./Ubatuba.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default function Ubatuba() {
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-ubatuba.png"
        title="Ubatuba"
        subtitle="A capital do surf, com mais de 100 praias e muita natureza."
      />
      <SobreCidade
        nome="Ubatuba"
        descricao="Ubatuba, chamada de capital do surf, possui mais de 100 praias e vastas áreas de Mata Atlântica."
        curiosidades="Abriga o Projeto Tamar de preservação das tartarugas marinhas."
        populacao="~92 mil habitantes"
        area="723 km²"
        melhorEpoca="Dezembro a Março"
        mapaUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46918.56046056298!2d-45.118!3d-23.436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cd6349b9dfd38f%3A0x2ab51e5c2a1a2db3!2sUbatuba%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1694461085678!5m2!1spt-BR!2sbr"
      />
      <Footer />
    </div>
  );
}
