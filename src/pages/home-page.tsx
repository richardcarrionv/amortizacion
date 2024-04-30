import { AmortizacionRow, TablaAmortizacion, calculate } from "@/components/tabla-amortizacion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstitucionSchema } from "@/data/models"
import { api } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

const configSchema = z.object({
  seguro: z.any(),
  cantidad: z.any(),
  tiempo: z.any(),
  porcentaje: z.any(),
  plazo: z.any(),
  tipo: z.any(),
})
export type ConfigSchema = z.infer<typeof configSchema>;


const HomePage = () => {

  const form = useForm<ConfigSchema>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      seguro: '',
      cantidad: '',
      tiempo: '',
      porcentaje: '',
      plazo: '',
      tipo: '',
    }
  })

  const [banco, setBanco] = useState<InstitucionSchema | null>(null);
  const [bancos, setBancos] = useState<InstitucionSchema[] | null>(null);
  const [credito, setCredito] = useState<CreditoSchema | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);

  const [tabla, setTabla] = useState<AmortizacionRow[] | null>(null);

  useEffect(() => {
    api.get("/instituciones/").then(res => {
      setBancos(res.data)
    })
  }, [])

  const handleBancoChange = (bancoId: any) => {
    if (bancos) {
      const find = bancos.find(b => b.id == bancoId);
      setBanco(prev => find ? find : prev)
    }
  }


  const handleCreditoChange = (creditoId: any) => {
    if (banco) {
      const find = banco.creditos.find(c => c.id == creditoId);
      setCredito(prev => find ? find : prev)
      form.setValue("porcentaje", find?.interes)
    }
  }

  const handleSistemaChange = (sistema: any) => {
    setTipo(sistema)
    form.setValue("tipo", sistema)
  }

  const onSubmit = (values: ConfigSchema) => {
    const tabla = calculate(values.seguro, values.cantidad, values.tiempo, values.porcentaje, values.plazo, values.tipo)
    setTabla(tabla)
    console.log(tabla)
  }

  return (

    <div className="grid grid-cols-[1fr_3fr]">
      <div className="m-10 w-[305px]">


        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <label className="mb-4 text-sm font-medium">Banco</label>
            <Select onValueChange={handleBancoChange}>
              <SelectTrigger className="w-[300px]">
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

          {banco &&
            <div className="space-y-2">
              <label className="mb-4 text-sm font-medium">Tipo de Credito</label>
              <Select onValueChange={handleCreditoChange}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Selecciona un tipo de credito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Creditos</SelectLabel>
                    {banco && banco.creditos.map(credito => <SelectItem key={banco.id + "-" + credito.id} value={credito.id}>{credito.nombre} ({credito.interes}%)</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          }

          {
            credito &&
            <div className="space-y-2">
              <label className="pb-4 text-sm font-medium">Sistema</label>
              <Select onValueChange={handleSistemaChange}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Selecciona un sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sistemas</SelectLabel>
                    <SelectItem value={"frances"}>Frances</SelectItem>
                    <SelectItem value={"aleman"}>Aleman</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          }
        </div>

        {tipo && (
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

              <FormField
                control={form.control}
                name="seguro"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel>Seguro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiempo"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel>Tiempo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {credito && <span>Plazo maximo: {credito.plazo_meses}</span>}
              <FormField
                control={form.control}
                name="plazo"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel>Plazo</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" max={credito ? credito.plazo_meses : 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Calcular</Button>
            </form>
          </Form>
        )}


      </div>
      {tabla && <TablaAmortizacion rows={tabla} />}
    </div>
  )
}

export { HomePage }
