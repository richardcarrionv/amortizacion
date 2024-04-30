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
  no: any,
  cuota: any,
  interes: any,
  capital: any,
  saldo: any,
}

export const calculate = (
  cp: any,
  n: any,
  i: any,
  tipo: any
): AmortizacionRow[] => {
  const sistema = []

  let saldo = cp;
  const iMen = (i / 12) / 100;
  let cuota, interes, capital;

  for (let no = 1; no <= n; no++) {
    if (tipo == 'frances') {
      cuota = cp * (iMen / (1 - Math.pow(1 + iMen, -n)))
      interes = saldo * iMen;
      capital = cuota - interes;
      saldo = saldo - capital
    } else {
      capital = cp /n;
      interes = saldo * iMen;
      cuota = interes + capital;
      saldo = saldo - capital;
    }

    const row = {
      no: no.toString(),
      cuota: cuota.toFixed(2),
      interes: interes.toFixed(2),
      capital: capital.toFixed(2),
      saldo: saldo.toFixed(2),
    }

    if (no == 1) {
      console.log(row)
    }

    sistema.push(row);
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
        {rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="text-right">{row.no}</TableCell>
            <TableCell className="text-right">{row.cuota}</TableCell>
            <TableCell className="text-right">{row.interes}</TableCell>
            <TableCell className="text-right">{row.capital}</TableCell>
            <TableCell className="text-right">{row.saldo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { TablaAmortizacion }
