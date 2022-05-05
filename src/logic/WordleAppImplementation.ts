import { WordleApp } from '../interfaces/WordleApp';
import { WordleLogic } from '../interfaces/WordleLogic';
import { WordleAppState } from '../types/WordleAppState';

/** all characters allowed in the wordle app */
const VALID_CHARACTERS = new Set([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);

/** implementation of the WordleApp */
export class WordleAppImplementation implements WordleApp {
    private isInitialized = false;
    private wordleLogic: WordleLogic;
    private state: WordleAppState;

    /** ensures that the proper initialization has occurred */
    private validateInitialization(): void {
        if (!this.isInitialized) {
            throw new Error('WordleApp must be initialized before use');
        }
    }

    /** sets the state to the appropriate initial values,
     * can be used to reset the state for a new game */
    private initializeState(): void {
        this.state = {
            maxGuesses: this.wordleLogic.getMaxGuesses(),
            wordLength: this.wordleLogic.getWordLength(),
            guessIndex: 0,
            characterIndex: 0,
            guesses: [],
            results: [],
            isGameOver: false,
            answer: null,
        };
    }

    /** gives the app access to a WordleLogic implementation */
    initialize(wordleLogic: WordleLogic): WordleAppState {
        this.wordleLogic = wordleLogic;
        this.initializeState();
        this.isInitialized = true;
        return this.state;
    }

    /** returns the current state */
    getState(): WordleAppState {
        this.validateInitialization();
        return this.state;
    }

    /** resets the application by removing all guesses and characters */
    reset(): WordleAppState {
        this.validateInitialization();
        this.initializeState();
        this.wordleLogic.newGame();
        return this.state;
    }

    /** checks if a character is able to be added in te current state */
    private canAddCharacter(): boolean {
        return (
            !this.state.isGameOver &&
            this.state.characterIndex < this.state.wordLength
        );
    }

    /** checks if the input character is valid */
    private isValidCharacter(character: string): boolean {
        return VALID_CHARACTERS.has(character);
    }

    /** adds a single character to the active guess if possible */
    addCharacter(character: string): WordleAppState {
        this.validateInitialization();
        // check if able to add a character
        if (!this.canAddCharacter()) {
            throw new Error('Cannot add character');
        }
        // check if the character is valid
        if (!this.isValidCharacter(character)) {
            throw new Error(`Character "${character}" is not valid`);
        }
        // add the character to the active guess
        const newGuesses = [...this.state.guesses];
        if (this.state.guessIndex === newGuesses.length) {
            newGuesses.push(character);
        } else {
            newGuesses[this.state.guessIndex] += character;
        }
        this.state = {
            ...this.state,
            guesses: newGuesses,
            characterIndex: this.state.characterIndex + 1,
        };
        return this.state;
    }

    /** checks if a character can be removed from the active guess */
    private canRemoveCharacter(): boolean {
        return !this.state.isGameOver && this.state.characterIndex > 0;
    }

    /** removes the last character from the active guess if possible */
    removeCharacter(): WordleAppState {
        this.validateInitialization();
        // check if there is a character to remove, if so remove it
        if (!this.canRemoveCharacter()) {
            throw new Error('Cannot remove character');
        }
        // remove the last character from the active guess
        const newGuesses = [...this.state.guesses];
        if (this.state.characterIndex === 1) {
            newGuesses.pop();
        } else {
            newGuesses[this.state.guessIndex] = newGuesses[
                this.state.guessIndex
            ].slice(0, -1);
        }
        this.state = {
            ...this.state,
            guesses: newGuesses,
            characterIndex: this.state.characterIndex - 1,
        };
        return this.state;
    }

    /** checks if there a fully complete guess ready to submit */
    private isGuessReady(): boolean {
        return this.state.characterIndex === this.state.wordLength;
    }

    /** attempts to submit the guess, returns the result if valid */
    submitGuess(): WordleAppState {
        this.validateInitialization();
        // check if there is a complete guess to submit
        if (!this.isGuessReady()) {
            throw new Error('Guess is incomplete');
        }
        // get the current guess
        const guess = this.state.guesses[this.state.guesses.length - 1];
        // check if the completed guess is an allowed guess
        if (!this.wordleLogic.isAllowedGuess(guess)) {
            throw new Error(`Guess "${guess}" is not allowed`);
        }
        // get the result of the guess
        const result = this.wordleLogic.makeGuess(guess);
        // add the guess result to the next state
        this.state = {
            ...this.state,
            results: [...this.state.results, result],
            guessIndex: this.state.guessIndex + 1,
            characterIndex: 0,
        };
        // check if the game is over, update state if so
        if (this.wordleLogic.isGameOver()) {
            this.state = {
                ...this.state,
                isGameOver: true,
                answer: this.wordleLogic.getAnswer(),
            };
        }
        return this.state;
    }
}
