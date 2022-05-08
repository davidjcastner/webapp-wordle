import { FC, useEffect, useReducer, useState } from 'react';
import { keycodeLookup } from './data/keycodeLookup';
import { ActionType } from './enums/actionType';
import { WordleAppState } from './types/WordleAppState';
import './debugger.css';
import { WordleAppImplementation } from './logic/WordleAppImplementation';

const WordleApp = WordleAppImplementation;
type Reducer = (
    state: WordleAppState,
    action: { type: ActionType; payload?: any }
) => WordleAppState;
const reducer: Reducer = (state, action) => {
    switch (action.type) {
        case ActionType.NEW_GAME:
            return WordleApp.newGame(state);
        case ActionType.ADD_CHARACTER:
            const character = action.payload;
            return WordleApp.addCharacter(state, character);
        case ActionType.REMOVE_CHARACTER:
            return WordleApp.removeCharacter(state);
        case ActionType.SUBMIT_GUESS:
            return WordleApp.submitGuess(state);
        default:
            console.log(`Unknown action type: ${action.type}`);
            return state;
    }
};
const initialState: WordleAppState = WordleApp.initialize();

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
        } else if (code in keycodeLookup) {
            action = {
                type: ActionType.ADD_CHARACTER,
                payload: keycodeLookup[code],
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
