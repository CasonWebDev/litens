import backgroundCircle from "@/app/assets/background-circle.png";
import logo from "@/app/assets/logo.png";
import { useLanguage } from "@/app/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Background circle decoration */}
      <div
        className="absolute -bottom-64 right-[15vw] w-[600px] h-[600px] pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundCircle})`,
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      <div className="container py-12 relative z-10 font-bold">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Form */}
          <div className="md:col-span-1">
            <div className="text-primary mb-6">
              <img src={logo} width={120} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t('footer.connect')}</p>
            <div className="flex flex-col gap-3">
              <input
                id="footer-name"
                name="name"
                type="text"
                placeholder={t('footer.name')}
                className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder={t('footer.email')}
                className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors self-start">
                {t('footer.send')}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.about')}</a>
              </div>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.products')}</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-accent transition-colors">TORQFILTR™</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-accent transition-colors">OADS</a>
              </div>
              <div>
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.quality')}</a>
              </div>
              <div>
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.resources')}</a>
              </div>
              <div>
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.news')}</a>
              </div>
              <div>
                <a href="#" className="text-primary font-bold text-sm hover:text-accent transition-colors">{t('header.search')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;