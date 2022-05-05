import { GuessResult } from '../types/GuessResult';

/** interactions available in the wordle engine */
export interface WordleEngine {
    /** checks if words in a set meet word length and character conditions */
    isValidWordSet(words: Set<string>): boolean;
    /** updates the number of max guesses */
    setMaxGuesses(guesses: number): void;
    /** sets the word length */
    setWordLength(length: number): void;
    /** updates the set of all allowed guesses */
    setAllowedGuesses(guesses: Set<string>): void;
    /** updates the set of all allowed answers,
     * each allowed answer must also be an allowed guess */
    setAllowedAnswers(answers: Set<string>): void;
    /** returns the total number of guesses for a single game */
    getMaxGuesses(): number;
    /** returns the number of letters in the answer and each guess */
    getWordLength(): number;
    /** returns the number of guesses remaining */
    getAllowedGuesses(): Readonly<Set<string>>;
    /** returns the set of all allowed answers */
    getAllowedAnswers(): Readonly<Set<string>>;
    /** resets the class for a new game */
    getRemainingGuesses(): number;
    /** checks if the guess is in the set of acceptable guesses */
    isAllowedGuess(guess: string): boolean;
    /** checks if the answer is in the set of acceptable answers */
    isAllowedAnswer(answer: string): boolean;
    /** returns the set of all allowed guesses */
    newGame(): void;
    /** sets the answer for the game, must not have any guesses made */
    setAnswer(answer: string): void;
    /** sets the answer as a random valid answer */
    generateRandomAnswer(): void;
    /** checks if any game over conditions are met */
    isGameOver(): boolean;
    /** returns true if the answer was guesses, assumes that the game is over */
    isWin(): boolean;
    /** returns the score of current game,
     * assumes that the game is over and that the answer was guesses */
    getScore(): number;
    /** returns the answer the user was attempting to guess,
     * assumes that the game is over */
    getAnswer(): string;
    /** checks if a guess can still be made */
    canMakeGuess(): boolean;
    /** makes a guess for the current game and returns the result,
     * assumes that the game is not over and that a guess can still be made */
    makeGuess(guess: string): Readonly<GuessResult>;
    /** returns the previous guesses */
    getPreviousGuesses(): Readonly<Array<string>>;
    /** returns the previous results */
    getPreviousResults(): Readonly<Array<GuessResult>>;
}
