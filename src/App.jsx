import { useState } from "react";
import { clsx } from "clsx";

import "./App.css";
import { languages } from "./languages";
import { getFarewellText } from "./Farewell";

export default function App() {
  const [currentWord, setCurrentWord] = useState(getRandomLang);
  const [userGuesses, setUserGuesses] = useState(new Set());

  const wrongGuessesCount = [...userGuesses].filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => [...userGuesses].includes(letter));

  const MAX_WRONG_GUESSES = languages.length - 1;

  const isGameLost = wrongGuessesCount >= MAX_WRONG_GUESSES;

  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = [...userGuesses][userGuesses.size-1];
  const isLastGuessWrong =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz.";

  function getRandomLang() {
    return languages[
      Math.floor(Math.random() * languages.length)
    ].name.toLowerCase();
    auto;
  }

  function updateUserGuesses(letter) {
    setUserGuesses((prev) => new Set([...prev, letter]));
  }
  function newGame() {
    setUserGuesses(new Set());
    setCurrentWord(() => {
      return languages[
        Math.floor(Math.random() * languages.length)
      ].name.toLowerCase();
    });
  }
  function handleKeyboardClick(letter) {
    updateUserGuesses(letter);
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
    const isGuessed = [...userGuesses].includes(letter);
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
        disabled={isGameOver}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const wordElement = currentWord.split("").map((letter, index) => (
    <span className="word-letters" key={index}>
      {[...userGuesses].includes(letter) ? letter.toUpperCase() : ""}
    </span>
  ));

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
        className={clsx("game-status", { won: isGameWon, lost: isGameLost , farewell:!isGameOver && isLastGuessWrong})}
      >
        <h2>{title}</h2>
        <p>{message}</p>
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{wordElement}</section>
      <section className="keyboard">{keyboard}</section>
      {isGameOver ? (
        <button onClick={newGame} className="newgame">
          New Game
        </button>
      ) : (
        ""
      )}
    </main>
  );
}
