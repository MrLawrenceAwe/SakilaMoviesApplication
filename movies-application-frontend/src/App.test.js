import { act, render, screen } from '@testing-library/react';
import App from './App';
import { FilmAPIClient } from './APIClients/FilmAPIClient';

jest.mock('./APIClients/FilmAPIClient');

beforeEach(() => {
  jest.clearAllMocks();
  FilmAPIClient.getFilmLanguages.mockResolvedValue([{ languageId: 1, name: 'English' }]);
  FilmAPIClient.getFilmCategories.mockResolvedValue([{ categoryId: 1, name: 'Action' }]);
  window.IntersectionObserver = jest.fn(() => ({ observe: jest.fn(), unobserve: jest.fn() }));
});

test('loads reference data once and renders the movie search', async () => {
  let rerender;
  await act(async () => { ({ rerender } = render(<App />)); });
  expect(screen.getByRole('heading', { name: 'Sakila Movies' })).toBeInTheDocument();
  rerender(<App />);
  expect(FilmAPIClient.getFilmLanguages).toHaveBeenCalledTimes(1);
  expect(FilmAPIClient.getFilmCategories).toHaveBeenCalledTimes(1);
});

test('shows a reference-data error instead of retrying on every render', async () => {
  FilmAPIClient.getFilmLanguages.mockRejectedValue(new Error('Database unavailable'));
  render(<App />);
  expect(await screen.findByText('Database unavailable')).toBeInTheDocument();
  expect(FilmAPIClient.getFilmLanguages).toHaveBeenCalledTimes(1);
});
