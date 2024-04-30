import { z } from "zod"

export const creditoSchema = z.object({
  id: z.any(),
  nombre: z.string().min(2).max(50),
  interes: z.any(),
  plazo_meses: z.any(),
  institucion: z.any(),
})
export type CreditoSchema = z.infer<typeof creditoSchema>;

export const institucionSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2).max(50),
  creditos: z.array(creditoSchema),
})
export type InstitucionSchema = z.infer<typeof institucionSchema>;

export interface Credito {
  id: number,
  nombre: string,
  interes: number,
  plazo_meses: number,
  institucion: number
}

export interface Institucion {
  id: number,
  nombre: string,
  creditos: Credito[],
}

export interface Admin {
  id: number
  institucion: Institucion | null,
  password: string,
  last_login: any,
  is_superuser: boolean,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  is_staff: boolean,
  is_active: boolean,
  date_joined: string,
  groups: any[],
  user_permissions: any[]
}

export interface ConfigSchema {
  seguro: any;
  cantidadInicial: any;
  tiempo: any;
  porcentaje: any;
  plazo: any;
  tipo: any;
}
