import Header from "@/app/components/Header";
import HeroBanner from "@/app/components/HeroBanner";
import SearchMenu from "@/app/components/SearchMenu";
import ProductsCarousel from "@/app/components/ProductsCarousel";
import CatalogDownload from "@/app/components/CatalogDownload";
import Footer from "@/app/components/Footer";

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
