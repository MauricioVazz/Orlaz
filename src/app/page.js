import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Attractions from "@/components/Attractions";
import ContactUs from "@/components/ContactUs";
import Cards from "@/components/Cards";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Orlaz",
  description: "Site de turismo para explorar cidades e atrações",
};

export default function Home() {
  return (
    <>
      <Header />
      <Banner />

      <section>
        <Cards />
      </section>

      <section>
        <Attractions />
      </section>


      <section>
        <Location />
      </section>

      <section>
        <ContactUs />
      </section>

      <Footer />
    </>
  );
}
