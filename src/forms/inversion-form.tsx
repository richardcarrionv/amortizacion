import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InversionSchema, inversionSchema} from "@/data/models";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface InversionFormProps {
  inversion: InversionSchema;
}

const InversionForm = ({ inversion }: InversionFormProps) => {

  const { toast } = useToast()

  const form = useForm<InversionSchema>({
    resolver: zodResolver(inversionSchema),
    defaultValues: { ...inversion },
  })

  const onSubmit = (values: InversionSchema) => {
    api.patch("/inversiones/" + inversion.id + "/", values).then(res => {
      toast({
        title: "Correcto",
        description: "La inversion se actualizo correctamente"
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border rounded-xl p-4 max-w-[200px]">
        <div className="flex gap-x-4 my-2">

          <FormField
            control={form.control}
            name="tiempo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
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
                <FormLabel>Interes %</FormLabel>
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

export { InversionForm }
