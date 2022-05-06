import { FC, useEffect, useState } from "react";
import { WordleProvider } from "../context/wordle";
import { AppData } from "./AppData";
import { GuessArea } from "./GuessArea";
import { Keyboard } from "./Keyboard";
import { WordleAppImplementation } from "../logic/WordleAppImplementation";
import { WordleEngineImplementation } from "../logic/WordleEngineImplementation";
import { WordleApp } from "../interfaces/WordleApp";
import { WordleEngine } from "../interfaces/WordleEngine";

/** fetches a set of words to use */
const getWordSet = (url:string, callback: (words: Set<string>) => void): void => {
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const words = text
                .split('\n')
                .map((word) => word.trim().toUpperCase())
                .filter((word) => word.length > 0);
            callback(new Set(words));
        });
}

/** sets up wordle context for the app */
export const App: FC = () => {
    // state for effects and components
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [allowedGuesses, setAllowedGuesses] = useState<Set<string> | null>(null);
    const [allowedAnswers, setAllowedAnswers] = useState<Set<string> | null>(null);
    const [wordleEngine, setWordleEngine] = useState<WordleEngine>(new WordleEngineImplementation());
    const [wordleApp, setWordleApp] = useState<WordleApp>(new WordleAppImplementation())

    // finalize initialization of engine and app after data is loaded
    useEffect(() => {
        // skip if data is not loaded
        if (!(allowedGuesses && allowedAnswers)) { return }
        console.log('initializing engine and app');
    
        // constants for the engine
        // NOTE: these are hardcoded for now
        const maxGuesses = 6;
        const wordLength = 5;

        // initialize world engine
        wordleEngine.setMaxGuesses(maxGuesses);
        wordleEngine.setWordLength(wordLength);
        wordleEngine.setAllowedGuesses(allowedGuesses);
        wordleEngine.setAllowedAnswers(allowedAnswers);

        // initialize the app
        wordleApp.initialize(wordleEngine);
        console.log(wordleApp)

        // data is now loaded and initialization is complete
        setIsDataLoaded(true);
    }, [allowedGuesses, allowedAnswers]);

    // load data for the app
    getWordSet('assets/allowed_guesses.txt', setAllowedGuesses);
    getWordSet('assets/allowed_answers.txt', setAllowedAnswers);

    return <WordleProvider wordleApp={wordleApp} isDataLoaded={isDataLoaded}>
        <div id='invalid-screen'>
            <h1>Error Displaying Content</h1>
            <p>Sorry, the app does not support the current viewing width.</p>
            <p>Please increase the view width, zoom out, or view on another device.</p>
        </div>
        <div id='app'>
            <div className='title-bar'>
                <h1>Wordle</h1>
            </div>
            <GuessArea />
            <Keyboard />
        </div>
        <AppData/>
    </WordleProvider>
}