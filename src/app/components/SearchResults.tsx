interface Reference {
  id: number;
  manufacturer: string;
  reference_number: string;
}

interface Vehicle {
  id: number;
  vehicle_description: string;
  fuel: string;
  engine: string;
  engine_name: string;
  manufacturer: string;
}

interface Product {
  id: number;
  codigo_produto_grid: string;
  descricao_produto: string;
  produto_lancamento: string;
  // Tech info fields
  tampa?: string;
  diametro_tampa?: string;
  numero_filetes?: string;
  diametro_topo_filete?: string;
  diametro_rebaixo_eixo?: string;
  rosca?: string;
  comprimento?: string;
  distancia_primeiro_filete?: string;
  altura_rebaixo_ate_rosca?: string;
  sentido_rotacao?: string;
  dimensao_comprimento?: string;
  dimensao_largura?: string;
  dimensao_altura?: string;
  dimensao_diametro?: string;
  ncm?: string;
  ipi?: string;
  codigo_barras?: string;
  foto_produto?: string;
  // Relations
  references?: Reference[];
  vehicles?: Vehicle[];
}

interface SearchResultsProps {
  products: Product[];
}

import { Star, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import oapImage from "@/app/assets/products/oap.png";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

const SearchResults = ({ products }: SearchResultsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Derive valid images from selected product
  const validImages = useMemo(() => {
    if (!selectedProduct) return [];
    const images = [
      selectedProduct.foto_produto,
      selectedProduct.foto_produto_2,
      selectedProduct.foto_produto_3
    ].filter(Boolean); // Filter out null/undefined/empty strings
    return images;
  }, [selectedProduct]);

  useEffect(() => {
    // Reset state when product changes
    setImageError(false);
    setCurrentImageIndex(0);
  }, [selectedProduct]);

  const handleNextImage = () => {
    if (validImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    setImageError(false);
  };

  const handlePrevImage = () => {
    if (validImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setImageError(false);
  };

  const fetchProductDetails = async (product: Product) => {
    // Optimistic update for UI responsiveness (shows partial data while loading)
    setSelectedProduct(product);
    // State reset is handled by useEffect now
    setLoadingDetails(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`);
      if (!res.ok) throw new Error("Erro ao buscar detalhes");
      const fullProduct = await res.json();
      setSelectedProduct(fullProduct);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar detalhes do produto");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Group vehicles by manufacturer
  const groupedVehicles = selectedProduct?.vehicles?.reduce((acc, vehicle) => {
    const brand = vehicle.manufacturer || 'OUTROS';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(vehicle);
    return acc;
  }, {} as Record<string, Vehicle[]>) || {};

  return (
    <div className="mt-6">
      {/* Results Table and Technical Info */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Products Table */}
        <div className={selectedProduct ? "flex-1" : "w-full"}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="mb-4">
                <tr className="bg-primary text-primary-foreground text-sm overflow-hidden">
                  <th style={{ width: "10%" }} className="py-2 px-3 text-left font-bold rounded-tl-lg rounded-bl-lg">
                    <span className="flex items-center gap-1">
                      CÓDIGO <ChevronDown size={14} />
                    </span>
                  </th>
                  <th style={{ width: "65%" }} className="py-2 px-3 text-left font-bold">DESCRIÇÃO</th>
                  <th style={{ width: "8%" }} className="py-2 px-3 text-center font-bold">LANÇ.</th>
                  <th style={{ width: "8%" }} className="py-2 px-3 text-center font-bold rounded-tr-lg rounded-br-lg">REL.</th>
                </tr>
              </thead>
            </table>
            <div className="h-[400px] overflow-y-auto custom-scrollbar mt-3">
              <table className="w-full">
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      onClick={() => fetchProductDetails(product)}
                      className={`border-b border-border text-sm cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                        } ${selectedProduct?.id === product.id ? 'bg-blue-100 dark:bg-blue-900/20 ring-1 ring-inset ring-primary' : 'hover:bg-muted'}`}
                    >
                      <td style={{ width: "10%" }} className="py-2 px-3 border-r border-border">
                        <span className="flex items-center gap-2">
                          <Star
                            size={14}
                            className={"text-muted-foreground"}
                          />
                          {product.codigo_produto_grid}
                        </span>
                      </td>
                      <td style={{ width: "65%" }} className="py-2 px-3 border-r border-border text-foreground">{product.descricao_produto}</td>
                      <td style={{ width: "8%" }} className="py-2 px-3 text-center border-r border-border">
                        {product.produto_lancamento === 'S' && <Check size={16} className="mx-auto text-green-500" />}
                      </td>
                      <td style={{ width: "8%" }} className="py-2 px-3 text-center">

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">{products.length} PRODUTOS ENCONTRADOS</p>
        </div>

        {/* Technical Info Panel - Only visible if product selected */}
        {selectedProduct && (
          <div className="lg:w-72 animate-in slide-in-from-right duration-300">
            <div className="bg-primary text-primary-foreground py-2 px-4 font-bold text-sm rounded-lg">
              INF. TÉCNICAS
            </div>
            <div className="h-[400px] overflow-y-auto custom-scrollbar mt-3">
              <div className="p-4 space-y-3 text-sm rounded-b-lg bg-background mt-1">
                {/* Tech fields... (kept mostly same, rendering selectedProduct) */}
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-primary font-bold">▶ Tampa:</span>
                  <span className="text-foreground ml-1">{selectedProduct.tampa || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Diâmetro da tampa:</span>
                  <span className="text-foreground ml-1">{selectedProduct.diametro_tampa || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Número de filetes (F):</span>
                  <span className="text-foreground ml-1">{selectedProduct.numero_filetes || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Diâmetro topo filete (TF):</span>
                  <span className="text-foreground ml-1">{selectedProduct.diametro_topo_filete || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Diâmetro rebaixo eixo (EI):</span>
                  <span className="text-foreground ml-1">{selectedProduct.diametro_rebaixo_eixo || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Rosca:</span>
                  <span className="text-foreground ml-1">{selectedProduct.rosca || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Comprimento (cm):</span>
                  <span className="text-foreground ml-1">{selectedProduct.comprimento || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Distância primeiro filete:</span>
                  <span className="text-foreground ml-1">{selectedProduct.distancia_primeiro_filete || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Altura rebaixo até rosca:</span>
                  <span className="text-foreground ml-1">{selectedProduct.altura_rebaixo_ate_rosca || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Sentido rotação:</span>
                  <span className="text-foreground ml-1">{selectedProduct.sentido_rotacao || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Dimensão comprimento:</span>
                  <span className="text-foreground ml-1">{selectedProduct.dimensao_comprimento || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Dimensão largura:</span>
                  <span className="text-foreground ml-1">{selectedProduct.dimensao_largura || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Dimensão altura:</span>
                  <span className="text-foreground ml-1">{selectedProduct.dimensao_altura || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Dimensão diâmetro:</span>
                  <span className="text-foreground ml-1">{selectedProduct.dimensao_diametro || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">NCM:</span>
                  <span className="text-foreground ml-1">{selectedProduct.ncm || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">IPI:</span>
                  <span className="text-foreground ml-1">{selectedProduct.ipi || '-'}</span>
                </div>
                <div className="border-b border-border pt-2 pb-4">
                  <span className="text-muted-foreground font-bold">Código de barras:</span>
                  <span className="text-foreground ml-1">{selectedProduct.codigo_barras || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Section - Only visible if product selected */}
      {selectedProduct && (
        <div className="mt-3 animate-in fade-in zoom-in-95 duration-300">
          {/* Product Title */}
          <div className="bg-litens-lightBlue text-litens-blue py-2 px-4 font-bold text-base rounded-lg mb-4">
            Produto: {selectedProduct.descricao_produto}
          </div>

          <div className="flex flex-col lg:flex-row rounded-b-lg overflow-hidden rounded-lg gap-4 lg:gap-0">
            {/* Original/Conversion Section */}
            <div className="lg:w-56 border border-border lg:border-r-0 rounded-lg lg:rounded-none lg:rounded-bl-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground py-2 px-3 font-bold text-sm">
                ORIGINAL / CONVERSÃO
              </div>
              <div className="h-48 overflow-y-auto bg-background custom-scrollbar">
                {loadingDetails && !selectedProduct.references ? (
                  <div className="p-4 text-xs text-muted-foreground">Carregando...</div>
                ) : selectedProduct.references && selectedProduct.references.length > 0 ? (
                  selectedProduct.references.map((item, index) => (
                    <div key={index} className="border-b border-border last:border-0">
                      <div className={`py-2 px-3 text-sm text-accent font-bold`}>
                        {item.manufacturer}
                      </div>
                      <div className="py-1 px-3 text-sm text-foreground pb-2 font-bold">
                        {item.reference_number}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-muted-foreground">Nenhuma referência encontrada.</div>
                )}
              </div>
            </div>

            {/* Vehicle Data Table */}
            <div className="flex-1 border border-border rounded-lg lg:rounded-none overflow-hidden">
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
              <div className="h-48 overflow-y-auto bg-background custom-scrollbar">
                <table className="w-full text-sm">
                  <tbody>
                    {loadingDetails && !selectedProduct.vehicles ? (
                      <tr><td colSpan={4} className="p-4 text-center text-xs text-muted-foreground">Carregando...</td></tr>
                    ) : Object.keys(groupedVehicles).length > 0 ? (
                      Object.entries(groupedVehicles).map(([brand, vehicles]) => (
                        <>
                          {/* Brand Header */}
                          <tr>
                            <td colSpan={4} className="py-1 px-3 text-accent font-bold uppercase ">
                              {brand}
                            </td>
                          </tr>
                          {/* Vehicle Rows */}
                          {vehicles.map((row, index) => (
                            <tr key={`${brand}-${index}`} className="border-b border-border last:border-0 hover:bg-muted/10">
                              <td className="py-2 px-3">
                                <div className="text-foreground font-bold">{row.vehicle_description}</div>
                              </td>
                              <td className="py-2 px-3 text-foreground font-bold">{row.fuel}</td>
                              <td className="py-2 px-3 text-foreground font-bold">{row.engine}</td>
                              <td className="py-2 px-3 text-foreground font-bold">{row.engine_name}</td>
                            </tr>
                          ))}
                        </>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="p-4 text-center text-xs text-muted-foreground">Nenhuma aplicação veicular encontrada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Photo Section */}
            <div className="lg:w-48 border border-border lg:border-l-0 rounded-lg lg:rounded-none lg:rounded-br-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground py-2 px-3 font-bold text-sm text-center">
                FOTO DO PRODUTO
              </div>
              <div className="h-48 flex flex-col items-center justify-center p-4 bg-background relative group">
                {validImages.length > 0 && !imageError ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${validImages[currentImageIndex]}`}
                    alt={selectedProduct.descricao_produto}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-muted-foreground text-xs border rounded bg-gray-50 text-center p-2">
                    {imageError ? "Imagem indisponível" : "Sem foto"}
                  </div>
                )}

                {/* Carousel Controls */}
                {validImages.length > 1 && (
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={handlePrevImage}
                      className="w-8 h-8 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors"
                      title="Foto anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="text-xs text-muted-foreground flex items-center">
                      {currentImageIndex + 1} / {validImages.length}
                    </div>
                    <button
                      onClick={handleNextImage}
                      className="w-8 h-8 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors"
                      title="Próxima foto"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;