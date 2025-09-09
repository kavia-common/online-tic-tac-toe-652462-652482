import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Simple, responsive Tic Tac Toe game with two-player local play.
 * - Shows whose turn it is
 * - Prevents moves on occupied cells or after game over
 * - Highlights winning cells
 * - Provides Reset and Undo
 * - Accessible and keyboard-friendly
 */

// Helpers
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

/**
 * Square - a single cell in the board
 * PUBLIC_INTERFACE
 */
function Square({ value, onClick, highlight, index, disabled }) {
  /** A button representing a single Tic Tac Toe square. */
  return (
    <button
      type="button"
      className={`ttt-square ${highlight ? 'highlight' : ''} ${value ? 'filled' : ''}`}
      onClick={onClick}
      aria-label={`Square ${index + 1}${value ? `, currently ${value}` : ''}`}
      disabled={disabled}
      data-index={index}
    >
      {value}
    </button>
  );
}

/**
 * Board - 3x3 grid of squares
 * PUBLIC_INTERFACE
 */
function Board({ squares, onSquareClick, winningLine, gameOver }) {
  /** Renders a 3x3 board. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((value, idx) => (
        <div key={idx} role="gridcell" className="ttt-cell">
          <Square
            value={value}
            index={idx}
            onClick={() => onSquareClick(idx)}
            highlight={winningLine?.includes(idx)}
            disabled={!!value || gameOver}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Game - main component
 * PUBLIC_INTERFACE
 */
function App() {
  /** Main Tic Tac Toe Game UI and logic. */
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const current = history[step];
  const xIsNext = step % 2 === 0;

  const winnerInfo = useMemo(() => calculateWinner(current), [current]);
  const isDraw = !winnerInfo && isBoardFull(current);
  const gameOver = !!winnerInfo || isDraw;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /** Handles a user clicking on a board square. */
    if (current[index] || winnerInfo) return;
    const next = current.slice();
    next[index] = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, step + 1).concat([next]);
    setHistory(newHistory);
    setStep(step + 1);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Resets the game to initial state. */
    setHistory([Array(9).fill(null)]);
    setStep(0);
  };

  // PUBLIC_INTERFACE
  const undoMove = () => {
    /** Undo the last move if possible. */
    if (step > 0 && !winnerInfo) {
      setStep(step - 1);
    }
  };

  const statusMessage = (() => {
    if (winnerInfo) return `Winner: ${winnerInfo.player}`;
    if (isDraw) return "It's a draw!";
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
    // eslint-disable-next-line
  })();

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle" role="status" aria-live="polite">
            {statusMessage}
          </p>

          <Board
            squares={current}
            onSquareClick={handleSquareClick}
            winningLine={winnerInfo?.line}
            gameOver={gameOver}
          />

          <div className="ttt-actions">
            <button className="btn btn-secondary" onClick={undoMove} disabled={step === 0 || !!winnerInfo}>
              Undo
            </button>
            <button className="btn btn-primary" onClick={resetGame}>
              Reset
            </button>
          </div>

          <div className="ttt-legend" aria-hidden="true">
            <span className="badge x">X</span>
            <span className="badge o">O</span>
          </div>
        </div>

        <footer className="ttt-footer">
          <span>Two-player local game. Click any empty cell to play.</span>
        </footer>
      </header>
    </div>
  );
}

export default App;
