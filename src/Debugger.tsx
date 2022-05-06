import { FC, useEffect, useReducer, useState } from 'react';
import './debugger.css';

/** helper lookup for event.code to character */
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

/** action types */
enum ActionType {
    NEW_GAME = 'NEW_GAME',
    ADD_CHARACTER = 'ADD_CHARACTER',
    REMOVE_CHARACTER = 'REMOVE_CHARACTER',
    SUBMIT_GUESS = 'SUBMIT_GUESS',
}
const initialState = {};
const reducer = (state, action) => state;

/** only displays the current state of the application for debugging */
export const Debugger: FC = () => {
    // setup reducer
    const [state, dispatch] = useReducer(reducer, initialState);
    const [lastAction, setLastAction] = useState({});

    // bind dispatch to event handler
    const keydownHandler = (event: KeyboardEvent): void => {
        const code = event.code;
        let action;
        // check if actionable key
        if (code === 'Slash') {
            action = { type: ActionType.NEW_GAME };
        } else if (code in keyCodeToLetter) {
            action = {
                type: ActionType.ADD_CHARACTER,
                payload: keyCodeToLetter[code],
            };
        } else if (code === 'Backspace') {
            action = { type: ActionType.REMOVE_CHARACTER };
        } else if (code === 'Enter') {
            action = { type: ActionType.SUBMIT_GUESS };
        }
        // if actionable key, set last action and dispatch
        if (action) {
            setLastAction(action);
            dispatch(action);
        }
    };

    // add event listener when app is ready
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
    }, []);

    // create a debug string for what needs debugging
    const debugObject = { action: lastAction, state };
    const debugString = JSON.stringify(debugObject, null, 4);

    // return debugger component
    return (
        <div className='debugger'>
            <pre>{debugString}</pre>
        </div>
    );
};
