import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const [formData, setFormData] = useState<any>({});

    const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: isEdit
    });

    useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const url = isEdit ? `${import.meta.env.VITE_API_URL}/api/vehicles/${id}` : `${import.meta.env.VITE_API_URL}/api/vehicles`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to save vehicle");
            return res.json();
        },
        onSuccess: () => {
            toast.success(isEdit ? "Veículo atualizado!" : "Veículo criado!");
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            navigate("/vehicles");
        },
        onError: () => {
            toast.error("Erro ao salvar veículo");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const renderInput = (name: string, label: string) => (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} value={formData[name] || ""} onChange={handleChange} />
        </div>
    );

    if (isEdit && isLoadingVehicle) return <div>Carregando...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Editar Veículo" : "Novo Veículo"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("product_code", "Código Produto")}
                            {renderInput("vehicle_description", "Descrição Veículo")}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("manufacturer", "Fabricante")}
                            {renderInput("segment", "Segmento")}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {renderInput("fuel", "Combustível")}
                            {renderInput("displacement", "Cilindrada")}
                            {renderInput("engine", "Motor")}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {renderInput("engine_name", "Nome Motor")}
                            {renderInput("start_year", "Ano Inicial")}
                            {renderInput("end_year", "Ano Final")}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("alternator", "Alternador")}
                            {renderInput("alternator_code", "Cód. Alternador")}
                        </div>
                        {renderInput("complement", "Complemento")}
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("description_es", "Descrição (ES)")}
                            {renderInput("description_en", "Descrição (EN)")}
                        </div>

                        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => navigate("/vehicles")}>Cancelar</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Salvando..." : "Salvar Veículo"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VehicleForm;
