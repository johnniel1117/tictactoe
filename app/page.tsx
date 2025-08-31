'use client'

import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('🐵');
  const [winner, setWinner] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ '🐵': 0, '🍌': 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [winningCells, setWinningCells] = useState([]);

  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  // Trigger confetti when there's a winner or draw
  useEffect(() => {
    if (gameOver) {
      confetti({
        particleCount: winner === 'draw' ? 80 : 120,
        spread: winner === 'draw' ? 60 : 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
        disableForReducedMotion: true,
      });

      // Clear confetti after 3 seconds
      const timer = setTimeout(() => {
        confetti.reset();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  // Check for winner
  const checkWinner = (boardState) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a], combination };
      }
    }
    if (boardState.every(cell => cell !== '')) {
      return { winner: 'draw', combination: [] };
    }
    return { winner: '', combination: [] };
  };

  // Handle cell click
  const handleCellClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setGameOver(true);
      setWinningCells(result.combination);

      // Update scores
      if (result.winner === 'draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      }

      // Add to game history
      setGameHistory(prev => [...prev, {
        id: Date.now(),
        winner: result.winner,
        moves: newBoard.filter(cell => cell !== '').length
      }]);
    } else {
      setCurrentPlayer(currentPlayer === '🐵' ? '🍌' : '🐵');
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('🐵');
    setWinner('');
    setGameOver(false);
    setWinningCells([]);
  };

  // Reset all scores
  const resetScores = () => {
    setScores({ '🐵': 0, '🍌': 0, draws: 0 });
    setGameHistory([]);
  };

  // Get cell styling
  const getCellStyling = (index) => {
    const isWinningCell = winningCells.includes(index);
    const isEmpty = !board[index];
    const isMonkey = board[index] === '🐵';
    const isBanana = board[index] === '🍌';

    let baseClasses = "w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-300 border-2 relative overflow-hidden";
    
    if (isEmpty) {
      baseClasses += " bg-gradient-to-br from-white to-gray-50 border-green-200 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:border-green-300 hover:scale-105 hover:shadow-md";
    } else if (isMonkey) {
      baseClasses += ` ${isWinningCell ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 scale-110 shadow-lg' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} text-blue-600`;
    } else if (isBanana) {
      baseClasses += ` ${isWinningCell ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 scale-110 shadow-lg' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'} text-yellow-600`;
    }

    if (gameOver && !isEmpty) {
      baseClasses += " cursor-not-allowed";
    }

    return baseClasses;
  };

  // Render cell content
  const renderCellContent = (cell) => {
    if (cell === '🐵') return '🐵';
    if (cell === '🍌') return '🍌';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 tracking-tight">
            Monkey vs Banana
          </h1>
          <p className="text-gray-600 text-lg">Johnniel's Tic-Tac-Toe</p>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">{scores['🐵']}</div>
            <div className="text-blue-500 text-sm font-medium">Monkey 🐵</div>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100">
            <div className="text-2xl font-bold text-gray-600 mb-1">{scores.draws}</div>
            <div className="text-gray-500 text-sm font-medium">Draws</div>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{scores['🍌']}</div>
            <div className="text-yellow-500 text-sm font-medium">Banana 🍌</div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          {gameOver ? (
            <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl animate-pulse">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800">
                {winner === 'draw' ? "It's a Draw! 🍌🐵" : `Congratulations! ${winner === '🐵' ? 'Monkey 🐵' : 'Banana 🍌'} Wins!`}
              </span>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl">
              <Users className="w-6 h-6 text-gray-600" />
              <span className="text-lg font-medium text-gray-600">
                Current Player: 
                <span className={`ml-2 font-bold ${currentPlayer === '🐵' ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {currentPlayer === '🐵' ? 'Monkey 🐵' : 'Banana 🍌'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-8 w-80 mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={getCellStyling(index)}
              disabled={gameOver || board[index]}
            >
              <span className="relative z-10 select-none">
                {renderCellContent(cell)}
              </span>
              {winningCells.includes(index) && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetGame}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-br from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 text-green-800 rounded-xl transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 hover:scale-105 hover:shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
          
          <button
            onClick={resetScores}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 hover:scale-105 hover:shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            <span>Reset Scores</span>
          </button>
        </div>

        {/* Game Stats */}
        {gameHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="text-gray-600">
                <div className="font-medium text-gray-500">Total Games</div>
                <div className="text-lg font-bold">{gameHistory.length}</div>
              </div>
              <div className="text-gray-600">
                <div className="font-medium text-blue-500">Monkey 🐵 Win Rate</div>
                <div className="text-lg font-bold text-blue-600">
                  {gameHistory.length ? Math.round((scores['🐵'] / gameHistory.length) * 100) : 0}%
                </div>
              </div>
              <div className="text-gray-600">
                <div className="font-medium text-yellow-500">Banana 🍌 Win Rate</div>
                <div className="text-lg font-bold text-yellow-600">
                  {gameHistory.length ? Math.round((scores['🍌'] / gameHistory.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;