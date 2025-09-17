"use client";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import SobreCidade from "@/components/SobreCidade"; 
import AtracoesCaraguatatuba from "@/components/Atracoes/Caraguatatuba";
import Gastronomy from "@/components/Gastronomy";
import styles from "./Caraguatatuba.module.css";
import Link from "next/link";
import { FaUtensils, FaFutbol, FaMusic, FaCar } from "react-icons/fa";
import EventosTimeline from "@/components/EventosTimeline";

export default function CaraguatatubaPage() {
  const eventos = [
    { data: "1/8 a 7/9", nome: "20º Caraguá a Gosto", icone: <FaUtensils /> },
    { data: "14/8 a 16/8", nome: "7º AVIVA Caraguá", icone: <FaFutbol /> },
    { data: "23/8", nome: "7º Caraguá Extreme Fest Rock", icone: <FaMusic /> },
    { data: "6/9 a 7/9", nome: "7º Caraguá Beach Car", icone: <FaCar /> },
  ];
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-caragua.png"
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
      <AtracoesCaraguatatuba />
      <Gastronomy
        title="Gastronomia"
        subtitle="Comidas típicas da região"
        items={[
          {
            name: "Azul marinho",
            desc: "Um peixe refogado com banana nanica, cujo tanino na banana deixa o caldo com coloração azulada.",
            image: "/images/azulmarinho.jpg"
          },
          {
            name: "Lambe-lambe",
            desc: "Arroz preparado com mexilhões, tradição local ligada à maricultura.",
            image: "/images/lambelambe.jpg"
          },
          {
            name: "Bolinho de taioba",
            desc: "Salgado feito com a folha da taioba, refletindo a tradição de colheita na mata local.",
            image: "/images/taioba.jpg"
          },
          {
            name: "Mexilhões",
            desc: "Consumidos ao vinagrete, no bafo; também usados em versões de bolinho caipira.",
            image: "/images/mexilhoes.jpg"
          },
          {
            name: "Frutos do mar no geral",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          },
          {
            name: "Frutos do mar no geral5",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          },
          {
            name: "Frutos do mar no geral4",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          },
          {
            name: "Frutos do mar no geral3",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          },
          {
            name: "Frutos do mar no geral2",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          },
          {
            name: "Frutos do mar no geral1",
            desc: "Camarão, casquinha de siri e mariscos são muito presentes na culinária regional.",
            image: "/images/frutosdomar.jpg"
          }
        ]}
        buttonLabel="Ver Mais"
      />
      <EventosTimeline eventos={eventos} cor="#1853d1ff" />
      <Footer />
    </div>
  );
}
