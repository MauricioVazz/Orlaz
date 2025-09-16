"use client";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import SobreCidade from "@/components/SobreCidade"; 
import AtracoesCaraguatatuba from "@/components/Atracoes/Caraguatatuba";
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
        descricao="Caraguatatuba, conhecida como “Caraguá”, é uma cidade litorânea no estado de São Paulo..."
        curiosidades="Cidade com belas praias e muita história."
        populacao="~125 mil habitantes"
        area="485 km²"
        melhorEpoca="Dezembro a Março"
        mapaUrl="https://www.google.com/maps/embed?pb=..."
      />
      <AtracoesCaraguatatuba />
      
      {/* Aqui entram os eventos */}
      <EventosTimeline eventos={eventos} cor="#1853d1ff" />

      <Footer />
    </div>
  );
}
