import { useState } from 'react';

export default function ListaAutorizados({ autorizados, onChange }) {
  const [nome, setNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [erro, setErro] = useState('');

  function adicionar() {
    if (!nome.trim()) return setErro('Informe o nome do autorizado');
    if (!parentesco.trim()) return setErro('Informe o grau de parentesco');
    onChange([...autorizados, { nome: nome.trim(), parentesco: parentesco.trim() }]);
    setNome('');
    setParentesco('');
    setErro('');
  }

  function remover(indice) {
    onChange(autorizados.filter((_, i) => i !== indice));
  }

  return (
    <fieldset>
      <legend className="requerido">Autorizados a buscar</legend>
      <div className="linha-campos">
        <div>
          <label htmlFor="nomeAutorizado">Nome do autorizado</label>
          <input id="nomeAutorizado" placeholder="Ex.: Pedro" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div>
          <label htmlFor="parentesco">Grau de parentesco</label>
          <input id="parentesco" placeholder="Ex.: Padrinho" value={parentesco} onChange={(e) => setParentesco(e.target.value)} />
        </div>
        <button type="button" className="secundario" onClick={adicionar}>Adicionar autorizado</button>
      </div>
      {erro && <p role="alert">{erro}</p>}
      <ul aria-label="Lista de autorizados" className="autorizados">
        {autorizados.map((a, i) => (
          <li key={`${a.nome}-${i}`}>
            <span>{a.nome} - {a.parentesco}</span>
            <button type="button" className="link perigo" onClick={() => remover(i)} aria-label={`Remover ${a.nome}`}>Remover</button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
