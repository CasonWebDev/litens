import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/app/components/ui/table";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface Product {
    id: number;
    codigo_produto: string;
    descricao_produto: string;
    descricao_grupo_produto: string;
    foto_produto?: string;
}

interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const Products = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['products', debouncedSearch, page],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${debouncedSearch}&page=${page}&limit=20`);
            if (!res.ok) throw new Error("Falha ao buscar produtos");
            return res.json() as Promise<ProductsResponse>;
        }
    });

    const products = response?.data;
    const meta = response?.meta;

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Falha ao excluir produto");
        },
        onSuccess: () => {
            toast.success("Produto excluído com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => {
            toast.error("Erro ao excluir produto");
        }
    });

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
                <Button onClick={() => window.location.href = '/admin/products/new'}>Novo Produto</Button>
            </div>

            <div className="flex items-center gap-2 mb-6 max-w-sm">
                <Search className="text-gray-400" size={20} />
                <Input
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg border shadow-sm mb-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Imagem</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Grupo</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-red-500">Erro ao carregar</TableCell>
                            </TableRow>
                        ) : products?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Nenhum produto encontrado</TableCell>
                            </TableRow>
                        ) : (
                            products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.foto_produto ? (
                                            <img src={`${import.meta.env.VITE_API_URL}/uploads/${product.foto_produto}`} alt="" className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Sem foto</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.codigo_produto}</TableCell>
                                    <TableCell>{product.descricao_produto}</TableCell>
                                    <TableCell>{product.descricao_grupo_produto}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/products/${product.id}/edit`}>Editar</Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id)}>Excluir</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        Página {meta.page} de {meta.totalPages} ({meta.total} registros)
                    </span>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page === meta.totalPages}
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
