import { GuessResult } from './GuessResult';

/** state of the application for any ui to use */
export type WordleAppState = Readonly<{
    maxGuesses: number;
    wordLength: number;
    guessIndex: number;
    characterIndex: number;
    guesses: Array<string>;
    results: Array<GuessResult>;
    isGameOver: boolean;
    answer: string | null;
}>;
