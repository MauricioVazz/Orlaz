"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Lista.module.css";

export default function Lista() {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/restaurant")
      .then(res => res.json())
      .then(data => setRestaurantes(data.restaurants || []));
  }, []);

  return (
    <div className={styles.grid}>
      {restaurantes.map((r) => (
        <Link key={r.id} href={`/restaurantes/${r.id}`}>
          <div className={styles.card}>
            <img
              src={r.images && r.images.length > 0 ? r.images[0].url : "/images/sem-imagem.png"}
              alt={r.name}
            />
            <h3>{r.name}</h3>
            <p>{r.type || r.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}