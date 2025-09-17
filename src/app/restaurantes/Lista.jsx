"use client";
import Link from "next/link";
import styles from "./Lista.module.css";

export default function Lista({ restaurantes }) {
  return (
    <div>
      {restaurantes.map((r) => (
        <Link key={r.id} href={`/restaurantes/${r.id}`}>
          <div className={styles.card}>
            <h3>{r.nome}</h3>
            <p>{r.tipo}</p>
            <p>{r.endereco}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
