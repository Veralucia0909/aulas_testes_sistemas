export default function Modal({ titulo, children }) {
  return (
    <div className="modal-fundo">
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
