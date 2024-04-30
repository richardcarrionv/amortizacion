import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    localStorage.clear()
    navigate("/")
  }


  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto grid grid-cols-[3fr_1fr]">
        <div className="flex gap-x-4">
          <Link to="/" className="text-white text-xl font-bold">
            Amortizacion
          </Link>
          <Link to="/credito" className="text-white text-xl font-bold">
            Credito
          </Link>
        </div>
        {localStorage.getItem("INSTITUCION") ?
          <div className="flex justify-between">
            <Link to={`/institucion/${localStorage.getItem("INSTITUCION")}/`} className="text-white text-xl font-bold">
              Configuracion
            </Link>
            <a onClick={handleClick} className="text-white text-xl font-bold">
              Cerrar Sesion
            </a>
          </div> : <Link to="/login" className="text-white text-xl font-bold">Administrar</Link>
        }

      </div>
    </nav>)
}

export { Navbar }
