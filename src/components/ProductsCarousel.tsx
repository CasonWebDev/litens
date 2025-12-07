import { ChevronLeft, ChevronRight } from "lucide-react";

import adtImg from "@/assets/products/adt.png";
import oapImg from "@/assets/products/oap.png";
import torqfiltrImg from "@/assets/products/torqfiltr.png";
import oadImg from "@/assets/products/oad.png";
import idlerImg from "@/assets/products/idler.png";
import tbtImg from "@/assets/products/tbt.png";

const products = [
  { name: "ADT", image: adtImg },
  { name: "OAP", image: oapImg },
  { name: "TORQFILTR™", image: torqfiltrImg },
  { name: "OAD™", image: oadImg },
  { name: "IDLER", image: idlerImg },
  { name: "TBT", image: tbtImg },
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
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-8 h-8 md:w-10 md:h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors z-10">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-8 h-8 md:w-10 md:h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors z-10">
            <ChevronRight size={24} />
          </button>

          {/* Products grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 px-8 md:px-12">
            {products.map((product, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
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
