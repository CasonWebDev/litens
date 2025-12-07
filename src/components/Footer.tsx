import backgroundCircle from "@/assets/background-circle.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Background circle decoration */}
      <div
        className="absolute -bottom-64 right-80 w-[600px] h-[600px] pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundCircle})`,
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      <div className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Form */}
          <div className="md:col-span-1">
            <div className="text-primary mb-4">
              <svg width="120" height="35" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="8" width="24" height="24" rx="4" fill="currentColor" />
                <text x="5" y="24" fill="white" fontSize="10" fontWeight="bold">Q</text>
                <text x="28" y="26" fill="currentColor" fontSize="20" fontWeight="bold" fontFamily="Roboto">Litens</text>
                <text x="28" y="36" fill="currentColor" fontSize="8" fontFamily="Roboto" letterSpacing="2">AFTERMARKET</text>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mb-4">CONECTE-SE CONOSCO</p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="NOME"
                className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
              <input
                type="email"
                placeholder="E-MAIL"
                className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors self-start">
                ENVIAR
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">SOBRE NÓS</a>
              </div>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">PRODUTOS</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-accent transition-colors">TORQFILTR™</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-accent transition-colors">OADS</a>
              </div>
              <div>
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">QUALIDADE OEM</a>
              </div>
              <div>
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">RECURSOS</a>
              </div>
              <div>
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">NOTÍCIAS</a>
              </div>
              <div>
                <a href="#" className="text-primary font-medium text-sm hover:text-accent transition-colors">PESQUISA POR PEÇA</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;