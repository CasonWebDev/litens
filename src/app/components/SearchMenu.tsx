import { Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import bgLinhas from "@/app/assets/bglinhas.png";
import backgroundCircle from "@/app/assets/background-circle.png";
import { toast } from "sonner";
import SearchResults from "./SearchResults";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ProductResult {
  id: number;
  codigo_produto_grid: string;
  descricao_produto: string;
  produto_lancamento: string;
}

interface SearchMenuProps {
  activeTab: "codigo" | "veiculo";
  onTabChange: (tab: "codigo" | "veiculo") => void;
}

const SearchMenu = ({ activeTab, onTabChange }: SearchMenuProps) => {
  // const [activeTab, setActiveTab] = useState<"codigo" | "veiculo">("codigo"); // Removed local state
  const [searchValue, setSearchValue] = useState("");
  const [isFuzzy, setIsFuzzy] = useState(false);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const exact = !isFuzzy;
      const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/products?search=${encodeURIComponent(searchValue)}&exact=${exact}&limit=100`);
      if (!res.ok) throw new Error("Erro na busca");
      const data = await res.json();
      setResults(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar produtos");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <section className="bg-secondary py-8 md:py-12"
      style={{
        backgroundImage: `url(${bgLinhas})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '-20% -50%',
      }}
    >
      <div className="container relative z-[2]">
        <div className="bg-background rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-primary py-4 px-6">
            <h2 className="text-primary-foreground text-xl md:text-2xl font-bold text-center">
              {t('search.title').toUpperCase()}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-8 py-4 border-b border-border">
            <button
              onClick={() => onTabChange("codigo")}
              className={`text-sm md:text-base font-bold transition-colors ${activeTab === "codigo"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              {t('search.tab_code')}
            </button>
            <button
              onClick={() => onTabChange("veiculo")}
              className={`text-sm md:text-base font-bold transition-colors ${activeTab === "veiculo"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              {t('search.tab_vehicle')}
            </button>
          </div>

          {/* Search Content */}
          <div className="p-6">
            {activeTab === "codigo" ? (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    id="search-code"
                    name="searchCode"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={t('search.placeholder').toUpperCase()}
                    className="w-full pl-12 pr-4 py-3 font-bold border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground font-bold cursor-pointer">
                  <input
                    id="search-fuzzy"
                    name="searchFuzzy"
                    type="checkbox"
                    checked={isFuzzy}
                    onChange={(e) => setIsFuzzy(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  {t('search.fuzzy')}
                </label>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    id="search-vehicle"
                    name="searchVehicle"
                    type="text"
                    placeholder={t('search.placeholder_vehicle')}
                    className="w-full pl-12 pr-4 py-3 font-bold border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-bold">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">{t('search.filter_segment')}</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>{t('search.select_option')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">{t('search.filter_brand')}</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>{t('search.select_option')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">{t('search.filter_name')}</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>{t('search.select_option')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">{t('search.filter_year')}</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>{t('search.select_option')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">{t('search.filter_model')}</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>{t('search.select_option')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 px-6 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Trash2 size={18} />
                {t('search.clear')}
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Search size={18} />
                {loading ? t('search.loading').toUpperCase() : t('search.button').toUpperCase()}
              </button>
            </div>

            {/* Search Results */}
            {hasSearched && activeTab === "codigo" && (
              <SearchResults products={results} />
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute -bottom-[15vh] -right-0 w-[600px] h-[600px] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url(${backgroundCircle})`,
          backgroundSize: '300px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '110% center',
        }}
      />
    </section>
  );
};

export default SearchMenu;
