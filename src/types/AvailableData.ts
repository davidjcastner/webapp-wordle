import { GuessResult } from '../types/GuessResult';

/** information available to bots */
export type AvailableData = {
    maxGuesses: number;
    wordLength: number;
    guesses: Array<string>;
    results: Array<GuessResult>;
    isGameOver: boolean;
    answer: string | null;
};
