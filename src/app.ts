// import './style.css';

// function main(): void {
//     // settings
//     const guesses = 6;
//     const wordLength = 5;

//     // app hook
//     const app = document.getElementById('app');
//     console.log(app);

//     // create the title bar
//     const titleBar = document.createElement('div');
//     titleBar.className = 'title-bar';
//     titleBar.innerHTML = 'Wordle';
//     app.appendChild(titleBar);

//     // create the guess area
//     const guessArea = document.createElement('div');
//     guessArea.className = 'guess-area';
//     for (let i = 0; i < guesses; i++) {
//         const guess = document.createElement('div');
//         guess.className = 'guess';
//         guessArea.appendChild(guess);
//         for (let j = 0; j < wordLength; j++) {
//             const letter = document.createElement('div');
//             letter.className = 'letter';
//             guess.appendChild(letter);
//         }
//     }
//     app.appendChild(guessArea);

//     // create a clickable keyboard
//     const keyboard = document.createElement('div');
//     keyboard.className = 'keyboard';
//     app.appendChild(keyboard);
// }

// main();

// const keyCodeToLetter = {
//     KeyA: 'A',
//     KeyB: 'B',
//     KeyC: 'C',
//     KeyD: 'D',
//     KeyE: 'E',
//     KeyF: 'F',
//     KeyG: 'G',
//     KeyH: 'H',
//     KeyI: 'I',
//     KeyJ: 'J',
//     KeyK: 'K',
//     KeyL: 'L',
//     KeyM: 'M',
//     KeyN: 'N',
//     KeyO: 'O',
//     KeyP: 'P',
//     KeyQ: 'Q',
//     KeyR: 'R',
//     KeyS: 'S',
//     KeyT: 'T',
//     KeyU: 'U',
//     KeyV: 'V',
//     KeyW: 'W',
//     KeyX: 'X',
//     KeyY: 'Y',
//     KeyZ: 'Z',
// };

// event listener
// document.addEventListener('keydown', (event: KeyboardEvent) => {
//     if (event.code in keyCodeToLetter) {
//         console.log('letter', keyCodeToLetter[event.code]);
//     } else if (event.code === 'Backspace') {
//         console.log('backspace');
//     } else if (event.code === 'Enter') {
//         console.log('Enter');
//     } else {
//         console.log(event);
//     }
// });

/** possible result for an individual letter */
enum LetterResult {
    WRONG = 'wrong',
    CLOSE = 'close',
    MATCH = 'match',
}

/** result for each letter in a guess */
type GuessResult = Array<LetterResult>;

/** interface for the logic of wordle */
interface Wordle {
    /** updates the number of max guesses */
    setMaxGuesses(guesses: number): void;
    /** sets the word length */
    setWordLength(length: number): void;
    /** returns the total number of guesses for a single game */
    getMaxGuesses(): number;
    /** returns the number of letters in the answer and each guess */
    getWordLength(): number;
    /** returns the number of guesses remaining */
    getRemainingGuesses(): number;
    /** checks if words in a set meet word length and character conditions */
    isValidWordSet(words: Set<string>): boolean;
    /** updates the set of all allowed guesses */
    setAllowedGuesses(guesses: Set<string>): void;
    /** updates the set of all allowed answers,
     * each allowed answer must also be an allowed guess */
    setAllowedAnswers(answers: Set<string>): void;
    /** returns the set of all allowed guesses */
    getAllowedGuesses(): Set<string>;
    /** returns the set of all allowed answers */
    getAllowedAnswers(): Set<string>;
    /** resets the class for a new game */
    newGame(): void;
    /** checks if the answer is in the set of acceptable answers */
    isValidAnswer(answer: string): boolean;
    /** sets the answer for the game, must not have any guesses made */
    setAnswer(answer: string): void;
    /** sets the answer as a random valid answer */
    generateRandomAnswer(): void;
    /** checks if any game over conditions are met */
    isGameOver(): boolean;
    /** returns true if the answer was guesses, assumes that the game is over */
    isWin(): boolean;
    /** returns the score of current game,
     * assumes that the game is over and that the answer was guesses */
    getScore(): number;
    /** checks if a guess can still be made */
    canMakeGuess(): boolean;
    /** checks if the guess is in the set of acceptable guesses */
    isValidGuess(guess: string): boolean;
    /** makes a guess for the current game and returns the result,
     * assumes that the game is not over and that a guess can still be made */
    makeGuess(guess: string): GuessResult;
    /** returns the previous guesses */
    getPreviousGuesses(): Array<string>;
    /** returns the previous results */
    getPreviousResults(): Array<GuessResult>;
    /** gets the remaining possible words
     * based on results from previous guesses */
    getRemainingWords(): Set<string>;
}

enum ActionName {}
type Action = {
    event: ActionName;
    payload: any;
};

/** interface for interacting with a wordle application,
 * it handles bindings and events */
interface WordleUI {}

const SETTINGS = {
    MAX_GUESSES: 6,
    WORD_LENGTH: 5,
};

/** generates a wordle implementation */
const wordleFactory = (
    maxGuesses: number,
    wordLength: number,
    allowedGuesses: Set<string>,
    allowedAnswers: Set<string>
): Wordle => {
    // const wordle: Wordle = new WordleImplementation();
    const wordle: Wordle = null;
    wordle.setMaxGuesses(maxGuesses);
    wordle.setWordLength(wordLength);
    wordle.setAllowedGuesses(allowedGuesses);
    wordle.setAllowedAnswers(allowedAnswers);
    return wordle;
};

/** runs the application on page load */
const main = () => {
    // read or load the set of allowed guesses
    const allowedGuesses = new Set<string>();
    // read or load the set of allowed answers
    const allowedAnswers = new Set<string>();
    // create the wordle
    const wordle = wordleFactory(
        SETTINGS.MAX_GUESSES,
        SETTINGS.WORD_LENGTH,
        allowedGuesses,
        allowedAnswers
    );
};

// start the application
main();
