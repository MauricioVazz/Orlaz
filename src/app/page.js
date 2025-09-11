import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Attractions from "@/components/Attractions";
import Cards from "@/components/Cards";
import LocationClient from "@/components/ClientComponents/LocationClient";

export default function Home() {
  return (
    <main>
      <Header />
      <Banner />
      <section><Cards /></section>
      <section><Attractions /></section>
      <section><LocationClient /></section>
    </main>
  );
}
