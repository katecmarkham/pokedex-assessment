import React from 'react';
import { act, fireEvent, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({ data: [{ id: '1', name: 'Bulbasaur' }] }),
  useGetPokemonDetails: jest.fn().mockReturnValue({ data: null, loading: false, error: null }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn().mockReturnValue({}),
}));

describe('PokemonListPage', () => {
  test('it renders', () => {
    const { getByText } = render(<PokemonListPage />);
    getByText('Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/list/pokemon/1');
  });
  test('typing in the search bar filters the results', () => {
    const { getByPlaceholderText, queryByText } = render(<PokemonListPage />);
    const searchInput = getByPlaceholderText('Search by name or type...');

    fireEvent.change(searchInput, { target: { value: 'Charmander' } });

    expect(queryByText('Bulbasaur')).toBeNull();
  });
});
