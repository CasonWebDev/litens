import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus, Pencil, Trash2, Shield, User } from "lucide-react";
import { toast } from "sonner";

interface UserType {
    id: number;
    username: string;
    role: string;
}

const Users = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 403) throw new Error("Acesso negado");
            if (!res.ok) throw new Error("Falha ao carregar usuários");
            return res.json();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Falha ao excluir");
            }
        },
        onSuccess: () => {
            toast.success("Usuário excluído com sucesso");
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            deleteMutation.mutate(id);
        }
    };

    if (error) return <div className="p-8 text-center text-red-500">Acesso Negado: Você não tem permissão para ver esta página.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
                <Link to="/users/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Usuário
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuários do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Usuário</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users?.map((user: UserType) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                {user.username}
                                                {user.role === 'admin' && <Shield className="w-3 h-3 text-blue-500" />}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Link to={`/users/${user.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Users;
