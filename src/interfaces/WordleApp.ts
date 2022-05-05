import { WordleAppState } from '../types/WordleAppState';
import { WordleEngine } from './WordleEngine';

/** methods for interacting with a wordle application */
export interface WordleApp {
    /** gives the app access to a WordleEngine implementation */
    initialize(wordleEngine: WordleEngine): WordleAppState;
    /** returns the current state */
    getState(): WordleAppState;
    /** resets the application by removing all guesses and characters */
    newGame(): WordleAppState;
    /** adds a single character to the active guess if possible */
    addCharacter(character: string): WordleAppState;
    /** removes the last character from the active guess if possible */
    removeCharacter(): WordleAppState;
    /** attempts to submit the guess, returns the result if valid */
    submitGuess(): WordleAppState;
}
