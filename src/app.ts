import { WordleApp } from './interfaces/WordleApp';
import { WordleAppImplementation } from './logic/WordleAppImplementation';
import { WordleLogicImplementation } from './logic/WordleLogicImplementation';

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

/** called on document load */
const main = (): void => {
    // initialize world logic
    const wordleLogic = new WordleLogicImplementation();
    // ...

    // initialize the app
    const wordleApp = new WordleAppImplementation();
    const initialState = wordleApp.initialize(wordleLogic);

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
        } else if (event.code === 'Tab') {
            nextState = wordleApp.reset();
        } else {
            // console.log(`unhandled key event: ${event.code}`);
            // console.log(event);
        }
        updateStateUI(nextState);
    });
};

main();
