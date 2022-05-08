import { WordleEngine } from '../interfaces/WordleEngine';
import { CharacterStatus } from '../types/CharacterStatus';
import { GuessResult } from '../types/GuessResult';

/** state of the application for any ui to use */
interface WordleAppState {
    readonly isReadyForData: boolean;
    readonly isDataLoaded: boolean;
    readonly isReady: boolean;
    readonly maxGuesses: number;
    readonly wordLength: number;
    readonly guesses: Array<string>;
    readonly results: Array<GuessResult>;
    readonly isGameOver: boolean;
    readonly answer: string | null;
    readonly characterStatus: CharacterStatus;
}

/** methods for setting up the wordle app */
interface WordleAppSetup {
    /** sets the wordle engine to use */
    setWordleEngine(wordleEngine: WordleEngine): WordleApp;
    /** sets properties for the app to use */
    setProperties(maxGuesses: number, wordLength: number): WordleApp;
    /** gives the ability to load data asynchronously */
    loadData(guesses: Set<string>, answers: Set<string>): WordleApp;
}

/** methods for callable actions from the app */
interface WordleAppActions {
    /** resets the application by removing all guesses and characters */
    newGame(): WordleApp;
    /** adds a single character to the active guess if possible */
    addCharacter(character: string): WordleApp;
    /** removes the last character from the active guess if possible */
    removeCharacter(): WordleApp;
    /** attempts to submit the guess, returns the result if valid */
    submitGuess(): WordleApp;
}

/** methods for interacting with a wordle application */
export interface WordleApp
    extends WordleAppActions,
        WordleAppSetup,
        WordleAppState {}
