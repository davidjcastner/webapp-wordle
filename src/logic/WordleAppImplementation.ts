import { VALID_CHARACTERS } from '../data/ValidCharacters';
import { LetterStatus } from '../enums/LetterStatus';
import { WordleApp } from '../interfaces/WordleApp';
import { WordleEngine } from '../interfaces/WordleEngine';
import { CharacterStatus } from '../types/CharacterStatus';
import { GuessResult } from '../types/GuessResult';

/** create an initial character status with all status set to unknown */
const createStatus = (): CharacterStatus => {
    const status = {};
    [...VALID_CHARACTERS].forEach((character) => {
        status[character] = LetterStatus.UNSET;
    });
    return status;
};

/**
 * properly updates the character status:
 * the status should be MATCH if the letter was correct at any point,
 * the status should be CLOSE if not a match but in wrong position at any point,
 * the status should be WRONG if the letter doesn't exist at all
 */
const updateStatus = (
    status: CharacterStatus,
    guess: string,
    result: GuessResult
): CharacterStatus => {
    const newStatus = { ...status };
    // create a map of letter to letter result
    const letterMap: Record<string, LetterStatus> = {};
    [...guess].forEach((letter, index) => {
        const letterResult = result[index];
        const letterMapResult: LetterStatus | undefined = letterMap[letter];
        switch (letterResult) {
            case LetterStatus.MATCH:
                letterMap[letter] = LetterStatus.MATCH;
                break;
            case LetterStatus.CLOSE:
                if (letterMapResult !== LetterStatus.MATCH) {
                    letterMap[letter] = LetterStatus.CLOSE;
                }
                break;
            case LetterStatus.WRONG:
                if (letterMapResult === undefined) {
                    letterMap[letter] = LetterStatus.WRONG;
                }
                break;
        }
    });
    // update the status
    for (const [letter, result] of Object.entries(letterMap)) {
        newStatus[letter] = result;
    }
    return newStatus;
};

/** creates a character status with the answer in match status */
const finalStatus = (answer: string): CharacterStatus => {
    const matches = new Set([...answer]);
    const status = {};
    [...VALID_CHARACTERS].forEach((char) => {
        status[char] = matches.has(char)
            ? LetterStatus.MATCH
            : LetterStatus.WRONG;
    });
    return status;
};

/** helper function for clarity */
const removeLastCharacter = (str: string): string => str.slice(0, -1);

/** methods for interacting with a wordle application */
export class WordleAppImplementation implements WordleApp {
    // public properties
    isReadyForData: boolean = false;
    isDataLoaded: boolean = false;
    isReady: boolean = false;
    maxGuesses: number = 1;
    wordLength: number = 1;
    guesses: Array<string> = [];
    results: Array<GuessResult> = [];
    isGameOver: boolean = false;
    answer: string | null = null;
    characterStatus: CharacterStatus = createStatus();

    // private properties
    private engine: WordleEngine;
    private guessIndex: number = 0;
    private characterIndex: number = 0;

    /** utility methods for creating a copy of a class instance,
     * helps to keep the class immutable */
    private copy(): WordleAppImplementation {
        const copy = new WordleAppImplementation();
        copy.isReadyForData = this.isReadyForData;
        copy.isDataLoaded = this.isDataLoaded;
        copy.isReady = this.isReady;
        copy.maxGuesses = this.maxGuesses;
        copy.wordLength = this.wordLength;
        copy.guesses = this.guesses;
        copy.results = this.results;
        copy.isGameOver = this.isGameOver;
        copy.answer = this.answer;
        copy.characterStatus = this.characterStatus;
        copy.engine = this.engine;
        copy.guessIndex = this.guessIndex;
        copy.characterIndex = this.characterIndex;
        return copy;
    }

    // setup methods
    /** sets the wordle engine to use */
    setWordleEngine(wordleEngine: WordleEngine): WordleApp {
        const copy = this.copy();
        copy.engine = wordleEngine;
        return copy;
    }
    /** sets properties for the app to use */
    setProperties(maxGuesses: number, wordLength: number): WordleApp {
        const copy = this.copy();
        copy.maxGuesses = maxGuesses;
        copy.wordLength = wordLength;
        copy.engine = copy.engine.setProperties(maxGuesses, wordLength);
        copy.isReadyForData = true;
        return copy;
    }
    /** gives the ability to load data asynchronously */
    loadData(guesses: Set<string>, answers: Set<string>): WordleApp {
        // check if the app is ready to load data
        if (!this.isReadyForData) {
            throw new Error('App is not ready to load data');
        }
        const copy = this.copy();
        copy.engine = copy.engine.loadData(guesses, answers);
        copy.isDataLoaded = true;
        return copy;
    }

