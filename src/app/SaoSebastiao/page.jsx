"use client";

import SobreCidade from "@/components/SobreCidade";
import styles from "./SaoSebastiao.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import AtracoesSaoSebastiao from "@/components/Atracoes/SaoSebastiao";
import { FaFish, FaGuitar, FaShip, FaWineBottle } from "react-icons/fa6";
import EventosTimeline from "@/components/EventosTimeline";
import Gastronomy from "@/components/Gastronomy";
import buildUrl from "../../lib/api";

export default function SaoSebastiao() {
  const eventos = [
    { data: "15/4", nome: "Festival do Pescado", icone: <FaFish /> },
    { data: "22/6", nome: "Festival de Música Caiçara", icone: <FaGuitar /> },
    { data: "7/9", nome: "Regata São Sebastião", icone: <FaShip /> },
    { data: "1/11", nome: "Festival de Vinhos", icone: <FaWineBottle /> },
  ];
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-sao-sebastiao.png"
        title="São Sebastião"
        subtitle="Belezas naturais e um centro histórico charmoso."
      />
      <SobreCidade
        nome="São Sebastião"
        descricao="São Sebastião é um município do litoral paulista, famoso por suas praias badaladas como Maresias e Juquehy."
        curiosidades="Centro histórico preservado com casarões coloniais."
        populacao="~91 mil habitantes"
        area="403 km²"
        melhorEpoca="Novembro a Março"
        mapaUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46910.43138015279!2d-45.427!3d-23.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cd63f98b0e1d6b%3A0x9c64cf8e1d6a6df2!2sSão%20Sebastião%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1694461012345!5m2!1spt-BR!2sbr"
      />
      <AtracoesSaoSebastiao />
      <Gastronomy
        title="Gastronomia"
        subtitle="Comidas típicas da região"
        fetchUrl={buildUrl('/gastronomy/category/SAO_SEBASTIAO')}
        buttonLabel="Ver Mais"
      />
      {/* Aqui entram os eventos */}
      <EventosTimeline eventos={eventos} cor="#0b8c91ff" />
      <Footer />
    </div>
  );
}
