import React from "react";
import Link from "next/link";
import styles from "./Cards.Module.css";

const pontosTuristicos = [
  {
    nome: "Caraguatatuba",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    nota: 4.0,
    imagem: "/images/caragua.jpg", 
  },
  {
    nome: "Ilhabela",
    descricao: "Arquipélago com cachoeiras, trilhas e praias de tirar o fôlego.",
    nota: 4.7,
    imagem: "/images/ilhabela.jpg", 
  },
  {
    nome: "Ubatuba",
    descricao: "A capital do surf com mais de 80 praias e mata Atlântica preservada.",
    nota: 3.5,
    imagem: "/images/ubatuba.png",
  },
  {
    nome: "SaoSebastiao",
    descricao: "Rica em história, cultura e praias deslumbrantes como Maresias.",
    nota: 4.0,
    imagem: "/images/SaoSeba.png", 
  },
];

export default function App() {
  return (
    <div className="container">
      <h1>Conheça Nossas Cidades</h1>
      <p className="subtitulo">Cada cidade do litoral norte tem sua própria personalidade e atrações únicas</p>
      <div className="cards">
        {pontosTuristicos.map((ponto, index) => (
          <div key={index} className="card">
            <img src={ponto.imagem} alt={ponto.nome} className="card-img" />
            <div className="card-info">
              <div className="card-header">
                <h3>{ponto.nome}</h3>
                <span className="nota">{ponto.nota}</span>
              </div>
              <p>{ponto.descricao}</p>
              <Link href={`/${ponto.nome.replace(/\s+/g, '')}`} className="btn-vermais">
                Ver Mais
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
