import { useId, useState } from 'react';
import type { SubmitEvent } from 'react';
import './Newsletter.scss';

export default function Newsletter() {
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const nameInput = form.elements.namedItem('name');

    if (!name && nameInput instanceof HTMLInputElement) {
      nameInput.setCustomValidity('Digite seu nome, sem usar apenas espaços.');
      nameInput.reportValidity();
      return;
    }

    setMessage('Dados validados. Nenhuma inscrição foi enviada.');
  }

  return (
    <section className="newsletter" aria-labelledby={titleId}>
      <div className="newsletter__inner container">
        <div className="newsletter__intro">
          <h2 id={titleId}>Inscreva-se na nossa newsletter</h2>
          <p>Assine a nossa newsletter e receba as novidades e conteúdos exclusivos da Econverse.</p>
        </div>
        <form
          className="newsletter__form"
          onSubmit={handleSubmit}
          onInput={(event) => {
            if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
            setMessage(null);
          }}
        >
          <div className="newsletter__fields">
            <label className="visually-hidden" htmlFor={nameId}>Nome</label>
            <input id={nameId} name="name" autoComplete="name" placeholder="Digite seu nome" required />
            <label className="visually-hidden" htmlFor={emailId}>E-mail</label>
            <input id={emailId} name="email" type="email" autoComplete="email" placeholder="Digite seu e-mail" required />
            <button type="submit">Inscrever</button>
          </div>
          <label className="newsletter__terms">
            <input name="terms" type="checkbox" required />
            <span>Aceito os termos e condições</span>
          </label>
          {message && <p className="newsletter__message" role="status">{message}</p>}
        </form>
      </div>
    </section>
  );
}
