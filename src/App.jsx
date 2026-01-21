import { UsuarioProvider } from "./context/UsuarioContext";
import Header from './components/Header';
import Footer from './components/Footer';
import CalendarSystem from './CalendarSystem';

function App() {
  return (
    <UsuarioProvider>
      <Header />
      <CalendarSystem />
      <Footer />
    </UsuarioProvider>
  );
}

export default App;
