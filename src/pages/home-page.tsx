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


const HomePage = () => {

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
  const [bancos, setBancos] = useState<InstitucionSchema[] | null>(null);
  const [credito, setCredito] = useState<CreditoSchema | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);

  const [tabla, setTabla] = useState<AmortizacionRow[] | null>(null);

  const { toast } = useToast()

  useEffect(() => {
    api.get("/instituciones/").then(res => {
      setBancos(res.data)
      console.log(res.data)
      setBanco(res.data[0])
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
      form.setValue("i", find?.interes)
    }
  }

  const handleSistemaChange = (sistema: any) => {
    console.log("Handle: ", sistema)
    setTipo(sistema)
    form.setValue("tipo", sistema)
  }

  const onSubmit = (values: ConfigSchema) => {
    if (values.n > credito.plazo_meses) {
      toast({
        title: "Error",
        description: "El plazo supera el máximo especificado"
      })
      return
    }
    const tabla = calculate(values.cp, values.n, values.i, values.tipo, values.seguro)
    setTabla(tabla)
  }


  const handleExport = () => {
    const doc = new jsPDF();

    const data: any[] = [];
    let columns = ["Periodo", "Cuota", "Interes", "Capital", "Saldo"];
    if (tabla && tabla[0].cuota_seguro) {
      columns = ["Periodo", "Cuota+Seguro", "Cuota", "Interes", "Capital", "Saldo"];
    }

    if (tabla) {
      tabla.forEach(row => {
        if (tabla[0].cuota_seguro) {
          data.push([row.no, row.cuota_seguro, row.cuota, row.interes, row.capital, row.saldo])
        } else {
          data.push([row.no, row.cuota, row.interes, row.capital, row.saldo])
        }
      })
    }

    const y = 10;
    const i = 10;
    // doc.text('Nombre: ', 10, y);
    const sis = form.getValues("tipo") == "frances" ? "Frances" : "Aleman"
    doc.text('Banco: ' + banco!.nombre, 10, y + i);
    doc.text('Cantidad: ' + form.getValues("cp"), 10, y + i * 2);
    doc.text('Sistema: ' + sis, 10, y + i * 3);
    doc.text('Interes del credito: ' + credito.interes + "%", 10, y + i * 4);

    autoTable(doc, {
      startY: y + i * 6,
      head: [[...columns]],
      body: [...data],
    });

    doc.save('amortizacion.pdf');
  }

  return (

    <Navbar >
      <div>

        <div className=" flex items-center justify-center mt-10">
          {
            banco &&
            <img width={"100px"} className="text-center mr-5" src={banco.img} />
          }
          <h1 className="text-center text-5xl font-semibold mt-10">{banco && banco.nombre}</h1>
        </div>
        <div className="my-10 mx-12 grid grid-cols-[1fr_3fr]">
          <div className="w-[305px]">

            <div className="space-y-6 mb-6 border rounded-xl p-4 w-[350px]">
              {
                //   <div className="space-y-2">
                //     <label className="mb-4 text-sm font-medium">Banco</label>
                //     <Select onValueChange={handleBancoChange}>
                //       <SelectTrigger className="w-[300px]">
                //         <SelectValue placeholder="Selecciona un banco" />
                //       </SelectTrigger>
                //       <SelectContent>
                //         <SelectGroup>
                //           <SelectLabel>Bancos</SelectLabel>
                //           {bancos && bancos.map(banco => <SelectItem key={banco.id} value={banco.id} onClick={() => handleBancoChange(banco)}>{banco.nombre}</SelectItem>)}
                //         </SelectGroup>
                //       </SelectContent>
                //     </Select>
                //   </div>
              }

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
                        <SelectItem value="frances">Frances</SelectItem>
                        <SelectItem value="aleman">Aleman</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

              }
            </div>

            {tipo && (
              <Form {...form}>
                <form className="space-y-6 border rounded-xl p-4 w-[350px]" onSubmit={form.handleSubmit(onSubmit)}>

                  <FormField
                    control={form.control}
                    name="cp"
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

                  {credito &&
                    <FormField
                      control={form.control}
                      name="n"
                      render={({ field }) => (
                        <FormItem className="w-[300px]">
                          <FormLabel>Plazo (Plazo maximo: {credito.plazo_meses})</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />}

                  <Button type="submit" className="w-full">Calcular</Button>
                </form>
              </Form>
            )}


          </div>
          {tabla && (
            <div className="flex flex-col items-end">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-3xl font-bold">Tabla de amortizacion</h1>
                <Button className="w-[200px] my-4" onClick={handleExport}>Exportar</Button>
              </div>
              <TablaAmortizacion rows={tabla} />
            </div>
          )}
        </div>
        <Toaster />
      </div>
    </Navbar>
  )
}

export { HomePage }
