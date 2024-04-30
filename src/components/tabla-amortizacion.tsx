import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export interface AmortizacionRow {
  periodo: any,
  cuota: any,
  interes: any,
  amortizacion: any,
  saldo: any,
}

export const calculate = (
  seguro: any,
  cantidadInicial: any,
  tiempo: any,
  porcentaje: any,
  plazo: any,
  tipo: any
): AmortizacionRow[] => {
  const sistema = []

  let saldoPendiente = cantidadInicial;
  const tasaInteres = porcentaje / 100;
  let cuota, interes, amortizacion;

  for (let periodo = 1; periodo <= plazo; periodo++) {
    if (tipo == 'frances') {
      cuota = cantidadInicial * (tasaInteres / (1 - Math.pow(1 + tasaInteres, -tiempo))) + seguro;
      interes = saldoPendiente * tasaInteres;
      amortizacion = cuota - interes;
    } else {
      cuota = (cantidadInicial + seguro) / tiempo;
      interes = saldoPendiente * tasaInteres;
      amortizacion = cuota - interes;
    }
    saldoPendiente -= amortizacion;

    sistema.push({
      periodo: periodo.toString(),
      cuota: cuota,
      interes: interes,
      amortizacion: amortizacion,
      saldo: saldoPendiente,
    });
  }
  return sistema
}


interface TablaAmortizacionProps {
  rows: AmortizacionRow[];
}

const TablaAmortizacion = ({ rows }: TablaAmortizacionProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">Periodo</TableHead>
          <TableHead className="text-right">Cuota</TableHead>
          <TableHead className="text-right">Interes</TableHead>
          <TableHead className="text-right">Amortizacion</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row,index) => (
          <TableRow key={index}>
            <TableCell className="text-right">{row.periodo}</TableCell>
            <TableCell className="text-right">{row.cuota}</TableCell>
            <TableCell className="text-right">{row.interes}</TableCell>
            <TableCell className="text-right">{row.amortizacion}</TableCell>
            <TableCell className="text-right">{row.saldo}</TableCell>
          </TableRow>
        ))}
        </TableBody>
    </Table>
  )
}

export { TablaAmortizacion }
