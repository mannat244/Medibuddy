import Navbar from "@/components/Navbar";
import Search from "@/components/Search";
import Features from "@/components/Features";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Search />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
