import { Search, SlidersHorizontal, Info, Camera, Navigation, Barcode } from "lucide-react";

const features = [
  { icon: Search, text: "Busca rápida" },
  { icon: SlidersHorizontal, text: "Filtros personalizados" },
  { icon: Info, text: "Informações técnicas" },
  { icon: Camera, text: "Fotos de produtos" },
  { icon: Navigation, text: "Facilidade de navegação" },
  { icon: Barcode, text: "Busca por código de barras" },
];

const CatalogDownload = () => {
  return (
    <section className="bg-primary py-12">
      <div className="container">
        <h2 className="text-primary-foreground text-2xl md:text-3xl font-bold text-center mb-6">
          FAÇA O DOWNLOAD DO CATÁLOGO ELETRÔNICO
        </h2>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
              <feature.icon size={16} />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Download cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* iOS */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-primary-foreground/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-primary-foreground text-5xl">🍎</div>
            </div>
            <button className="bg-accent text-accent-foreground px-8 py-3 rounded font-bold hover:bg-accent/90 transition-colors">
              DOWNLOAD
            </button>
          </div>

          {/* Web */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-primary-foreground/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-primary-foreground text-5xl">💻</div>
            </div>
            <button className="bg-accent text-accent-foreground px-8 py-3 rounded font-bold hover:bg-accent/90 transition-colors">
              DOWNLOAD
            </button>
          </div>

          {/* Android */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-primary-foreground/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-primary-foreground text-5xl">🤖</div>
            </div>
            <button className="bg-accent text-accent-foreground px-8 py-3 rounded font-bold hover:bg-accent/90 transition-colors">
              DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogDownload;
