import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditoForm } from "@/forms/credit-form";
import { InstitucionSchema, institucionSchema } from "@/data/models";

export const InstitucionConfigPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const [institucion, setInstitucion] = useState<InstitucionSchema | null>(null);

  const form = useForm<InstitucionSchema>({
    resolver: zodResolver(institucionSchema),
    defaultValues: {
      nombre: "",
      creditos: [],
      id: "",
    }
  })


  useEffect(() => {
    const inst = localStorage.getItem("INSTITUCION")

    if (inst!=id) navigate("/login")

    const fetchInstitucion = async () => {
      api.get("/instituciones/" + id + "/").then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch institution');
        }
        form.reset(res.data)
        setInstitucion(res.data)
      })
    };

    fetchInstitucion();
  }, [id]);

  if (!institucion) {
    return <div className="flex items-center justify-center">Cargando...</div>;
  }

  const handleSave = () => {
    const name = form.getValues("nombre")
    api.patch(`/instituciones/${id}/`, { nombre: name }).then(res => {
      console.log(res)
    })
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Institucion</h1>
      <div className="mb-4">

        <Form {...form}>
          <form className="grid grid-cols-[3fr_1fr] items-end gap-x-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={handleSave} type="button">Guardar</Button>
          </form>
        </Form>
      </div>
      <h2 className="text-xl font-semibold mb-4">Creditos</h2>
      <div className="grid grid-cols-4 gap-x-4">
        {institucion.creditos.map(credito => (
          <CreditoForm credito={credito} key={credito.id} />
        ))}
      </div>
    </div>
  );
};

