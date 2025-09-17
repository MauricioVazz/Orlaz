"use client";

import RestauranteCard from "./Card";
import styles from "./Restaurantes.module.css";

const restaurantes = [
  {
    id: "mar-azul",
    cidade: "Caraguatatuba",
    nome: "Mar Azul – Frutos do Mar",
    descricao: "Especializado em peixes e camarões frescos direto da pesca local.",
    imagem: "/images/restaurantes/mar-azul.jpg",
  },
  {
    id: "sabores-caicaras",
    cidade: "Ubatuba",
    nome: "Sabores Caiçaras",
    descricao: "Pratos típicos com peixe na telha e banana-da-terra frita.",
    imagem: "/images/restaurantes/sabores-caicaras.jpg",
  },
  {
    id: "ilha-verde",
    cidade: "Ilhabela",
    nome: "Ilha Verde Bistrô",
    descricao: "Bistrô sofisticado que mistura culinária internacional com toques caiçaras.",
    imagem: "/images/restaurantes/ilha-verde.jpg",
  },
  {
    id: "pe-na-areia",
    cidade: "São Sebastião",
    nome: "Pé na Areia Bar & Grill",
    descricao: "Restaurante descontraído à beira-mar, famoso por churrascos e petiscos.",
    imagem: "/images/restaurantes/pe-na-areia.jpg",
  },
];

export default function RestaurantesLista() {
  return (
    <section className={styles.listaSection}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "12px" }}>
        Restaurantes Parceiros
      </h2>
      <p style={{ textAlign: "center", color: "#4b5563", marginBottom: "32px" }}>
        Conheça os estabelecimentos que oferecem experiências gastronômicas incríveis na nossa região.
      </p>

      <div className={styles.grid}>
        {restaurantes.map((r) => (
          <RestauranteCard key={r.id} restaurante={r} />
        ))}
      </div>
    </section>
  );
}
