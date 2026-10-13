import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Newsletter from './Newsletter';

describe('newsletter', () => {
  it('exige nome, e-mail válido e aceite antes de apresentar a resposta', async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const name = screen.getByRole('textbox', { name: 'Nome' }) as HTMLInputElement;
    const email = screen.getByRole('textbox', { name: 'E-mail' }) as HTMLInputElement;
    const terms = screen.getByRole('checkbox') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Inscrever' });
    await user.click(submit);
    expect(name.validity.valueMissing).toBe(true);
    expect(screen.queryByRole('status')).toBeNull();
    await user.type(name, 'Teste Local');
    await user.type(email, 'invalido');
    await user.click(submit);
    expect(email.validity.typeMismatch).toBe(true);
    expect(screen.queryByRole('status')).toBeNull();
    await user.clear(email);
    await user.type(email, 'teste@example.com');
    await user.click(submit);
    expect(terms.validity.valueMissing).toBe(true);
    expect(screen.queryByRole('status')).toBeNull();
    await user.click(terms);
    await user.click(submit);
    expect(screen.getByRole('status').textContent).toBe('Dados validados. Nenhuma inscrição foi enviada.');
    await user.click(terms);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('recusa nome só com espaços e permite corrigir e enviar com Enter', async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const name = screen.getByRole('textbox', { name: 'Nome' }) as HTMLInputElement;
    const email = screen.getByRole('textbox', { name: 'E-mail' });
    await user.type(name, '   ');
    await user.type(email, 'teste@example.com');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Inscrever' }));
    expect(name.validationMessage).toBe('Digite seu nome, sem usar apenas espaços.');
    expect(screen.queryByRole('status')).toBeNull();
    await user.clear(name);
    await user.type(name, 'Teste Local');
    expect(name.validity.customError).toBe(false);
    await user.type(email, '{Enter}');
    expect(screen.getByRole('status').textContent).toBe('Dados validados. Nenhuma inscrição foi enviada.');
    await user.type(name, ' Editado');
    expect(screen.queryByRole('status')).toBeNull();
  });
});
