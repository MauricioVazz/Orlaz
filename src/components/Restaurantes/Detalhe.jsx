"use client";

import styles from "./Restaurantes.module.css";

export default function RestaurantesDetalhe({ restaurante }) {
  return (
    <section className={styles.detalheSection}>
      <h2 className={styles.titulo}>{restaurante.nome}</h2>

      <div className={styles.grid}>
        <div>
          <img
            src={restaurante.imagens[0]}
            alt={restaurante.nome}
            className={styles.detalheImg}
          />
          <div className={styles.galeria}>
            {restaurante.imagens.map((img, i) => (
              <img key={i} src={img} alt={`${restaurante.nome} ${i}`} />
            ))}
          </div>
        </div>
        <div>
          <span className={styles.tag}>{restaurante.cidade}</span>
          <p className={styles.descricaoLonga}>{restaurante.descricaoLonga}</p>
          <div className={styles.acoes}>
            <button className={styles.botaoVermelho}>Local</button>
            <button className={styles.botaoVerde}>Compartilhar</button>
            <button className={styles.botaoAmarelo}>Avaliar</button>
          </div>
        </div>
      </div>
    </section>
  );
}
