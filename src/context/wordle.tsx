import { createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { WordleApp } from '../interfaces/WordleApp';
import { WordleContext } from '../interfaces/WordleContext';
import { WordleAppImplementation } from '../logic/WordleAppImplementation';
import { WordleEngineImplementation } from '../logic/WordleEngineImplementation';
import { wordleReducer } from '../reducers/wordleReducer';

/** creates the initial app state for the reducer */
const appFactory = (): WordleApp => {
    const app = new WordleAppImplementation();
    const engine = new WordleEngineImplementation();
    return app.setWordleEngine(engine);
};

/** context for world app */
const WordleCtx = createContext(null);

/** hook to provide context to various components */
export const useWordle = (): WordleContext => useContext(WordleCtx);

/** provider to wrap app components in */
export const WordleProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    // setup reducer for child components to use
    const [app, dispatch] = useReducer(wordleReducer, appFactory());
    // format provider value
    const providerValue = { app, dispatch };
    // return provider
    return (
        <WordleCtx.Provider value={providerValue}>
            {children}
        </WordleCtx.Provider>
    );
};
