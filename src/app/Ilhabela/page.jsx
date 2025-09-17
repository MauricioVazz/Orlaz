"use client";

import SobreCidade from "@/components/SobreCidade";
import styles from "./Ilhabela.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import AtracoesBela from "@/components/Atracoes/Bela"; // Import corrigido para o nome correto
import { FaWater, FaSailboat, FaUmbrellaBeach, FaDrum } from "react-icons/fa6";
import EventosTimeline from "@/components/EventosTimeline";
import Gastronomy from "@/components/Gastronomy";

export default function Ilhabela() {
  const eventos = [
    { data: "10/7 a 20/7", nome: "Festival de Vela", icone: <FaSailboat /> },
    { data: "5/8", nome: "Show na Praia", icone: <FaDrum /> },
    { data: "12/9", nome: "Festival da Cachaça", icone: <FaWater /> },
    { data: "20/12", nome: "Réveillon na Praia", icone: <FaUmbrellaBeach /> },
  ];
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
      <AtracoesBela />

      <Gastronomy
        title="Gastronomia"
        subtitle="Comidas típicas da região"
        items={[
          {
            name: "Azul marinho",
            desc: "Um peixe típico refogado com banana nanica; o tanino na banana deixa o caldo com coloração azulada.",
            image: "/images/azulmarinho.jpg",
          },
          {
            name: "Peixe assado na folha de bananeira",
            desc: "Peixe temperado com limão, alho e coentro, embrulhado na folha de bananeira e grelhado para exaltar o sabor e a tradição caiçara.",
            image: "/images/peixe-bananeira.jpg",
          },
          {
            name: "Moquecas e risotos de frutos do mar",
            desc: "Moquecas, caldeiradas e risotos de peixe, lula, camarão e outros. Receitas preparadas com ervas regionais, leite, mandioca, azeite e dendê.",
            image: "/images/moqueca-frutos.jpg",
          },
          {
            name: "Caldeirada",
            desc: "Preparada com peixe, lula, mariscos, batata, pimentão e cheiro-verde, a caldeirada é um ícone forte na culinária local.",
            image: "/images/caldeirada.jpg",
          },
          {
            name: "Destaques com camarão",
            desc: "Camarão à provençal, alho e óleo, combinado ao arroz, risotos e massas são comuns nos menus locais.",
            image: "/images/camarao.jpg",
          },
        ]}
        buttonLabel="Ver Mais"
      />

      {/* Aqui entram os eventos */}
      <EventosTimeline eventos={eventos} cor="#ec7702ff" />

      <Footer />
    </div>
  );
}