import { useState } from 'react';
import Turmas from './components/Turmas';
import Alunos from './components/Alunos';

export default function App() {
  const [tela, setTela] = useState('alunos');

  return (
    <div className="app">
      <header>
        <strong>Escola Amorinha</strong>
        <nav>
          <button className={tela === 'alunos' ? 'ativo' : ''} onClick={() => setTela('alunos')}>Alunos</button>
          <button className={tela === 'turmas' ? 'ativo' : ''} onClick={() => setTela('turmas')}>Turmas</button>
        </nav>
      </header>
      <main>{tela === 'turmas' ? <Turmas /> : <Alunos />}</main>
    </div>
  );
}
