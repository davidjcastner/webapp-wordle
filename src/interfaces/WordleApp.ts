import { WordleAppState } from '../types/WordleAppState';

/** methods for interacting with a wordle application */
export interface WordleApp {
    /** returns a default app state */
    initialize(maxGuesses?: number, wordLength?: number): WordleAppState;
    /** loads data for the engine */
    loadData(
        state: WordleAppState,
        guesses: Set<string>,
        answers: Set<string>
    ): WordleAppState;
    /** resets the application by removing all guesses and characters */
    newGame(state: WordleAppState): WordleAppState;
    /** adds a single character to the active guess if possible */
    addCharacter(state: WordleAppState, character: string): WordleAppState;
    /** removes the last character from the active guess if possible */
    removeCharacter(state: WordleAppState): WordleAppState;
    /** attempts to submit the guess, returns the result if valid */
    submitGuess(state: WordleAppState): WordleAppState;
}