    // action methods
    /** resets the application by removing all guesses and characters */
    newGame(): WordleApp {
        // check that data has been loaded
        if (!this.isDataLoaded) {
            throw new Error('Data has not been loaded');
        }
        const copy = this.copy();
        copy.isReady = true;
        copy.guesses = [];
        copy.results = [];
        copy.isGameOver = false;
        copy.answer = null;
        copy.guessIndex = 0;
        copy.characterIndex = 0;
        copy.characterStatus = createStatus();
        copy.engine = copy.engine.newGame();
        return copy;
    }
    /** checks if a character is able to be added in the current state */
    private canAddCharacter(): boolean {
        return !this.isGameOver && this.characterIndex < this.wordLength;
    }
    /** checks if the input character is valid */
    private isValidCharacter(character: string): boolean {
        return VALID_CHARACTERS.has(character);
    }
    /** adds a single character to the active guess if possible */
    addCharacter(character: string): WordleApp {
        // check if able to add a character
        if (!this.canAddCharacter()) {
            throw new Error('Cannot add character');
        }
        // check if the character is valid
        if (!this.isValidCharacter(character)) {
            throw new Error(`Character "${character}" is not valid`);
        }
        // add the character to the active guess
        // create copy of guesses to avoid mutation
        const copy = this.copy();
        copy.guesses = [...this.guesses];
        // if guess index is equal to the length of the guesses,
        // add the character as a new string to the guesses.
        // this works because the index is out of bounds,
        // meaning the guess is empty.
        // otherwise, add the character to the existing string
        if (copy.guessIndex === copy.guesses.length) {
            copy.guesses.push(character);
        } else {
            copy.guesses[copy.guessIndex] += character;
        }
        // update character index
        copy.characterIndex++;
        // return the copy
        return copy;
    }
    /** checks if a character can be removed from the active guess */
    private canRemoveCharacter(): boolean {
        return !this.isGameOver && this.characterIndex > 0;
    }
    /** removes the last character from the active guess if possible */
    removeCharacter(): WordleApp {
        // check if there is a character to remove, if so remove it
        if (!this.canRemoveCharacter()) {
            throw new Error('Cannot remove character');
        }
        // create copy of guesses to avoid mutation
        const copy = this.copy();
        copy.guesses = [...this.guesses];
        // if the character index is one,
        // remove the entire string from guesses.
        // otherwise, remove the last character from the string
        if (copy.characterIndex === 1) {
            copy.guesses.pop();
        } else {
            copy.guesses[copy.guessIndex] = removeLastCharacter(
                copy.guesses[copy.guessIndex]
            );
        }
        // update character index
        copy.characterIndex--;
        // return the copy
        return copy;
    }
    /** checks if there a fully complete guess ready to submit */
    private isGuessReady(): boolean {
        return this.characterIndex === this.wordLength;
    }
    /** attempts to submit the guess, returns the result if valid */
    submitGuess(): WordleApp {
        // check if there is a complete guess to submit
        if (!this.isGuessReady()) {
            throw new Error('Guess is incomplete');
        }
        // get the current guess
        const guess = this.guesses[this.guessIndex];
        // check if the completed guess is an allowed guess
        if (!this.engine.isAllowedGuess(guess)) {
            throw new Error(`Guess "${guess}" is not allowed`);
        }
        // create copy of results to avoid mutation
        const copy = this.copy();
        copy.results = [...copy.results];
        // get the result of the guess
        copy.engine = copy.engine.makeGuess(guess);
        const result = copy.engine.getLastResult();
        // add the result to the results and update indexes
        copy.results.push(result);
        copy.guessIndex++;
        copy.characterIndex = 0;
        // update the character status
        copy.characterStatus = updateStatus(
            copy.characterStatus,
            guess,
            result
        );
        // check if the game is over
        // there are two conditions for a game being over
        // 1. the max guess limit had been reached
        // 2. the guess was correct
        copy.isGameOver =
            copy.guessIndex === copy.maxGuesses ||
            result.every((res) => res === LetterStatus.MATCH);
        if (copy.isGameOver) {
            copy.answer = copy.engine.getAnswer();
            copy.characterStatus = finalStatus(copy.answer);
        }
        // return the copy
        return copy;
    }
}
