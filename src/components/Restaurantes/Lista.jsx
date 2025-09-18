"use client";
import Link from "next/link";
import styles from "./Lista.module.css";

export default function Lista() {
  const restaurantes = [
    { id: "mar_azul", nome: "Restaurante Mar Azul", tipo: "Frutos do Mar" },
  ];

  return (
    <div className={styles.grid}>
      {restaurantes.map((r) => (
        <Link key={r.id} href={`/restaurantes/${r.id}`}>
          <div className={styles.card}>
            {/* carrega /public/images/mar_azul.png */}
            <img src={`/images/${r.id}.png`} alt={r.nome} />
            <h3>{r.nome}</h3>
            <p>{r.tipo}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
