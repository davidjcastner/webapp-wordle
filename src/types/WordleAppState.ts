import { GuessResult } from './GuessResult';
import { WordleEngineState } from './WordleEngineState';

/** state of the application for any ui to use */
export type WordleAppState = {
    /** internal state for the engine */
    readonly engine: WordleEngineState;
    /** information the app's ui needs for any display */
    readonly app: {
        readonly maxGuesses: number;
        readonly wordLength: number;
        readonly guessIndex: number;
        readonly characterIndex: number;
        readonly guesses: Array<string>;
        readonly results: Array<GuessResult>;
        readonly isGameOver: boolean;
        readonly answer: string | null;
    };
};
