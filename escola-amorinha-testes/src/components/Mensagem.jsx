export default function Mensagem({ mensagem, onFechar }) {
  if (!mensagem) return null;
  return (
    <div role="status" className={`mensagem mensagem-${mensagem.tipo}`}>
      <span>{mensagem.texto}</span>
      <button type="button" className="fechar" aria-label="Fechar mensagem" onClick={onFechar}>×</button>
    </div>
  );
}
