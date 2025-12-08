import { Facebook, Instagram, Linkedin, Menu, X } from "lucide-react";
import logo from "@/app/assets/logo.png";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background">
      {/* Top bar */}
      <div className="border-b border-border font-bold">
        <div className="container flex items-center justify-end gap-4 py-2 text-sm">
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-primary hover:text-accent transition-colors">LITENS OE</a>
            <span className="text-border">|</span>
            <a href="#" className="text-primary hover:text-accent transition-colors">INDÚSTRIAS DOLZ</a>
            <span className="text-border">|</span>
            <a href="#" className="text-primary hover:text-accent transition-colors">PORTUGUÊS ▾</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-7 h-7 rounded-full border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <Facebook size={14} />
            </a>
            <a href="#" className="w-7 h-7 rounded-full border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <Instagram size={14} />
            </a>
            <a href="#" className="w-7 h-7 rounded-full border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-primary">
              <img src={logo} width={140} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">SOBRE NÓS</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">PRODUTOS</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">QUALIDADE OEM</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">RECURSOS</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">NOTÍCIAS</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">PESQUISA POR PEÇA</a>
            <a href="#" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:bg-primary/90 transition-colors">
              CONTATE-NOS
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">SOBRE NÓS</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">PRODUTOS</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">QUALIDADE OEM</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">RECURSOS</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">NOTÍCIAS</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">PESQUISA POR PEÇA</a>
              <a href="#" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors text-center">
                CONTATE-NOS
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
