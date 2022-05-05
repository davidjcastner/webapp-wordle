import { WordleAppImplementation } from './logic/WordleAppImplementation';
import { WordleEngineImplementation } from './logic/WordleEngineImplementation';

const keyCodeToLetter = {
    KeyA: 'A',
    KeyB: 'B',
    KeyC: 'C',
    KeyD: 'D',
    KeyE: 'E',
    KeyF: 'F',
    KeyG: 'G',
    KeyH: 'H',
    KeyI: 'I',
    KeyJ: 'J',
    KeyK: 'K',
    KeyL: 'L',
    KeyM: 'M',
    KeyN: 'N',
    KeyO: 'O',
    KeyP: 'P',
    KeyQ: 'Q',
    KeyR: 'R',
    KeyS: 'S',
    KeyT: 'T',
    KeyU: 'U',
    KeyV: 'V',
    KeyW: 'W',
    KeyX: 'X',
    KeyY: 'Y',
    KeyZ: 'Z',
};

/** renders a json like object as an html element */
const jsonElement = (obj: any): HTMLElement => {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.innerText = JSON.stringify(obj, null, 4);
    pre.appendChild(code);
    return pre;
};

/** displays the current state as json */
const updateStateUI = (state: any): void => {
    let uiStateElement = document.getElementById('ui-state');
    if (!uiStateElement) {
        uiStateElement = document.createElement('div');
        uiStateElement.id = 'ui-state';
        document.body.append(uiStateElement);
    }
    uiStateElement.innerHTML = '';
    uiStateElement.append(jsonElement(state));
};

/** fetches a list of words to use */
const getWordSet = async (url: string): Promise<Set<string>> => {
    const response = await fetch(url);
    const text = await response.text();
    const words = text
        .split('\n')
        .map((word) => word.trim().toUpperCase())
        .filter((word) => word.length > 0);
    return new Set(words);
};

/** called on document load */
const main = async (): Promise<void> => {
    // load ui first before loading data for the engine
    // this ensures there is something to render and view
    // even if its a loading spinner
    // ...

    // load data for the engine
    const maxGuesses = 6;
    const wordLength = 5;
    const allowedGuesses = await getWordSet('assets/allowed_guesses.txt');
    const allowedAnswers = await getWordSet('assets/allowed_answers.txt');

    // initialize world logic
    const wordleEngine = new WordleEngineImplementation();
    wordleEngine.setMaxGuesses(maxGuesses);
    wordleEngine.setWordLength(wordLength);
    wordleEngine.setAllowedGuesses(allowedGuesses);
    wordleEngine.setAllowedAnswers(allowedAnswers);

    // initialize the app
    const wordleApp = new WordleAppImplementation();
    const initialState = wordleApp.initialize(wordleEngine);

    // bind wordle app to the ui
    // ...

    // initialize the ui
    updateStateUI(initialState);

    // dummy bindings for testing
    document.addEventListener('keydown', (event) => {
        let nextState = wordleApp.getState();
        if (event.code === 'Backspace') {
            nextState = wordleApp.removeCharacter();
        } else if (event.code === 'Enter') {
            nextState = wordleApp.submitGuess();
        } else if (event.code in keyCodeToLetter) {
            const letter = keyCodeToLetter[event.code];
            nextState = wordleApp.addCharacter(letter);
        } else if (event.code === 'Slash') {
            nextState = wordleApp.newGame();
        } else {
            // console.log(`unhandled key event: ${event.code}`);
            // console.log(event);
        }
        updateStateUI(nextState);
    });
};

main();
