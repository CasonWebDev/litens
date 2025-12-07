import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import SearchMenu from "@/components/SearchMenu";
import ProductsCarousel from "@/components/ProductsCarousel";
import CatalogDownload from "@/components/CatalogDownload";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <SearchMenu />
        <ProductsCarousel />
        <CatalogDownload />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
