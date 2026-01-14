import Header from "@/app/components/Header";
import { useState } from "react";
import HeroBanner from "@/app/components/HeroBanner";
import SearchMenu from "@/app/components/SearchMenu";
import ProductsCarousel from "@/app/components/ProductsCarousel";
import CatalogDownload from "@/app/components/CatalogDownload";
import Footer from "@/app/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"codigo" | "veiculo">("codigo");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner activeTab={activeTab} />
        <SearchMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <ProductsCarousel />
        <CatalogDownload />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
