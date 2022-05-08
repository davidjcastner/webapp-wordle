import { FC, useEffect, useState } from 'react';
import { AppData } from '../components/AppData';
import { GuessArea } from '../components/GuessArea';
import { Keyboard } from '../components/Keyboard';
import { Loading } from '../components/Loading';
import { useWordle, WordleProvider } from '../context/wordle';
import { fetchWordSet } from '../data/fetchWordSet';
import { ActionType } from '../enums/actionType';

/** the type of data loaded */
type Data = Set<string>;

/** the world application provided with context */
const AppWithContext: FC = () => {
    // get context
    const { app, dispatch } = useWordle();
    const [allowedGuesses, setAllowedGuesses] = useState<Data>(null);
    const [allowedAnswers, setAllowedAnswers] = useState<Data>(null);

    // initialize app and engine and start loading data
    // called once on mount
    useEffect(() => {
        const maxGuesses = 6;
        const wordLength = 5;
        const nextApp = app.setProperties(maxGuesses, wordLength);
        dispatch({ type: ActionType.INITIALIZE, payload: nextApp });
        fetchWordSet('/assets/allowed_guesses.txt', setAllowedGuesses);
        fetchWordSet('/assets/allowed_answers.txt', setAllowedAnswers);
    }, []);

    // once data is loaded, attach it to the app
    // called once ready to load
    useEffect(() => {
        if (app.isReadyForData && allowedGuesses && allowedAnswers) {
            const nextApp = app.loadData(allowedGuesses, allowedAnswers);
            dispatch({ type: ActionType.INITIALIZE, payload: nextApp });
        }
    }, [app.isReadyForData, allowedGuesses, allowedAnswers]);

    // start a new game once the data has been loaded
    useEffect(() => {
        app.isDataLoaded && dispatch({ type: ActionType.NEW_GAME });
    }, [app.isDataLoaded]);

    // the layout of the application
    return (
        <>
            <div id='invalid-screen'>
                <h1>Error Displaying Content</h1>
                <p>
                    Sorry, the app does not support the current viewing width.
                </p>
                <p>
                    Please increase the view width, zoom out, or view on another
                    device.
                </p>
            </div>
            <div id='app'>
                <AppData />
                <div className='title-bar'>
                    <h1>Wordle</h1>
                </div>
                {!app.isReady && <Loading />}
                {app.isReady && <GuessArea />}
                {app.isReady && <Keyboard />}
            </div>
        </>
    );
};

/** wraps the app with any provider so that inner components have access to the context */
export const App: FC = () => {
    return (
        <WordleProvider>
            <AppWithContext />
        </WordleProvider>
    );
};
