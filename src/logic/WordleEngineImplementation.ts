import { VALID_CHARACTERS } from '../data/ValidCharacters';
import { WordleEngine } from '../interfaces/WordleEngine';
import { calculateResult } from '../logic/calculateResult';
import { GuessResult } from '../types/GuessResult';

/** checks if each character in the word is a valid character */
const isValidWord = (word: string): boolean =>
    [...word].every((char) => VALID_CHARACTERS.has(char));

/** checks if the number is a positive integer */
const isPositiveInteger = (number: number): boolean =>
    number > 0 && Number.isInteger(number);

/** checks if one set is a super set of another */
const isSuperSet = <T>(superSet: Set<T>, subSet: Set<T>): boolean =>
    [...subSet].every((element) => superSet.has(element));

/** interactions available in the wordle engine */
export class WordleEngineImplementation implements WordleEngine {
    // private properties
    private maxGuesses: number = 1;
    private wordLength: number = 1;
    private allowedGuesses: Set<string> = new Set(['A']);
    private allowedAnswers: Set<string> = new Set(['A']);
    private guesses: Array<string> = [];
    private results: Array<GuessResult> = [];
    private answer: string = 'A';

    /** utility methods for creating a copy of a class instance,
     * helps to keep the class immutable */
    private copy(): WordleEngineImplementation {
        const copy = new WordleEngineImplementation();
        copy.maxGuesses = this.maxGuesses;
        copy.wordLength = this.wordLength;
        copy.allowedGuesses = this.allowedGuesses;
        copy.allowedAnswers = this.allowedAnswers;
        copy.guesses = this.guesses;
        copy.results = this.results;
        copy.answer = this.answer;
        return copy;
    }

    /** sets properties for the engine to use */
    setProperties(maxGuesses: number, wordLength: number): WordleEngine {
        // check if the maxGuesses is a positive integer
        if (!isPositiveInteger(maxGuesses)) {
            throw new Error('Max guesses must be a positive integer');
        }
        // check if the wordLength is a positive integer
        if (!isPositiveInteger(wordLength)) {
            throw new Error('Word length must be a positive integer');
        }
        // set the properties
        const copy = this.copy();
        copy.maxGuesses = maxGuesses;
        copy.wordLength = wordLength;
        copy.allowedGuesses = new Set();
        copy.allowedAnswers = new Set();
        copy.answer = null;
        return copy;
    }

    /** checks if words in a set meet word length and character conditions */
    private isValidWordSet(words: Set<string>): boolean {
        return [...words].every(
            (word) => word.length === this.wordLength && isValidWord(word)
        );
    }

    /** gives the ability to load data asynchronously */
    loadData(guesses: Set<string>, answers: Set<string>): WordleEngine {
        // check if the set of guesses is valid
        if (!this.isValidWordSet(guesses)) {
            throw new Error('Guesses must be a set of valid words');
        }
        // check if the set of answers is valid
        // by seeing if each answer is an allowed guess
        if (!isSuperSet(guesses, answers)) {
            throw new Error(
                'Answers must be a set of valid words and each must be an allowed guess'
            );
        }
        // copy each set into a new instance to maintain immutability
        const copy = this.copy();
        copy.allowedGuesses = new Set(guesses);
        copy.allowedAnswers = new Set(answers);
        return copy;
    }

    /** picks a random word from the set of allowed answers */
    private generateRandomAnswer(): string {
        const randomIndex = Math.floor(
            Math.random() * this.allowedAnswers.size
        );
        const randomAnswer = [...this.allowedAnswers][randomIndex];
        return randomAnswer;
    }

    /** resets the engine for a new game */
    newGame(): WordleEngine {
        const copy = this.copy();
        copy.guesses = [];
        copy.results = [];
        copy.answer = copy.generateRandomAnswer();
        return copy;
    }

    /**
     * checks if any game over conditions are met:
     * 1. the number of guesses is equal to the max guesses
     * 2. the answer was guessed
     */
    private isGameOver(): boolean {
        return (
            this.guesses.length === this.maxGuesses ||
            this.guesses.some((guess) => guess === this.answer)
        );
    }

    /** checks if a guess can still be made */
    private canMakeGuess(): boolean {
        if (!this.answer) {
            throw new Error('Answer must be set');
        }
        return !this.isGameOver();
    }

    /** makes and calculate the result of a guess */
    makeGuess(guess: string): WordleEngine {
        // check if a guess can still be made
        // and that the guess is allowed
        if (!this.canMakeGuess()) {
            throw new Error('Game is over or no guesses can be made');
        }
        if (!this.isAllowedGuess(guess)) {
            throw new Error('Guess must be an allowed guess');
        }
        // calculate the result
        const guessResult = calculateResult(guess, this.answer);
        // copy the engine to maintain immutability
        const copy = this.copy();
        copy.guesses = [...copy.guesses, guess];
        copy.results = [...copy.results, guessResult];
        return copy;
    }

    /** checks if the guess is in the set of acceptable guesses */
    isAllowedGuess(guess: string): boolean {
        return this.allowedGuesses.has(guess);
    }

    /** returns the result of the last guess,
     * assumes that at least one guess was made */
    getLastResult(): GuessResult {
        // check that at least one guess was made
        if (this.guesses.length === 0) {
            throw new Error('No guesses have been made');
        }
        // return the last result
        return this.results[this.results.length - 1];
    }

    /** returns the answer for the current game,
     * assumes that the game is over */
    getAnswer(): string {
        // check that the game is over
        if (!this.isGameOver()) {
            throw new Error('Game is not over');
        }
        // return the answer
        return this.answer;
    }
}
