import { FC, useEffect, useReducer, useState } from 'react';
import { fetchWordSet } from './data/fetchWordSet';
import { KEYCODE_LOOKUP } from './data/KeycodeLookup';
import { ActionType } from './enums/actionType';
import { WordleApp } from './interfaces/WordleApp';
import { WordleEngine } from './interfaces/WordleEngine';
import { WordleAppImplementation } from './logic/WordleAppImplementation';
import { WordleEngineImplementation } from './logic/WordleEngineImplementation';
import { wordleReducer } from './reducers/wordleReducer';
import './debugger.css';

/** only displays the current state of the application for debugging */
export const Debugger: FC = () => {
    // setup flags for loading actions
    const [allowedGuesses, setAllowedGuesses] = useState(null);
    const [allowedAnswers, setAllowedAnswers] = useState(null);
    // setup reducer
    const [state, dispatch] = useReducer(
        wordleReducer,
        new WordleAppImplementation()
    );
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
