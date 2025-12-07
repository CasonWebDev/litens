import { Star, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import oapImage from "@/assets/products/oap.png";

const SearchResults = () => {
  const products = [
    { code: "920019", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920020", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920021", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920024", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920025", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920026", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920027", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920030", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920034", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
    { code: "920037", description: "POLIA DO ALTERNADOR DESACOPLADORA OAD", starred: true },
  ];

  const originalConversionData = [
    { type: "original", brand: "GATES", code: "ALP2413" },
    { type: "conversion", brand: "IKRON", code: "IK7086" },
    { type: "original", brand: "KIA", code: "37322-2B010" },
    { type: "conversion", brand: "DAYCO", code: "ALP2413" },
    { type: "original", brand: "GATES", code: "OAP7086" },
  ];

  const vehicleData = [
    { brand: "HYUNDAI", model: "ELANTRA", fuel: "GASOLINA", motor: "1.8 L", motorName: "GAMMA" },
    { brand: "", model: "ELANTRA", fuel: "FLEX", motor: "2.0 L", motorName: "GAMMA" },
    { brand: "", model: "ELANTRA", fuel: "GASOLINA", motor: "2.0 L", motorName: "GAMMA" },
    { brand: "", model: "ELANTRA", fuel: "GASOLINA", motor: "1.6 L", motorName: "GAMMA" },
    { brand: "KIA", model: "CERATO", fuel: "FLEX", motor: "1.6 L", motorName: "GAMMA" },
  ];

  return (
    <div className="mt-6">
      {/* Results Table and Technical Info */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Products Table */}
        <div className="flex-1">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground text-sm rounded-t-lg overflow-hidden">
                  <th className="py-2 px-3 text-left font-medium rounded-tl-lg">
                    <span className="flex items-center gap-1">
                      CÓDIGO <ChevronDown size={14} />
                    </span>
                  </th>
                  <th className="py-2 px-3 text-left font-medium">DESCRIÇÃO</th>
                  <th className="py-2 px-3 text-center font-medium">LANÇ.</th>
                  <th className="py-2 px-3 text-center font-medium rounded-tr-lg">REL.</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-border text-sm ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
                  >
                    <td className="py-2 px-3">
                      <span className="flex items-center gap-2">
                        <Star 
                          size={14} 
                          className={product.starred ? "fill-primary text-primary" : "text-muted-foreground"} 
                        />
                        {product.code}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-foreground">{product.description}</td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" className="w-4 h-4 accent-primary" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" className="w-4 h-4 accent-primary" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">56 PRODUTOS ENCONTRADOS</p>
        </div>

        {/* Technical Info Panel */}
        <div className="lg:w-72">
          <div className="bg-primary text-primary-foreground py-2 px-4 font-medium text-sm rounded-t-lg">
            INF. TÉCNICAS
          </div>
          <div className="border border-border border-t-0 p-4 space-y-3 text-sm rounded-b-lg">
            <div>
              <span className="text-primary font-medium">▶ Tampa:</span>
              <span className="text-foreground ml-1">920918</span>
            </div>
            <div>
              <span className="text-muted-foreground">Diâmetro da tampa:</span>
              <span className="text-foreground ml-1">48mm</span>
            </div>
            <div>
              <span className="text-muted-foreground">Número de filetes (F):</span>
              <span className="text-foreground ml-1">6</span>
            </div>
            <div>
              <span className="text-muted-foreground">Diâmetro topo filete dob - 1.8 (TF):</span>
              <span className="text-foreground ml-1">58</span>
            </div>
            <div>
              <span className="text-muted-foreground">Diâmetro rebaixo eixo instalação (EI):</span>
              <span className="text-foreground ml-1"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-8">
        {/* Product Title */}
        <div className="bg-litens-lightBlue text-primary-foreground py-3 px-4 font-medium text-base rounded-t-lg">
          Produto: POLIA DO ALTERNADOR DESACOPLADORA OAD
        </div>
        
        <div className="flex flex-col lg:flex-row border border-litens-lightBlue border-t-0 rounded-b-lg overflow-hidden">
          {/* Original/Conversion Section */}
          <div className="lg:w-56 border-r border-border">
            <div className="bg-primary text-primary-foreground py-2 px-3 font-medium text-sm">
              ORIGINAL / CONVERSÃO
            </div>
            <div className="h-48 overflow-y-auto">
              {originalConversionData.map((item, index) => (
                <div key={index} className="border-b border-border">
                  <div className={`py-2 px-3 text-sm ${item.type === 'original' ? 'text-accent' : 'text-primary'} font-medium`}>
                    {item.brand}
                  </div>
                  <div className="py-1 px-3 text-sm text-foreground pb-2">
                    {item.code}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Data Table */}
          <div className="flex-1 border-r border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="py-2 px-3 text-left font-medium">MODELO</th>
                  <th className="py-2 px-3 text-left font-medium">COMBUSTÍVEL</th>
                  <th className="py-2 px-3 text-left font-medium">MOTOR</th>
                  <th className="py-2 px-3 text-left font-medium">NOME DO MOTOR</th>
                </tr>
              </thead>
            </table>
            <div className="h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {vehicleData.map((row, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-3">
                        {row.brand && <div className="text-accent font-medium">{row.brand}</div>}
                        <div className="text-foreground">{row.model}</div>
                      </td>
                      <td className="py-2 px-3 text-foreground">{row.fuel}</td>
                      <td className="py-2 px-3 text-foreground">{row.motor}</td>
                      <td className="py-2 px-3 text-foreground">{row.motorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Photo Section */}
          <div className="lg:w-48">
            <div className="bg-primary text-primary-foreground py-2 px-3 font-medium text-sm text-center">
              FOTO DO PRODUTO
            </div>
            <div className="h-48 flex flex-col items-center justify-center p-4">
              <img src={oapImage} alt="Produto OAD" className="w-28 h-28 object-contain" />
              <div className="flex gap-2 mt-3">
                <button className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs hover:bg-primary/90 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs hover:bg-primary/90 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;