'use client'

import { useState, useEffect } from 'react'

interface GameResult {
  won: boolean
  attempts: number
  correctNumber: number
}

export default function Home() {
  const [secretNumber, setSecretNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<number[]>([])
  const [attempts, setAttempts] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'correct' | 'high' | 'low' | ''>('')
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isGameActive, setIsGameActive] = useState<boolean>(false)

  const MAX_ATTEMPTS = 10
  const MIN_NUMBER = 1
  const MAX_NUMBER = 10

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const newSecretNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER
    setSecretNumber(newSecretNumber)
    setGuess('')
    setGuesses([])
    setAttempts(0)
    setMessage('')
    setMessageType('')
    setGameResult(null)
    setIsGameActive(true)
  }

  const handleGuess = () => {
    const guessNumber = parseInt(guess)

    // Validation
    if (isNaN(guessNumber) || guessNumber < MIN_NUMBER || guessNumber > MAX_NUMBER) {
      setMessage(`Please enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}`)
      setMessageType('')
      return
    }

    if (guesses.includes(guessNumber)) {
      setMessage('You already guessed this number!')
      setMessageType('')
      return
    }

    // Process guess
    const newAttempts = attempts + 1
    const newGuesses = [...guesses, guessNumber]

    setAttempts(newAttempts)
    setGuesses(newGuesses)
    setGuess('')

    if (guessNumber === secretNumber) {
      setMessage(`Correct! The number was ${secretNumber}`)
      setMessageType('correct')
      setGameResult({
        won: true,
        attempts: newAttempts,
        correctNumber: secretNumber,
      })
      setIsGameActive(false)
    } else if (guessNumber > secretNumber) {
      setMessage('Too High! Try a lower number.')
      setMessageType('high')

      if (newAttempts >= MAX_ATTEMPTS) {
        setGameResult({
          won: false,
          attempts: newAttempts,
          correctNumber: secretNumber,
        })
        setIsGameActive(false)
      }
    } else {
      setMessage('Too Low! Try a higher number.')
      setMessageType('low')

      if (newAttempts >= MAX_ATTEMPTS) {
        setGameResult({
          won: false,
          attempts: newAttempts,
          correctNumber: secretNumber,
        })
        setIsGameActive(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isGameActive) {
      handleGuess()
    }
  }

  const handleClear = () => {
    setGuess('')
    setMessage('')
    setMessageType('')
  }

  const messageClass =
    messageType === 'correct'
      ? 'message-correct'
      : messageType === 'high' || messageType === 'low'
        ? 'message-too-high'
        : ''

  return (
    <div className="game-container">
      <h1 className="game-title">Number Guessing Game</h1>
      <p className="game-instructions">
        I&apos;m thinking of a number between 1 and 100.
        <br />
        Can you guess it? You have {MAX_ATTEMPTS} attempts.
      </p>

      <div className="game-status">
        <div className="status-attempts">
          Attempt {attempts} of {MAX_ATTEMPTS}
        </div>
        {message && <div className={`status-message ${messageClass}`}>{message}</div>}
      </div>

      <div className="input-section">
        <input
          type="number"
          className="input-field"
          placeholder="Enter a number..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isGameActive}
          min={MIN_NUMBER}
          max={MAX_NUMBER}
        />
        <div className="button-group">
          <button
            className="button button-guess"
            onClick={handleGuess}
            disabled={!isGameActive || guess === ''}
          >
            Guess
          </button>
          <button
            className="button button-clear"
            onClick={handleClear}
            disabled={!isGameActive}
          >
            Clear
          </button>
        </div>
      </div>

      {guesses.length > 0 && (
        <div className="guesses-section">
          <div className="guesses-title">Your Guesses ({guesses.length}):</div>
          <div className="guesses-list">
            {guesses.map((g, index) => (
              <div key={index} className="guess-item">
                {g}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameResult && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className={`modal-title ${gameResult.won ? 'success' : 'failure'}`}>
              {gameResult.won ? '🎉 You Won! 🎉' : '💔 Game Over 💔'}
            </div>
            <div className="modal-text">
              {gameResult.won
                ? `Congratulations! You found the number!`
                : `Sorry! The number was ${gameResult.correctNumber}`}
            </div>
            <div className="modal-text highlight">
              You used {gameResult.attempts} of {MAX_ATTEMPTS} attempts
            </div>
            <button className="button-play-again" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
