import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

const loginForm = z.object({
  username: z.string(),
  password: z.string(),
})

type LoginForm = z.infer<typeof loginForm>;

const LoginPage = () => {


  const navigate = useNavigate()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const handleLogin = (values: LoginForm) => {
    console.log(values)
    api.post("/login/", values).then(res => {
      if (res.status == 200) {
        localStorage.setItem("INSTITUCION", res.data.institucion)
        localStorage.setItem("ADMIN", res.data.admin)
        if (res.data.admin) {
          navigate("/config")
        } else {
          navigate("/institucion/" + res.data.institucion + "/")
        }
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <FormField
              control={form.control}
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
              control={form.control}
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
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 text-lg text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Iniciar Sesión
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export { LoginPage }
