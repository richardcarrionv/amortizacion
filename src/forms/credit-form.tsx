import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreditoSchema, creditoSchema } from "@/data/models";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { DevTool } from "@hookform/devtools";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface CreditFormProps {
  credito: CreditoSchema;
}

const CreditoForm = ({ credito }: CreditFormProps) => {

  const { toast } = useToast()

  const form = useForm<CreditoSchema>({
    resolver: zodResolver(creditoSchema),
    defaultValues: { ...credito },
  })

  const onSubmit = (values: CreditoSchema) => {
    api.patch("/creditos/" + credito.id + "/", values).then(res => {
      toast({
        title: "Correcto",
        description: "El credito se actualizo correctamente"
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border rounded-xl p-4">
        <h1 className="text-center font-semibold text-xl">{credito.nombre}</h1>
        <div className="flex gap-x-4 my-2">
          <FormField
            control={form.control}
            name="interes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interes %</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
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
                <FormLabel>Plazo máximo</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full mt-2 bg-green-600" > Guardar</Button>
      </form>
    </Form>
  )
}

export { CreditoForm }
