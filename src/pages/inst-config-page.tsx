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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/navbar-home";
import { InversionForm } from "@/forms/inversion-form";

export const InstitucionConfigPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const [institucion, setInstitucion] = useState<InstitucionSchema | null>(null);

  const { toast } = useToast()

  const form = useForm<InstitucionSchema>({
    resolver: zodResolver(institucionSchema),
    defaultValues: {
      nombre: "",
      creditos: [],
      id: "",
      img: "",
    }
  })


  useEffect(() => {
    const inst = localStorage.getItem("INSTITUCION")

    if (inst != id) navigate("/login")

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
      toast({
        title: "Correcto",
        description: "La institucion se actulizo exitosamente",
      })
    })
  }

  const handleSaveImg = () => {
    const img = form.getValues("img")
    api.patch(`/instituciones/${id}/`, { img: img }).then(res => {
      console.log(res)
      toast({
        title: "Correcto",
        description: "Se actualizo la imagen de la institucion exitosamente",
      })
    })
  }

  return (
    <Navbar >

      <div>
        <div className="h-[100vh-80px] w-full flex items-center justify-center">
          <div className="container mx-auto border rounded-xl py-6">
            <h1 className="text-3xl font-semibold mb-4">Institucion</h1>
            <div className="mb-4">

              <Form {...form}>
                <form className="w-full">
                  <div className="flex items-end gap-x-4">

                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem className="w-[400px]">
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button onClick={handleSave} type="button" className="bg-green-600 w-[200px]">Guardar</Button>
                  </div>

                  <div className="flex items-end gap-x-4 mt-6">
                    <FormField
                      control={form.control}
                      name="img"
                      render={({ field }) => (
                        <FormItem className="w-[800px]">
                          <FormLabel>URL de la imagen</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button onClick={handleSaveImg} type="button" className="bg-green-600 w-[200px]">Guardar</Button>
                  </div>
                </form>
              </Form>
            </div>
            <h2 className="mt-8 text-3xl font-semibold mb-4">Creditos</h2>
            <div className="grid grid-cols-4 gap-x-4">
              {institucion.creditos.map(credito => (
                <CreditoForm credito={credito} key={credito.id} />
              ))}
            </div>

            <h2 className="mt-8 text-3xl font-semibold mb-4">Inversiones</h2>
            <div className="flex items-end gap-x-4">
              <div className="border p-4 rounded-xl">
                <h1 className="text-xl font-semibold">En meses</h1>
                <div className="flex gap-x-2">
                  {institucion.inversiones.map(inv => (
                    inv.tipo == "mes" && <InversionForm inversion={inv} key={inv.id} />
                  ))}
                </div>
              </div>
              <div className="border p-4 rounded-xl">
                <h1 className="text-xl font-semibold">En días</h1>
                <div className="flex gap-x-2">
                  {institucion.inversiones.map(inv => (
                    inv.tipo == "dia" && <InversionForm inversion={inv} key={inv.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      </div>
    </Navbar>
  );
};

