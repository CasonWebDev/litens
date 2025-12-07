const HeroBanner = () => {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-green opacity-80" 
           style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center py-8 lg:py-12">
          {/* Left side - OEM Badge and Products */}
          <div className="flex-1 flex items-center justify-center lg:justify-start gap-4">
            {/* OEM Badge */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-foreground flex items-center justify-center border-4 border-accent">
                <div className="text-center">
                  <span className="text-primary font-bold text-lg md:text-xl">OEM</span>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 -right-2 text-[8px] md:text-[10px] text-accent font-bold">
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  PRODUTO ORIGINAL LITENS
                </span>
              </div>
            </div>
            
            {/* Products image placeholder */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full"></div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                </div>
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                </div>
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Text */}
          <div className="flex-1 text-right mt-6 lg:mt-0">
            <h1 className="text-primary-foreground text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              A escolha das montadoras
              <br />
              agora no seu estoque!
            </h1>
            <p className="text-accent text-lg md:text-xl font-medium mt-2 italic">
              Original na reposição
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-2 bg-gradient-green" />
    </section>
  );
};

export default HeroBanner;
