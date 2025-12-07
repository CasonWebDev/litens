import bannerDownload from "@/assets/banner-download.png";

const CatalogDownload = () => {
  return (
    <section className="relative w-full">
      <img 
        src={bannerDownload} 
        alt="Faça o download do catálogo eletrônico - iOS, Web e Android" 
        className="w-full h-auto object-cover"
        useMap="#download-map"
      />
    </section>
  );
};

export default CatalogDownload;
