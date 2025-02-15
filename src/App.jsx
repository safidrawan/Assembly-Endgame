import { useState } from "react";
import { clsx } from "clsx";

import "./App.css";
import { languages } from "./languages";
import { getFarewellText } from "./Farewell";
import { wordsArray } from "./Words";

export default function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [userGuesses, setUserGuesses] = useState(new Set());

  const wrongGuessesCount = [...userGuesses].filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => userGuesses.has(letter));

  const MAX_WRONG_GUESSES = languages.length - 1;

  const isGameLost = wrongGuessesCount >= MAX_WRONG_GUESSES;

  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = [...userGuesses][userGuesses.size - 1];
  const isLastGuessWrong =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz.";

  function getRandomWord() {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }

  function newGame() {
    setUserGuesses(new Set());
    setCurrentWord(getRandomWord);
  }
  function handleKeyboardClick(letter) {
    setUserGuesses((prev) => new Set([...prev, letter]));
  }
  const languageElements = languages.map((obj, index) => {
    const isLangLost = index < wrongGuessesCount;
    return (
      <div
        key={index}
        style={{ backgroundColor: obj.backgroundColor, color: obj.color }}
        className={`language ${isLangLost ? "lost" : ""}`}
      >
        {obj.name}
      </div>
    );
  });

  const keyboard = alphabet.split("").map((letter, index) => {
    const isGuessed = userGuesses.has(letter);
    const isCorrect = currentWord.includes(letter) && isGuessed;
    const isWrong = isGuessed && !isCorrect;
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        onClick={() => handleKeyboardClick(letter)}
        key={index}
        disabled={isGameOver || userGuesses.has(letter)}
        aria-disabled={userGuesses.has(letter) || isGameOver}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
    ``;
  });

  const wordElement = currentWord.split("").map((letter, index) => {
    const reveal = isGameLost && !userGuesses.has(letter)
    const classes = clsx("word-letters", {reveal:reveal})

    return (
    <span className={classes} key={index}>
      {userGuesses.has(letter) || reveal ? letter.toUpperCase() : ""}
    </span>
    )
});

  function getMessage() {
    if (isGameWon) return { title: "You Won!", message: "Well Done! 🎉" };
    if (isGameLost) return { title: "You Lost!", message: "Try again!" };
    if (isLastGuessWrong)
      return {
        title: "Oh no!",
        message: getFarewellText(languages[wrongGuessesCount - 1].name),
      };
    return { title: "Game", message: "in progress" };
  }
  const { title, message } = getMessage();
  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in 8 attempts to keep the programming world safe from
          Assembly!
        </p>
      </header>
      <section
        aria-live="polite"
        role="status"
        aria-label={`Current word: ${currentWord
          .split("")
          .map((letter) => (userGuesses.has(letter) ? letter + "." : "blank"))
          .join(" ")}`}
        className={clsx("game-status", {
          won: isGameWon,
          lost: isGameLost,
          farewell: !isGameOver && isLastGuessWrong,
        })}
      >
        <h2>{title}</h2>
        <p>{message}</p>
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">
        <div className="word-spans">{wordElement}</div>
        <p className="sr-only" aria-live="polite">
          {lastGuessedLetter &&
            (currentWord.includes(lastGuessedLetter)
              ? `Correct! the letter ${lastGuessedLetter} is in the word.`
              : `Sorry! the letter ${lastGuessedLetter} is not in the word.`)}
          You have ${MAX_WRONG_GUESSES - wrongGuessesCount} attempts left.
        </p>
        <h2> Remaining Chances: {MAX_WRONG_GUESSES - wrongGuessesCount}</h2>
      </section>

      <section className="keyboard">{keyboard}</section>
      {isGameOver ? (
        <button onClick={newGame} className="new-game">
          New Game
        </button>
      ) : (
        ""
      )}
    </main>
  );
}
