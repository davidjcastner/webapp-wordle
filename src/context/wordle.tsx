import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { WordleApp } from "../interfaces/WordleApp";
import { WordleContext } from "../interfaces/WordleContext";

/** dummy context for initialization */
const initialContext: WordleContext = {
    isReady: false,
    state: {
        maxGuesses: 6,
        wordLength: 5,
        guessIndex: 0,
        characterIndex: 0,
        guesses: [],
        results: [],
        isGameOver: false,
        answer: null
    },
    newGame: () => {},
    addCharacter: (c) => {},
    removeCharacter: () => {},
    submitGuess: () => {}
};

/** context for world app */
const WordleCtx = createContext<WordleContext>(initialContext);

/** hook to provide context to various components */
export const useWordle = (): WordleContext => useContext(WordleCtx);

/** provider to wrap app components in */
export const WordleProvider: FC<{wordleApp: WordleApp, isDataLoaded: boolean, children?: ReactNode}> = ({wordleApp, isDataLoaded, children}) => {
    const [state, setState] = useState<WordleContext>(initialContext);
    // setup actions
    useEffect(() => {
        setState((previousState) => ({
            ...previousState,
            newGame: () => {setState((previous) => ({...previous, state: wordleApp.newGame()}))},
            addCharacter: (c) => {setState((previous) => ({...previous, state: wordleApp.addCharacter(c)}))},
            removeCharacter: () => {setState((previous) => ({...previous, state: wordleApp.removeCharacter()}))},
            submitGuess: () => {setState((previous) => ({...previous, state: wordleApp.submitGuess()}))}
        }))
    }, [])
    // setup state based on data load
    useEffect(() => {
        isDataLoaded && setState((previous) => ({...previous, isReady: isDataLoaded, state: wordleApp.getState()}));
    }, [isDataLoaded])
    return <WordleCtx.Provider value={state}>{children}</WordleCtx.Provider>;
}