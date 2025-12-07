import { Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import SearchResults from "./SearchResults";
import bgLinhas from "@/assets/bglinhas.png";
import backgroundCircle from "@/assets/background-circle.png";

const SearchMenu = () => {
  const [activeTab, setActiveTab] = useState<"codigo" | "veiculo">("codigo");
  const [searchValue, setSearchValue] = useState("920");
  const [showResults, setShowResults] = useState(true);

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
              MENU DE BUSCA
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-8 py-4 border-b border-border">
            <button
              onClick={() => setActiveTab("codigo")}
              className={`text-sm md:text-base font-bold transition-colors ${activeTab === "codigo"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              CÓDIGO DA PEÇA
            </button>
            <button
              onClick={() => setActiveTab("veiculo")}
              className={`text-sm md:text-base font-bold transition-colors ${activeTab === "veiculo"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              VEÍCULO
            </button>
          </div>

          {/* Search Content */}
          <div className="p-6">
            {activeTab === "codigo" ? (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="BUSCA POR CÓDIGO DA PEÇA"
                    className="w-full pl-12 pr-4 py-3 font-bold border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                  <X size={14} className="border border-muted-foreground" />
                  BUSCA POR QUALQUER PARTE DO CÓDIGO DA PEÇA
                </label>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="BUSCA POR VEÍCULO"
                    className="w-full pl-12 pr-4 py-3 font-bold border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-bold">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">Segmento</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Selecionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">Marca</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Selecionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">Nome Veículo</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Selecionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">Ano Venda</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Selecionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase">Modelo Veículo</label>
                    <select className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Selecionar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => { setSearchValue(""); setShowResults(false); }}
                className="flex items-center gap-2 px-6 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Trash2 size={18} />
                LIMPAR
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90 transition-colors"
              >
                <Search size={18} />
                BUSCAR
              </button>
            </div>

            {/* Search Results */}
            {showResults && activeTab === "codigo" && <SearchResults />}
          </div>
        </div>
      </div>
      <div
        className="absolute -bottom-72 -right-0 w-[600px] h-[600px] pointer-events-none z-[1]"
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
