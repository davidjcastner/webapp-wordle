import { GuessResult } from '../types/GuessResult';

/** methods that would otherwise mutate the engine */
interface WordleEngineMutations {
    /** sets properties for the engine to use */
    setProperties(maxGuesses: number, wordLength: number): WordleEngine;
    /** gives the ability to load data asynchronously */
    loadData(guesses: Set<string>, answers: Set<string>): WordleEngine;
    /** resets the engine for a new game */
    newGame(): WordleEngine;
    /** makes and calculate the result of a guess */
    makeGuess(guess: string): WordleEngine;
}

/** properties required by the wordle app */
interface WordleEngineAPI {
    /** checks if the guess is in the set of acceptable guesses */
    isAllowedGuess(guess: string): boolean;
    /** returns the result of the last guess,
     * assumes that at least one guess was made */
    getLastResult(): GuessResult;
    /** returns the answer for the current game,
     * assumes that the game is over */
    getAnswer(): string;
}

/** interactions available in the wordle engine */
export interface WordleEngine extends WordleEngineAPI, WordleEngineMutations {}
