// tests/CityAutocomplete.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CityAutocomplete from '../app/components/CityAutocomplete';

describe('CityAutocomplete', () => {
  it("affiche 'Paris' quand on tape 'Par'", () => {
    const onChange = vi.fn();
    render(<CityAutocomplete value="" onChange={onChange} />);

    // Tape "Par"
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Par' } });

    // 1) Vérifie que le listbox est ouvert et a un nom lié à l'input
    const listbox = screen.getByRole('listbox', { name: /Par/i });

    // 2) Trouve une option dont le nom accessible, une fois les espaces enlevés, vaut "Paris"
    const optionParis = within(listbox).getByRole('option', {
      name: (name) => name.replace(/\s/g, '') === 'Paris',
    });

    expect(optionParis).toBeInTheDocument();
  });
});
