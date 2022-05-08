import { FC, useEffect, useReducer, useState } from 'react';
import { KEYCODE_LOOKUP } from './data/KeycodeLookup';
import { ActionType } from './enums/actionType';
import { WordleApp } from './interfaces/WordleApp';
import { WordleEngine } from './interfaces/WordleEngine';
import { WordleAppImplementation } from './logic/WordleAppImplementation';
import './debugger.css';
import { WordleEngineImplementation } from './logic/WordleEngineImplementation';

// setup for the reducer
type Reducer = (
    state: WordleApp,
    action: { type: ActionType; payload?: any }
) => WordleApp;
const reducer: Reducer = (state, action) => {
    switch (action.type) {
        case ActionType.INITIALIZE:
            return action.payload;
        case ActionType.NEW_GAME:
            return state.newGame();
        case ActionType.ADD_CHARACTER:
            const character = action.payload;
            return state.addCharacter(character);
        case ActionType.REMOVE_CHARACTER:
            return state.removeCharacter();
        case ActionType.SUBMIT_GUESS:
            return state.submitGuess();
        default:
            console.log(`Unknown action type: ${action.type}`);
            return state;
    }
};

/** fetches a set of words to use */
const fetchWordSet = (
    url: string,
    callback: (words: Set<string>) => void
): void => {
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const words = text
                .split('\n')
                .map((word) => word.trim().toUpperCase())
                .filter((word) => word.length > 0);
            callback(new Set(words));
        });
};
const initialState: WordleApp = new WordleAppImplementation();

/** only displays the current state of the application for debugging */
export const Debugger: FC = () => {
    // setup flags for loading actions
    const [allowedGuesses, setAllowedGuesses] = useState(null);
    const [allowedAnswers, setAllowedAnswers] = useState(null);
    // setup reducer
    const [state, dispatch] = useReducer(reducer, initialState);
    const [lastAction, setLastAction] = useState({});

    // initialize the app and engine
    // called once on mount
    useEffect(() => {
        const engine: WordleEngine = new WordleEngineImplementation();
        let app: WordleApp = new WordleAppImplementation();
        app = app.setWordleEngine(engine);
        app = app.setProperties(6, 5);
        dispatch({ type: ActionType.INITIALIZE, payload: app });
        fetchWordSet('/assets/allowed_guesses.txt', setAllowedGuesses);
        fetchWordSet('/assets/allowed_answers.txt', setAllowedAnswers);
    }, []);

    // load data for engine and app
    // called once ready to load
    useEffect(() => {
        if (state.isReadyForData && allowedGuesses && allowedAnswers) {
            const newState = state.loadData(allowedGuesses, allowedAnswers);
            dispatch({ type: ActionType.INITIALIZE, payload: newState });
        }
    }, [state.isReadyForData, allowedGuesses, allowedAnswers]);

    // start a new game once the data has been loaded
    useEffect(() => {
        state.isDataLoaded && dispatch({ type: ActionType.NEW_GAME });
    }, [state.isDataLoaded]);

    // bind dispatch to event handler
    const keydownHandler = (event: KeyboardEvent): void => {
        const code = event.code;
        let action;
        // check if actionable key
        if (code === 'Slash') {
            action = { type: ActionType.NEW_GAME };
        } else if (code in KEYCODE_LOOKUP) {
            action = {
                type: ActionType.ADD_CHARACTER,
                payload: KEYCODE_LOOKUP[code],
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
    // after data has been loaded
    useEffect(() => {
        state.isReady && document.addEventListener('keydown', keydownHandler);
    }, [state.isReady]);

    // create a debug string for what needs debugging
    const debugState = {
        maxGuesses: state.maxGuesses,
        wordLength: state.wordLength,
        guesses: state.guesses,
        results: state.results,
        isGameOver: state.isGameOver,
        answer: state.answer,
        characterStatus: state.characterStatus,
    };
    const debugObject = { action: lastAction, state: debugState };
    const debugString = JSON.stringify(debugObject, null, 4);

    // return debugger component
    return (
        <div className='debugger'>
            <pre>{debugString}</pre>
        </div>
    );
};
