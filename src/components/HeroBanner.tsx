import bannerHero from "@/assets/banner-hero.png";

const HeroBanner = () => {
  return (
    <section className="relative w-full">
      <img 
        src={bannerHero} 
        alt="Litens OEM - A escolha das montadoras agora no seu estoque! Original na reposição" 
        className="w-full h-auto object-cover"
      />
    </section>
  );
};

export default HeroBanner;
