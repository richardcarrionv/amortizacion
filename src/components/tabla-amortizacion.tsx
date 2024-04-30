import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button";
export interface AmortizacionRow {
  no: any,
  cuota: any,
  interes: any,
  capital: any,
  saldo: any,
  cuota_seguro: any;
}

export const calculate = (
  cp: any,
  n: any,
  i: any,
  tipo: any,
  seguro: any,
): AmortizacionRow[] => {
  const sistema = []
  cp = parseFloat(cp)
  n = parseInt(n)
  i = parseFloat(i)
  seguro = parseFloat(seguro)

  let saldo = cp;
  const iMen = (i / 12) / 100;
  let cuota, interes, capital, cuota_seguro;

  for (let no = 1; no <= n; no++) {
    if (tipo == 'frances') {
      cuota = cp * (iMen / (1 - Math.pow(1 + iMen, -n)))
      interes = saldo * iMen;
      capital = cuota - interes;
      saldo = saldo - capital
    } else {
      capital = cp / n;
      interes = saldo * iMen;
      cuota = interes + capital;
      saldo = saldo - capital;
    }

    if (seguro) cuota_seguro = cuota + seguro;

    const row = {
      no: no.toString(),
      cuota: cuota.toFixed(2),
      interes: interes.toFixed(2),
      capital: capital.toFixed(2),
      saldo: saldo.toFixed(2),
      cuota_seguro: cuota_seguro ? cuota_seguro.toFixed(2) : null,
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
      <div className="border rounded-xl w-full max-h-[70vh] overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Periodo</TableHead>
              {rows[0].cuota_seguro &&
                <TableHead className="text-right">Cuota+Seguro</TableHead>
              }
              <TableHead className="text-right">Cuota</TableHead>
              <TableHead className="text-right">Interes</TableHead>
              <TableHead className="text-right">Capital</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{row.no}</TableCell>
                {
                  rows[0].cuota_seguro &&
                  <TableCell className="text-right">{row.cuota_seguro}</TableCell>
                }
                <TableCell className="text-right">{row.cuota}</TableCell>
                <TableCell className="text-right">{row.interes}</TableCell>
                <TableCell className="text-right">{row.capital}</TableCell>
                <TableCell className="text-right">{row.saldo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export { TablaAmortizacion }
