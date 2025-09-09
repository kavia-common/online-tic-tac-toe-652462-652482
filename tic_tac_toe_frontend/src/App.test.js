import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and board', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  // Board has 9 cells
  const cells = screen.getAllByRole('gridcell');
  expect(cells).toHaveLength(9);
});
