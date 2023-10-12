
import { Route, Routes } from 'react-router-dom';
import Noticias from './componentes/Noticias/Noticias';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Noticias />} />
    </Routes>
  );
}

export default App;
