import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from "sonner";

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const token = localStorage.getItem("token");
    const currentUserRole = localStorage.getItem("role");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Falha ao carregar usuário");
            return res.json();
        },
        enabled: isEdit
    });

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setRole(user.role);
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const url = isEdit ? `${(import.meta.env.VITE_API_URL || "")}/api/users/${id}` : `${(import.meta.env.VITE_API_URL || "")}/api/users`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Falha ao salvar");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success(isEdit ? "Usuário atualizado!" : "Usuário criado!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate("/users");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = {};

        // Only send fields if they have value or it's a new user
        if (username) data.username = username; // Username usually immutable on edit but kept for new
        if (password) data.password = password;
        if (role) data.role = role;

        // Clean up data for update (don't send username on update if readonly logic applied, 
        // but backend ignores it effectively for basic update impl unless changed there)

        mutation.mutate(data);
    };

    if (isEdit && isLoading) return <div>Carregando...</div>;
    if (error) return <div className="text-red-500">Erro: {error.message}</div>;

    const isAdmin = currentUserRole === 'admin';

    return (
        <div className="p-6 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Editar Usuário" : "Novo Usuário"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuário</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isEdit} // Prevent changing username on edit
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha {isEdit && "(Deixe em branco para manter)"}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isEdit}
                            />
                        </div>

                        {isAdmin && (
                            <div className="space-y-2">
                                <Label htmlFor="role">Função</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Usuário</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => navigate("/users")}>Cancelar</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserForm;
