import { createRoot } from 'react-dom/client';
import { instalarApiSimulada } from './services/apiSimulada';
import App from './App';
import './estilos.css';

// Sem backend: as chamadas fetch são respondidas por dados em memória.
instalarApiSimulada();

createRoot(document.getElementById('root')).render(<App />);
