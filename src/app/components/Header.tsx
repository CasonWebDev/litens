import { Facebook, Instagram, Linkedin, Menu, X } from "lucide-react";
import logo from "@/app/assets/logo.png";
import { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

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
            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
              <SelectTrigger className="w-[130px] h-auto border-none bg-transparent text-primary hover:text-accent p-0 font-bold uppercase shadow-none focus:ring-0 gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">PORTUGUÊS</SelectItem>
                <SelectItem value="en">ENGLISH</SelectItem>
                <SelectItem value="es">ESPAÑOL</SelectItem>
              </SelectContent>
            </Select>
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
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.about')}</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.products')}</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.quality')}</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.resources')}</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.news')}</a>
            <a href="#" className="text-primary font-bold hover:text-accent transition-colors text-sm">{t('header.search')}</a>
            <a href="#" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:bg-primary/90 transition-colors">
              {t('header.contact')}
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
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.about')}</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.products')}</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.quality')}</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.resources')}</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.news')}</a>
              <a href="#" className="text-primary font-medium hover:text-accent transition-colors">{t('header.search')}</a>
              <a href="#" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors text-center">
                {t('header.contact')}
              </a>
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-bold mb-2 text-primary">Idioma / Language:</p>
                <div className="flex gap-2">
                  <button onClick={() => { setMobileMenuOpen(false); setLanguage('pt'); }} className={`px-2 py-1 rounded text-xs ${language === 'pt' ? 'bg-primary text-white' : 'bg-gray-100'}`}>PT</button>
                  <button onClick={() => { setMobileMenuOpen(false); setLanguage('en'); }} className={`px-2 py-1 rounded text-xs ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-100'}`}>EN</button>
                  <button onClick={() => { setMobileMenuOpen(false); setLanguage('es'); }} className={`px-2 py-1 rounded text-xs ${language === 'es' ? 'bg-primary text-white' : 'bg-gray-100'}`}>ES</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
