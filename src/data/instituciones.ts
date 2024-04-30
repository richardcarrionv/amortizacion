import { Institucion } from "./models";

export const instituciones: Institucion[] = [
  {
    id: 1,
    creditos: [
      {
        id: 1,
        nombre: "Hipotecario",
        interes: 10.5,
        plazo_meses: 10,
        institucion: 1
      },
      {
        id: 2,
        nombre: "Consumo",
        interes: 12.5,
        plazo_meses: 6,
        institucion: 1
      },
      {
        id: 3,
        nombre: "Microcredito",
        interes: 8.5,
        plazo_meses: 8,
        institucion: 1
      },
      {
        id: 4,
        nombre: "Educacion",
        interes: 6.0,
        plazo_meses: 8,
        institucion: 1
      }
    ],
    nombre: "Banco del Austro"
  },
  {
    id: 2,
    creditos: [
      {
        id: 5,
        nombre: "Educacion",
        interes: 6.5,
        plazo_meses: 10,
        institucion: 2
      },
      {
        id: 6,
        nombre: "Microcredito",
        interes: 10.0,
        plazo_meses: 9,
        institucion: 2
      },
      {
        id: 8,
        nombre: "Consumo",
        interes: 10.0,
        plazo_meses: 8,
        institucion: 2
      },
      {
        id: 9,
        nombre: "Hipotecario",
        interes: 12.0,
        plazo_meses: 10,
        institucion: 2
      }
    ],
    nombre: "Banco Pichincha"
  }
]
