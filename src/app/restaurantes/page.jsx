"use client";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Lista from "@/components/Restaurantes/Lista";


export default function RestaurantesPage() {
  return (
    <div>
      <Header />
      <Banner
        image="/images/banner-restaurantes.png"
        title="Restaurantes Parceiros"
        subtitle="Conheça os estabelecimentos que oferecem experiências gastronômicas incríveis na nossa região."
      />
      <Lista />
      <Footer />
    </div>
  );
}
