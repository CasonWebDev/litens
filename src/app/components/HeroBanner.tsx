import bannerPeca from "@/app/assets/banner-hero-peca.png";
import bannerVeiculo from "@/app/assets/banner-hero-veiculo.png";

interface HeroBannerProps {
  activeTab: "codigo" | "veiculo";
}

const HeroBanner = ({ activeTab }: HeroBannerProps) => {
  const bannerImage = activeTab === "veiculo" ? bannerVeiculo : bannerPeca;

  return (
    <section className="relative w-full">
      <img
        src={bannerImage}
        alt="Litens OEM - A escolha das montadoras agora no seu estoque! Original na reposição"
        className="w-full h-auto object-cover"
      />
    </section>
  );
};

export default HeroBanner;
