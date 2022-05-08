import { WordleApp } from '../interfaces/WordleApp';
import { WordleAppState } from '../types/WordleAppState';
// import { WordleEngineImplementation } from './WordleEngineImplementation';

const WordleEngine;

/** methods for interacting with a wordle application */
export const WordleAppImplementation: WordleApp = {
    /** returns a default app state */
    initialize(maxGuesses: number = 6, wordLength: number = 5): WordleAppState {
        return {
            engine: WordleEngine.initialize(maxGuesses, wordLength),
            app: {
                maxGuesses,
                wordLength,
                guessIndex: 0,
                characterIndex: 0,
                guesses: [],
                results: [],
                isGameOver: false,
                answer: null,
            },
        };
    },

    /** loads data for the engine */
    loadData(
        state: WordleAppState,
        guesses: Set<string>,
        answers: Set<string>
    ): WordleAppState {
        return {
            engine: WordleEngine.loadData(state.engine, guesses, answers),
            app: state.app,
        };
    },

    /** resets the application by removing all guesses and characters */
    newGame(state: WordleAppState): WordleAppState {
        return {
            engine: WordleEngine.newGame(state.engine),
            app: {
                ...state.app,
                guessIndex: 0,
                characterIndex: 0,
                guesses: [],
                results: [],
                isGameOver: false,
                answer: null,
            },
        };
    },

    /** adds a single character to the active guess if possible */
    addCharacter(state: WordleAppState, character: string): WordleAppState {
        return state;
    },

    /** removes the last character from the active guess if possible */
    removeCharacter(state: WordleAppState): WordleAppState {
        return state;
    },

    /** attempts to submit the guess, returns the result if valid */
    submitGuess(state: WordleAppState): WordleAppState {
        return state;
    },
};
