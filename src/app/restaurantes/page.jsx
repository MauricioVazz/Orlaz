"use client";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import RestaurantesLista from "@/components/Restaurantes/Lista";

export default function RestaurantesPage() {
    const restaurantes = [
    { id: 1, nome: "Restaurante A", tipo: "Comida Brasileira", endereco: "Rua 1, Centro" },
    { id: 2, nome: "Restaurante B", tipo: "Italiana", endereco: "Av. Principal, 123" },
    { id: 3, nome: "Restaurante C", tipo: "Fast Food", endereco: "Praça Central, 45" },
  ];
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-restaurantes.png"
        title="Restaurantes Parceiros"
        subtitle="Conheça os estabelecimentos que oferecem experiências gastronômicas incríveis na nossa região."
      />
      <RestaurantesLista />
      <Footer />
    </div>
  );
}
