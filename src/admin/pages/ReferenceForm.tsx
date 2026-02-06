import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";

const ReferenceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const [formData, setFormData] = useState<any>({});

    const { data: reference, isLoading } = useQuery({
        queryKey: ['reference', id],
        queryFn: async () => {
            const res = await fetch(`${(import.meta.env.VITE_API_URL || "")}/api/references/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: isEdit
    });

    useEffect(() => {
        if (reference) {
            setFormData(reference);
        }
    }, [reference]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const url = isEdit ? `${(import.meta.env.VITE_API_URL || "")}/api/references/${id}` : `${(import.meta.env.VITE_API_URL || "")}/api/references`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to save reference");
            return res.json();
        },
        onSuccess: () => {
            toast.success(isEdit ? "Referência atualizada!" : "Referência criada!");
            queryClient.invalidateQueries({ queryKey: ['references'] });
            navigate("/references");
        },
        onError: () => {
            toast.error("Erro ao salvar referência");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const renderInput = (name: string, label: string) => (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} value={formData[name] || ""} onChange={handleChange} required />
        </div>
    );

    if (isEdit && isLoading) return <div>Carregando...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Editar Referência" : "Nova Referência"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput("product_code", "Código Litens")}
                            {renderInput("manufacturer", "Fabricante")}
                            {renderInput("reference_number", "Número Referência (Fabricante)")}
                        </div>

                        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => navigate("/references")}>Cancelar</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Salvando..." : "Salvar Referência"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReferenceForm;
