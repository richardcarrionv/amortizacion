import { z } from "zod"

export const creditoSchema = z.object({
  id: z.any(),
  nombre: z.string().min(2).max(50),
  interes: z.any(),
  plazo_meses: z.any(),
  institucion: z.any(),
})
export type CreditoSchema = z.infer<typeof creditoSchema>;


export const inversionSchema = z.object({
  id: z.any(),
  tipo: z.string(),
  tiempo: z.any(),
  interes: z.any(),
})

export type InversionSchema = z.infer<typeof inversionSchema>;

export const institucionSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2).max(50),
  img: z.string(),
  creditos: z.array(creditoSchema),
  inversiones: z.array(inversionSchema),
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
  inversiones: InversionSchema[],
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
