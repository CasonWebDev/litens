import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "@/app/hooks/use-debounce";
import { toast } from "sonner";

interface Vehicle {
    id: number;
    product_code: string;
    vehicle_description: string;
    manufacturer: string;
    start_year: string;
    end_year: string;
}

const Vehicles = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['vehicles', page, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: debouncedSearch
            });
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/vehicles?${params}`);
            if (!res.ok) throw new Error("Failed to fetch vehicles");
            return res.json();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/vehicles/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => {
            toast.success("Veículo excluído com sucesso");
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
        onError: () => {
            toast.error("Erro ao excluir veículo");
        }
    });

    const handleDelete = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este veículo?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Veículos
                </h1>
                <Link to="/vehicles/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Veículo
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar veículo..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código Produto</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Fabricante</TableHead>
                                        <TableHead>Ano Início</TableHead>
                                        <TableHead>Ano Fim</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data.map((vehicle: Vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.product_code}</TableCell>
                                            <TableCell className="font-medium">{vehicle.vehicle_description}</TableCell>
                                            <TableCell>{vehicle.manufacturer}</TableCell>
                                            <TableCell>{vehicle.start_year}</TableCell>
                                            <TableCell>{vehicle.end_year}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Link to={`/vehicles/${vehicle.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!data?.data.length && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                Nenhum veículo encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Página {data?.meta?.page} de {data?.meta?.totalPages} ({data?.meta?.total} registros)
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= (data?.meta?.totalPages || 1)}
                            >
                                Próximo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Vehicles;
