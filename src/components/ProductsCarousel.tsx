import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  { name: "ADT", image: "" },
  { name: "OAP", image: "" },
  { name: "TORQFILTR™", image: "" },
  { name: "OAD™", image: "" },
  { name: "IDLER", image: "" },
  { name: "TBT", image: "" },
];

const ProductsCarousel = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container">
        <h2 className="text-primary text-2xl md:text-3xl font-bold text-center mb-8">
          CONHEÇA NOSSOS PRODUTOS
        </h2>

        <div className="relative">
          {/* Navigation arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors z-10 hidden md:flex">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors z-10 hidden md:flex">
            <ChevronRight size={24} />
          </button>

          {/* Products grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-muted rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 rounded-full" />
                </div>
                <span className="text-primary font-medium text-sm md:text-base text-center">
                  {product.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;
