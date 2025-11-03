"use client";

import React, { useEffect, useRef, useState } from "react";

// Dados das cidades
const cidades = [
  {
    nome: "Ubatuba",
    position: [-23.4335, -45.0834],
    descricao: "Acesso pela BR-101. Natureza exuberante e muitas praias.",
  },
  {
    nome: "Caraguatatuba",
    position: [-23.6209, -45.4126],
    descricao: "Bem localizada, ideal para explorar todo o Litoral Norte.",
  },
  {
    nome: "São Sebastião",
    position: [-23.78, -45.41],
    descricao: "Conecta ao continente e à balsa para Ilhabela.",
  },
  {
    nome: "Ilhabela",
    position: [-23.7786, -45.3581],
    descricao: "Ilha paradisíaca acessada por balsa a partir de São Sebastião.",
  },
];

export default function Map({ apiKey: propApiKey }) {
  const containerRef = useRef(null);
  const [sizePx, setSizePx] = useState({ w: 800, h: 450 });
  const [imgError, setImgError] = useState(false);

  // centralização e zoom — ajuste se quiser diferente
  const centerLat = -23.6;
  const centerLng = -45.3;
  const zoom = 10;

  // detecta o tamanho do container e recalcula no redimensionamento
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const w = Math.max(300, Math.floor(el.clientWidth));
      const h = 450;
      setSizePx({ w, h });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // fallback opcional para chave da API
  const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const winKey =
    typeof window !== "undefined" ? window.__GOOGLE_MAPS_API_KEY : undefined;
  const apiKey = propApiKey || envKey || winKey;

  // constrói a URL do Static Maps (parâmetro markers é opcional porque desenhamos marcadores manualmente)
  const MAX_DIM = 640;
  const requestedW = sizePx.w;
  const requestedH = Math.min(sizePx.h, MAX_DIM);
  const sizeW = Math.min(requestedW, MAX_DIM);
  const sizeH = Math.min(requestedH, MAX_DIM);
  const scale = requestedW > MAX_DIM ? 2 : 1;
  const base = "https://maps.googleapis.com/maps/api/staticmap";
  const urlParams = [
    `center=${centerLat},${centerLng}`,
    `zoom=${zoom}`,
    `size=${sizeW}x${sizeH}`,
    `scale=${scale}`,
    `maptype=roadmap`,
    // obs: não dependemos do parâmetro markers da API para manter controle visual dos marcadores
  ].join("&");
  const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : "";
  const staticMapUrl = `${base}?${urlParams}${keyParam}`;

  // URL de fallback para iframe
  const iframeCenter = `https://www.google.com/maps?q=${centerLat},${centerLng}&z=${zoom}&output=embed`;


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          height: 450,
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          background: "#eee",
          position: "relative",
        }}
      >
        {!imgError ? (
          // div de fundo garante que a imagem estática ocupe 1:1 a área do overlay
          <div
            role="img"
            aria-label="Google Static Map com marcadores"
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url("${staticMapUrl}")`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            ref={(el) => {
              if (!el) return;
              const img = new Image();
              img.src = staticMapUrl;
              img.onload = () => {
                if (imgError) setImgError(false);
              };
              img.onerror = () => {
                console.warn(
                  "Static Maps image failed, falling back to iframe."
                );
                setImgError(true);
              };
            }}
          />
        ) : (
          <iframe
            title="Google Maps (fallback)"
            src={iframeCenter}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
}
