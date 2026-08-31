import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ListaVoznji from './pages/ListaVoznji';
import DetaljiVoznje from './pages/DetaljiVoznje';
import MojeRezervacije from './pages/MojeRezervacije';
import KreirajVoznju from './pages/KreirajVoznju';
import MojeVoznje from './pages/MojeVoznje';
import ZasticenaRuta from './components/ZasticenaRuta';

function App() {
  return (
    <Routes>
      <Route path="/prijava" element={<Login />} />
      <Route path="/registracija" element={<Register />} />
      <Route
        path="/voznje"
        element={
          <ZasticenaRuta>
            <ListaVoznji />
          </ZasticenaRuta>
        }
      />
      <Route
        path="/voznje/:id"
        element={
          <ZasticenaRuta>
            <DetaljiVoznje />
          </ZasticenaRuta>
        }
      />
      <Route
        path="/moje-rezervacije"
        element={
          <ZasticenaRuta>
            <MojeRezervacije />
          </ZasticenaRuta>
        }
      />
      <Route
        path="/kreiraj-voznju"
        element={
          <ZasticenaRuta>
            <KreirajVoznju />
          </ZasticenaRuta>
        }
      />
      <Route
        path="/moje-voznje"
        element={
          <ZasticenaRuta>
            <MojeVoznje />
          </ZasticenaRuta>
        }
      />
      <Route path="/" element={<Navigate to="/prijava" />} />
    </Routes>
  );
}

export default App;