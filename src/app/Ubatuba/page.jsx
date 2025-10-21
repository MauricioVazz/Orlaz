"use client";

import SobreCidade from "@/components/SobreCidade";
import styles from "./Ubatuba.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import AtracoesUbatuba from "@/components/Atracoes/Ubatuba";
import EventosTimeline from "@/components/EventosTimeline";
import { FaSwimmer, FaTree, FaDrum, FaFire } from "react-icons/fa";

import Gastronomy from "@/components/Gastronomy";

export default function Ubatuba() {
  const eventos = [
    { data: "12/1", nome: "Festival de Verão", icone: <FaSwimmer /> },
    { data: "10/3", nome: "Festa da Mata Atlântica", icone: <FaTree /> },
    { data: "21/6", nome: "Festival de Dança", icone: <FaDrum /> },
    { data: "31/12", nome: "Réveillon Ubatuba", icone: <FaFire /> },
  ];

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
      <AtracoesUbatuba />
      <Gastronomy
        title="Gastronomia"
        subtitle="Comidas típicas da região"
        fetchUrl={buildUrl('/gastronomy/category/UBATUBA')}
        buttonLabel="Ver Mais"
      />
      <AtracoesUbatuba/>

      {/* Aqui entram os eventos */}
      <EventosTimeline eventos={eventos} cor="#107a1eff" />

      <Footer />
    </div>
  );
}