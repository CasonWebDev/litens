import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { toast } from "sonner";

const RelationsManager = ({ id, relations, onUpdate }: { id: string, relations: any[], onUpdate: () => void }) => {
    const [newRelation, setNewRelation] = useState("");

    const addRelation = async () => {
        if (!newRelation) return;
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}/relations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relatedCode: newRelation })
            });
            if (!res.ok) throw new Error("Erro ao adicionar");
            toast.success("Relacionamento adicionado");
            setNewRelation("");
            onUpdate();
        } catch (e) {
            toast.error("Erro ao adicionar relacionamento");
        }
    };

    const removeRelation = async (code: string) => {
        if (!confirm("Remover este relacionamento?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}/relations/${code}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error("Erro ao remover");
            toast.success("Relacionamento removido");
            onUpdate();
        } catch (e) {
            toast.error("Erro ao remover relacionamento");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input placeholder="Código do produto relacionado" value={newRelation} onChange={e => setNewRelation(e.target.value)} />
                <Button type="button" onClick={addRelation}>Adicionar</Button>
            </div>
            <div className="border rounded-md divide-y">
                {relations.map((rel: any) => (
                    <div key={rel.id} className="p-3 flex justify-between items-center text-sm">
                        <span>{rel.related_product_code}</span>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeRelation(rel.related_product_code)}>Remover</Button>
                    </div>
                ))}
                {relations.length === 0 && <div className="p-4 text-center text-gray-400">Nenhum relacionamento</div>}
            </div>
        </div>
    );
};

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        foto_produto: null,
        foto_produto_2: null,
        foto_produto_3: null
    });

    const { data: product, isLoading: isLoadingProduct } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: isEdit
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList[0]) {
            setFiles(prev => ({ ...prev, [name]: fileList[0] }));
        }
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const url = isEdit ? `http://localhost:3000/api/products/${id}` : `http://localhost:3000/api/products`;
            const method = isEdit ? 'PUT' : 'POST';

            const formDataToSend = new FormData();

            // Append all text fields
            Object.keys(data).forEach(key => {
                // Skip file placeholders in data if any, though we store them in 'files' state
                if (data[key] !== null && data[key] !== undefined) {
                    formDataToSend.append(key, data[key]);
                }
            });

            // Append files
            if (files.foto_produto) formDataToSend.append('foto_produto', files.foto_produto);
            if (files.foto_produto_2) formDataToSend.append('foto_produto_2', files.foto_produto_2);
            if (files.foto_produto_3) formDataToSend.append('foto_produto_3', files.foto_produto_3);

            const res = await fetch(url, {
                method,
                body: formDataToSend // Content-Type header excluded so browser sets it with boundary
            });

            if (!res.ok) throw new Error("Failed to save product");
            return res.json();
        },
        onSuccess: () => {
            toast.success(isEdit ? "Produto atualizado!" : "Produto criado!");
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate("/products");
        },
        onError: () => {
            toast.error("Erro ao salvar produto");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const renderInput = (name: string, label: string, type: string = "text") => (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} value={formData[name] || ""} onChange={handleChange} type={type} />
        </div>
    );

    if (isEdit && isLoadingProduct) return <div>Carregando...</div>;



    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Editar Produto" : "Novo Produto"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="geral" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="geral">Geral</TabsTrigger>
                                <TabsTrigger value="lancamento">Lançamento</TabsTrigger>
                                <TabsTrigger value="tecnico">Técnico</TabsTrigger>
                                <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                                <TabsTrigger value="midia">Mídia</TabsTrigger>
                                <TabsTrigger value="relacionados">Relacionados</TabsTrigger>
                            </TabsList>

                            <TabsContent value="geral" className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {renderInput("codigo_produto", "Código Produto")}
                                    {renderInput("codigo_produto_similar", "Código Similar")}
                                    {renderInput("codigo_produto_grid", "Código Grid")}
                                    {renderInput("descricao_grupo_produto", "Grupo Produto")}
                                </div>
                                {renderInput("descricao_produto", "Descrição (PT)")}
                                {renderInput("descricao_produto_es", "Descrição (ES)")}
                                {renderInput("descricao_produto_en", "Descrição (EN)")}
                                {renderInput("observacao_produto", "Observação")}
                            </TabsContent>

                            <TabsContent value="lancamento" className="space-y-4 pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {renderInput("produto_lancamento", "Lançamento? (S/N)")}
                                    {renderInput("data_inicio_lancamento", "Início Lançamento")}
                                    {renderInput("validade_lancamento", "Validade Lançamento")}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {renderInput("produto_novas_aplicacoes", "Novas Aplicações? (S/N)")}
                                    {renderInput("data_inicio_novas_aplicacoes", "Início Novas App")}
                                    {renderInput("validade_novas_aplicacoes", "Validade Novas App")}
                                </div>
                            </TabsContent>

                            <TabsContent value="tecnico" className="space-y-4 pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {renderInput("tampa", "Tampa")}
                                    {renderInput("diametro_tampa", "Diâmetro Tampa")}
                                    {renderInput("numero_filetes", "Num. Filetes")}
                                    {renderInput("diametro_topo_filete", "Diam. Topo Filete")}
                                    {renderInput("diametro_rebaixo_eixo", "Diam. Rebaixo Eixo")}
                                    {renderInput("rosca", "Rosca")}
                                    {renderInput("comprimento", "Comprimento")}
                                    {renderInput("dimensao_comprimento", "Dimensão Comprimento")}
                                    {renderInput("dimensao_largura", "Dimensão Largura")}
                                    {renderInput("dimensao_altura", "Dimensão Altura")}
                                </div>
                            </TabsContent>

                            <TabsContent value="fiscal" className="space-y-4 pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {renderInput("ncm", "NCM")}
                                    {renderInput("ipi", "IPI")}
                                    {renderInput("codigo_barras", "Código de Barras")}
                                </div>
                            </TabsContent>

                            <TabsContent value="midia" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Foto Principal</Label>
                                        <Input type="file" name="foto_produto" onChange={handleFileChange} />
                                        {formData.foto_produto && <img src={`http://localhost:3000/uploads/${formData.foto_produto}`} alt="Preview" className="w-full h-32 object-contain border rounded mt-2" />}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Foto 2</Label>
                                        <Input type="file" name="foto_produto_2" onChange={handleFileChange} />
                                        {formData.foto_produto_2 && <img src={`http://localhost:3000/uploads/${formData.foto_produto_2}`} alt="Preview" className="w-full h-32 object-contain border rounded mt-2" />}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Foto 3</Label>
                                        <Input type="file" name="foto_produto_3" onChange={handleFileChange} />
                                        {formData.foto_produto_3 && <img src={`http://localhost:3000/uploads/${formData.foto_produto_3}`} alt="Preview" className="w-full h-32 object-contain border rounded mt-2" />}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="relacionados" className="space-y-4 pt-4">
                                {isEdit ? (
                                    <RelationsManager id={id!} relations={formData.relations || []} onUpdate={() => queryClient.invalidateQueries({ queryKey: ['product', id] })} />
                                ) : (
                                    <div className="text-gray-500 text-sm">Salve o produto antes de adicionar relacionamentos.</div>
                                )}
                            </TabsContent>

                        </Tabs>

                        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancelar</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Salvando..." : "Salvar Produto"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductForm;
