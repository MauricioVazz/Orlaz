import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Attractions from "@/components/Attractions";
import ContactUs from "@/components/ContactUs";
import Cards from "@/components/Cards";
import LocationClient from "@/components/ClientComponents/LocationClient";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import CadastroForm from "@/components/CadastroForm";
import RestaurantesLista from "@/components/Restaurantes/Lista"; // lista de restaurantes


export const metadata = {
  title: "Orlaz",
  description: "Site de turismo para explorar cidades e atrações",
};

export default function Home() {
  return (
    <>
      <Header />
      <Banner
        image="/images/banner-home.png"
        title="Explore as Belezas do Litoral Norte"
        subtitle="Descubra praias paradisíacas, gastronomia incrível e muito mais nas cidades mais encantadoras do litoral paulista"
      />

      <section>
        <Cards />
      </section>

      <section>
        <Attractions />
      </section>

      <section>
        <LocationClient />
      </section>

      <section>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "12px" }}>
        Restaurantes Parceiros
      </h2>
      <p style={{ textAlign: "center", color: "#4b5563", marginBottom: "32px" }}>
        Conheça os estabelecimentos que oferecem experiências gastronômicas incríveis na nossa região.
      </p>

        <RestaurantesLista />
      </section>

      <section>
        <ContactUs />
      </section>

      <Footer />
    </>
  );
}
