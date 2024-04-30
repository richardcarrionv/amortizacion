import { AmortizacionRow, TablaAmortizacion, calculate } from "@/components/tabla-amortizacion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstitucionSchema, InversionSchema } from "@/data/models"
import { api } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Navbar } from "@/components/navbar-home";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const configSchema = z.object({
  cp: z.string(),
  n: z.string(),
  i: z.any(),
  tipo: z.any(),
  seguro: z.string(),
})
export type ConfigSchema = z.infer<typeof configSchema>;


const InversionPage = () => {

  const form = useForm<ConfigSchema>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      cp: undefined,
      n: undefined,
      i: '',
      tipo: '',
      seguro: undefined,
    }
  })

  const [banco, setBanco] = useState<InstitucionSchema | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [inv, setInv] = useState<InversionSchema | null>(null);

  const [cantidad, setCantidad] = useState<string | null>(null);

  const [total, setTotal] = useState<number | null>(null);


  useEffect(() => {
    api.get("/instituciones/").then(res => {
      setBanco(res.data[0])
    })
  }, [])


  const handleTipo = (tipoPlazo: string) => {
    setTipo(tipoPlazo)
  }

  const handleTime = (value: any) => {
    if (banco) {
      const find = banco.inversiones.find(b => b.id == value)
      setInv(find ?? null)
    }
  }

  useEffect(() => {
    if (inv && cantidad) {
      const i = parseFloat(inv.interes)
      const c = parseFloat(cantidad)
      setTotal(((i / 100) * c) + c)
    }
  }, [inv, cantidad])



  return (

    <div>
      <Navbar />
      <div className=" flex items-center justify-center mt-10">
        {
          banco &&
          <img width={"100px"} className="text-center mr-5" src={banco.img} />
        }
        <h1 className="text-center text-5xl font-semibold mt-10">{banco && banco.nombre}</h1>
      </div>
      <div className="my-10 mx-12 flex flex-col items-center">
        <div className="w-[305px]">

          <div className="space-y-6 mb-6 border rounded-xl p-4 w-[350px]">

            <div className="space-y-2">
              <label className="mb-4 text-sm font-medium">Cantidad</label>
              <Input value={cantidad} onChange={e => setCantidad(e.target.value)} type="number" />
            </div>

            <div className="space-y-2">
              <label className="mb-4 text-sm font-medium">Tipo de plazo</label>
              <Select onValueChange={handleTipo}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Selecciona un tipo de plazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Creditos</SelectLabel>
                    <SelectItem value={"mes"}>Mes</SelectItem>
                    <SelectItem value={"dia"}>Dia</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {tipo &&
              <div className="space-y-2">
                <label className="mb-4 text-sm font-medium">Tiempo</label>
                <Select onValueChange={handleTime}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Selecciona el tiempo de la inversion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{tipo == "mes" ? "Meses" : "Días"}</SelectLabel>
                      {tipo && banco && banco.inversiones.map(inv => (
                        inv.tipo == tipo &&
                        <SelectItem key={inv.id} value={inv.id}>{inv.tiempo}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            }


            {inv && cantidad && (
              <div>
                <p>En {inv.tiempo} {inv.tipo == "mes" ? "meses" : "días"} recibiras: {total}</p>
                <p>Con un interes de: {inv.interes}%</p>
              </div>
            )}
          </div>


        </div>
      </div>
      <Toaster />
    </div>
  )
}

export { InversionPage }
