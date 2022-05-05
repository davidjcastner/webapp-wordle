import { GuessResult } from '../types/GuessResult';

/** performs all logic necessary for the game of wordle */
export interface WordleLogic {
    /** returns the total number of guesses for a single game */
    getMaxGuesses(): number;
    /** returns the number of letters in the answer and each guess */
    getWordLength(): number;
    /** resets the class for a new game */
    newGame(): void;
    /** checks if any game over conditions are met */
    isGameOver(): boolean;
    /** checks if the guess is in the set of acceptable guesses */
    isAllowedGuess(guess: string): boolean;
    /** makes a guess for the current game and returns the result,
     * assumes that the game is not over and that a guess can still be made */
    makeGuess(guess: string): GuessResult;
    /** returns the answer the user was attempting to guess,
     * assumes that the game is over */
    getAnswer(): string;
}
