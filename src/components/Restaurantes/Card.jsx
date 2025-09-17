"use client";

import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "./Restaurantes.module.css";

export default function RestauranteCard({ restaurante }) {
  return (
    <div className={styles.card}>
      <img src={restaurante.imagem} alt={restaurante.nome} className={styles.cardImg} />
      <div className={styles.cardBody}>
        <span className={styles.cidade}>
          <FaMapMarkerAlt style={{ marginRight: "6px" }} />
          {restaurante.cidade}
        </span>
        <h3 className={styles.nome}>{restaurante.nome}</h3>
        <p className={styles.descricao}>{restaurante.descricao}</p>
        <Link href={`/restaurantes/${restaurante.id}`} className={styles.botao}>
          Ver Mais
        </Link>
      </div>
    </div>
  );
}
