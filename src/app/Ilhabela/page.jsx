import SobreCidade from "@/components/SobreCidade";
import styles from "./Ilhabela.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default function Ilhabela() {
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-ilhabela.png"
        title="Ilhabela"
        subtitle="Um arquipélago incrível com praias, trilhas e cachoeiras."
      />
      <SobreCidade
        nome="Ilhabela"
        descricao="Ilhabela é um arquipélago com mais de 40 praias, trilhas e cachoeiras incríveis."
        curiosidades="Conhecida como a capital da vela."
        populacao="~35 mil habitantes"
        area="348 km²"
        melhorEpoca="Setembro a Março"
        mapaUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117435.23417285034!2d-45.459!3d-23.815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cd63bfbcc6d16f%3A0x6e1e90d5d7e081e4!2sIlhabela%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1694460956754!5m2!1spt-BR!2sbr"
      />
      <Footer />
    </div>
  );
}
