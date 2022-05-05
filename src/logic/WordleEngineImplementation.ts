import { LetterResult } from '../enums/LetterResult';
import { WordleEngine } from '../interfaces/WordleEngine';
import { GuessResult } from '../types/GuessResult';

/** all characters allowed in the wordle app */
const VALID_CHARACTERS = new Set([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);

// helper validation methods
const isValidCharacter = (character: string): boolean =>
    VALID_CHARACTERS.has(character);
const isValidWord = (word: string): boolean =>
    [...word].every(isValidCharacter);
const isPositiveInteger = (number: number): boolean =>
    number > 0 && Number.isInteger(number);

/** interactions available in the wordle engine */
export class WordleEngineImplementation implements WordleEngine {
    private maxGuesses: number;
    private wordLength: number;
    private allowedGuesses: Set<string>;
    private allowedAnswers: Set<string>;
    private isSetMaxGuesses: boolean = false;
    private isSetWordLength: boolean = false;
    private isSetAllowedGuesses: boolean = false;
    private isSetAllowedAnswers: boolean = false;
    private guesses: Array<string> = [];
    private results: Array<GuessResult> = [];
    private answer: string | null;

    /** checks if words in a set meet word length and character conditions */
    isValidWordSet(words: Set<string>): boolean {
        return [...words].every(
            (word) => word.length === this.wordLength && isValidWord(word)
        );
    }

    /** updates the number of max guesses */
    setMaxGuesses(guesses: number): void {
        // check if the number is a positive integer
        if (!isPositiveInteger(guesses)) {
            throw new Error('Number of guesses must be a positive integer');
        }
        this.maxGuesses = guesses;
        this.isSetMaxGuesses = true;
    }

    /** sets the word length */
    setWordLength(length: number): void {
        // check if the number is a positive integer
        if (!isPositiveInteger(length)) {
            throw new Error('Word length must be a positive integer');
        }
        this.wordLength = length;
        this.isSetWordLength = true;
    }

    /** updates the set of all allowed guesses */
    setAllowedGuesses(guesses: Set<string>): void {
        // check if word length has been set
        if (!this.isSetWordLength) {
            throw new Error('Word length must be set');
        }
        // check if the set of guesses is valid
        if (!this.isValidWordSet(guesses)) {
            throw new Error('Guesses must be a set of valid words');
        }
        // copy the set of guesses
        this.allowedGuesses = new Set([...guesses]);
        this.isSetAllowedGuesses = true;
    }

    /** updates the set of all allowed answers,
     * each allowed answer must also be an allowed guess */
    setAllowedAnswers(answers: Set<string>): void {
        // check if guesses have been set
        if (!this.isSetAllowedGuesses) {
            throw new Error('Guesses must be set');
        }
        // check if the set of answers is valid
        if (![...answers].every((word) => this.allowedGuesses.has(word))) {
            throw new Error(
                'Answers must be a set of valid words and each must be an allowed guess'
            );
        }
        // copy the set of answers
        this.allowedAnswers = new Set([...answers]);
        this.isSetAllowedAnswers = true;
    }

    /** ensures that all initialization has taken place */
    private validateInitialization(): void {
        if (
            !(
                this.isSetMaxGuesses &&
                this.isSetWordLength &&
                this.isSetAllowedGuesses &&
                this.isSetAllowedAnswers
            )
        ) {
            throw new Error('Initialization must be complete');
        }
    }

    /** returns the total number of guesses for a single game */
    getMaxGuesses(): number {
        this.validateInitialization();
        return this.maxGuesses;
    }

    /** returns the number of letters in the answer and each guess */
    getWordLength(): number {
        this.validateInitialization();
        return this.wordLength;
    }

    /** returns the number of guesses remaining */
    getAllowedGuesses(): Readonly<Set<string>> {
        this.validateInitialization();
        return this.allowedGuesses;
    }

    /** returns the set of all allowed answers */
    getAllowedAnswers(): Readonly<Set<string>> {
        this.validateInitialization();
        return this.allowedAnswers;
    }

    /** resets the class for a new game */
    getRemainingGuesses(): number {
        this.validateInitialization();
        if (this.guesses === undefined) {
            return this.maxGuesses;
        }
        return this.maxGuesses - this.guesses.length;
    }

    /** checks if the guess is in the set of acceptable guesses */
    isAllowedGuess(guess: string): boolean {
        this.validateInitialization();
        return this.allowedGuesses.has(guess);
    }

    /** checks if the answer is in the set of acceptable answers */
    isAllowedAnswer(answer: string): boolean {
        this.validateInitialization();
        return this.allowedAnswers.has(answer);
    }

    /** returns the set of all allowed guesses */
    newGame(): void {
        this.validateInitialization();
        this.guesses = [];
        this.results = [];
        this.answer = null;
    }

    /** sets the answer for the game, must not have any guesses made */
    setAnswer(answer: string): void {
        if (!this.isAllowedAnswer(answer)) {
            throw new Error('Answer must be an allowed answer');
        }
        this.answer = answer;
    }

    /** sets the answer as a random valid answer */
    generateRandomAnswer(): void {
        this.validateInitialization();
        const randomIndex = Math.floor(
            Math.random() * this.allowedAnswers.size
        );
        const randomAnswer = [...this.allowedAnswers][randomIndex];
        this.answer = randomAnswer;
    }

    /** checks if any game over conditions are met */
    isGameOver(): boolean {
        this.validateInitialization();
        return (
            this.guesses.length > 0 &&
            (this.guesses.length === this.maxGuesses ||
                this.guesses.some((guess) => this.answer === guess))
        );
    }

    /** returns true if the answer was guesses, assumes that the game is over */
    isWin(): boolean {
        this.validateInitialization();
        return this.guesses.some((guess) => this.answer === guess);
    }

    /** returns the score of current game,
     * assumes that the game is over and that the answer was guesses */
    getScore(): number {
        if (!this.isWin()) {
            throw new Error('Game is not over or you did not win');
        }
        return this.guesses.length;
    }

    /** returns the answer the user was attempting to guess,
     * assumes that the game is over */
    getAnswer(): string {
        if (!this.isGameOver()) {
            throw new Error('Game is not over');
        }
        return this.answer;
    }

    /** checks if a guess can still be made */
    canMakeGuess(): boolean {
        if (!this.answer) {
            throw new Error('Answer must be set');
        }
        return !this.isGameOver();
    }

    /** makes a guess for the current game and returns the result,
     * assumes that the game is not over and that a guess can still be made */
    makeGuess(guess: string): Readonly<GuessResult> {
        if (!this.canMakeGuess()) {
            throw new Error('Game is over or no guesses can be made');
        }
        if (!this.isAllowedGuess(guess)) {
            throw new Error('Guess must be an allowed guess');
        }
        this.guesses.push(guess);
        const guessResult = [];
        for (let i = 0; i < this.wordLength; i++) {
            // add a random letter result to the guess result
            const choices = [
                LetterResult.WRONG,
                LetterResult.CLOSE,
                LetterResult.MATCH,
            ];
            const randomIndex = Math.floor(Math.random() * choices.length);
            guessResult.push(choices[randomIndex]);
        }
        this.results.push(guessResult);
        return guessResult;
    }

    /** returns the previous guesses */
    getPreviousGuesses(): Readonly<Array<string>> {
        return this.guesses;
    }
    /** returns the previous results */
    getPreviousResults(): Readonly<Array<GuessResult>> {
        return this.results;
    }
}
