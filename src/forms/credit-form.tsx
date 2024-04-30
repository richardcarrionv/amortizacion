import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreditoSchema, creditoSchema } from "@/data/models";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { DevTool } from "@hookform/devtools";
import { api } from "@/lib/api";

interface CreditFormProps {
  credito: CreditoSchema;
}

const CreditoForm = ({ credito }: CreditFormProps) => {

  const form = useForm<CreditoSchema>({
    resolver: zodResolver(creditoSchema),
    defaultValues: { ...credito },
  })

  const onSubmit = (values: CreditoSchema) => {
    api.patch("/creditos/"+credito.id+"/", values).then(res => { 
      console.log(res)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} readOnly/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interes</FormLabel>
              <FormControl>
                <Input {...field} type="number"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plazo_meses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meses de plazo</FormLabel>
              <FormControl>
                <Input {...field} type="number"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-10 bg-green-600" > Guardar</Button>
      </form>
    </Form>
  )
}

export { CreditoForm }
