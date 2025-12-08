import { Star, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import oapImage from "@/app/assets/products/oap.png";

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
              <thead className="mb-4">
                <tr className="bg-primary text-primary-foreground text-sm overflow-hidden">
                  <th width="10%" className="py-2 px-3 text-left font-bold rounded-tl-lg rounded-bl-lg">
                    <span className="flex items-center gap-1">
                      CÓDIGO <ChevronDown size={14} />
                    </span>
                  </th>
                  <th width="65%" className="py-2 px-3 text-left font-bold">DESCRIÇÃO</th>
                  <th width="8%" className="py-2 px-3 text-center font-bold">LANÇ.</th>
                  <th width="8%" className="py-2 px-3 text-center font-bold rounded-tr-lg rounded-br-lg">REL.</th>
                </tr>
              </thead>
            </table>
            <div className="h-128 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={index}
                      className={`border-b border-border text-sm ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
                    >
                      <td width="10%" className="py-2 px-3 border-r border-border">
                        <span className="flex items-center gap-2">
                          <Star
                            size={14}
                            className={product.starred ? "fill-primary text-primary" : "text-muted-foreground"}
                          />
                          {product.code}
                        </span>
                      </td>
                      <td width="65%" className="py-2 px-3 border-r border-border text-foreground">{product.description}</td>
                      <td width="8%" className="py-2 px-3 text-center border-r border-border">

                      </td>
                      <td width="8%" className="py-2 px-3 text-center">

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">56 PRODUTOS ENCONTRADOS</p>
        </div>

        {/* Technical Info Panel */}
        <div className="lg:w-72">
          <div className="bg-primary text-primary-foreground py-2 px-4 font-bold text-sm rounded-lg">
            INF. TÉCNICAS
          </div>
          <div className="h-128 overflow-y-auto">
            <div className="p-4 space-y-3 text-sm rounded-b-lg">
              <div className="border-b border-border pt-2 pb-4">
                <span className="text-primary font-bold">▶ Tampa:</span>
                <span className="text-foreground ml-1">920918</span>
              </div>
              <div className="border-b border-border pt-2 pb-4">
                <span className="text-muted-foreground font-bold">Diâmetro da tampa:</span>
                <span className="text-foreground ml-1">48mm</span>
              </div>
              <div className="border-b border-border pt-2 pb-4">
                <span className="text-muted-foreground font-bold">Número de filetes (F):</span>
                <span className="text-foreground ml-1">6</span>
              </div>
              <div className="border-b border-border pt-2 pb-4">
                <span className="text-muted-foreground font-bold">Diâmetro topo filete dob - 1.8 (TF):</span>
                <span className="text-foreground ml-1">58</span>
              </div>
              <div className="border-b border-border pt-2 pb-4">
                <span className="text-muted-foreground font-bold">Diâmetro rebaixo eixo instalação (EI):</span>
                <span className="text-foreground ml-1"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-3">
        {/* Product Title */}
        <div className="bg-litens-lightBlue text-litens-blue py-2 px-4 font-bold text-base rounded-lg mb-4">
          Produto: POLIA DO ALTERNADOR DESACOPLADORA OAD
        </div>

        <div className="flex flex-col lg:flex-row rounded-b-lg overflow-hidden rounded-lg">
          {/* Original/Conversion Section */}
          <div className="lg:w-56">
            <div className="bg-primary text-primary-foreground py-2 px-3 font-bold text-sm rounded-bl-lg">
              ORIGINAL / CONVERSÃO
            </div>
            <div className="h-48 overflow-y-auto">
              {originalConversionData.map((item, index) => (
                <div key={index} className="border-b border-border">
                  <div className={`py-2 px-3 text-sm text-accent font-bold`}>
                    {item.brand}
                  </div>
                  <div className="py-1 px-3 text-sm text-foreground pb-2 font-bold">
                    {item.code}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Data Table */}
          <div className="flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="py-2 px-3 text-left font-bold">MODELO</th>
                  <th className="py-2 px-3 text-left font-bold">COMBUSTÍVEL</th>
                  <th className="py-2 px-3 text-left font-bold">MOTOR</th>
                  <th className="py-2 px-3 text-left font-bold">NOME DO MOTOR</th>
                </tr>
              </thead>
            </table>
            <div className="h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {vehicleData.map((row, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-3">
                        {row.brand && <div className="text-accent font-bold">{row.brand}</div>}
                        <div className="text-foreground font-bold">{row.model}</div>
                      </td>
                      <td className="py-2 px-3 text-foreground font-bold">{row.fuel}</td>
                      <td className="py-2 px-3 text-foreground font-bold">{row.motor}</td>
                      <td className="py-2 px-3 text-foreground font-bold">{row.motorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Photo Section */}
          <div className="lg:w-48">
            <div className="bg-primary text-primary-foreground py-2 px-3 font-bold text-sm text-center rounded-br-lg">
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