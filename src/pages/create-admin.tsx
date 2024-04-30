
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstitucionSchema, institucionSchema } from "@/data/models";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

const adminFormSchema = z.object({
  username: z.string(),
  password: z.string(),
  institucion: z.string(),
})

type AdminFormValues = z.infer<typeof adminFormSchema>;

const CreateAdminPage = () => {
  const navigate = useNavigate();

  const [bancos, setBancos] = useState<InstitucionSchema[] | null>(null);
  const [banco, setBanco] = useState<InstitucionSchema | null>(null);

  const adminForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: '',
      password: '',
      institucion: '1',
    }
  });

  useEffect(() => {

    api.get("/instituciones/").then(res => setBancos(res.data))

  }, [])

  const handleCreateAdmin = (values: AdminFormValues) => {
    console.log(values);
    api.post("/admins/", {
      "username": values.username,
      "password": values.password,
      "institucion_id": banco!.id,
    }).then(res => console.log(res))
  }

  const handleBancoChange = (bancoId: any) => {
    if (bancos) {
      const find = bancos.find(b => b.id == bancoId);
      setBanco(prev => find ? find : prev)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-md">
        <h2 className="">Crear Administrador</h2>

        <div className="space-y-2 w-full">
          <label className="mb-4 text-sm font-medium">Banco</label>
          <Select onValueChange={handleBancoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un banco" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bancos</SelectLabel>
                {bancos && bancos.map(banco => <SelectItem key={banco.id} value={banco.id} onClick={() => handleBancoChange(banco)}>{banco.nombre}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Form {...adminForm}>
          <form onSubmit={adminForm.handleSubmit(handleCreateAdmin)}>
            <FormField
              control={adminForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={adminForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4"
            >
              Crear Administrador
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
}

export { CreateAdminPage };
