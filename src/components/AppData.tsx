import { FC } from 'react';
import { useWordle } from '../context/wordle';
import { AvailableData } from '../types/AvailableData';

/** hidden component that provides the state of the game for bots to use */
export const AppData: FC = () => {
    // get the context
    const { app } = useWordle();
    // chose what data is available for bots
    const data: AvailableData = {
        maxGuesses: app.maxGuesses,
        wordLength: app.wordLength,
        guesses: app.guesses,
        results: app.results,
        isGameOver: app.isGameOver,
        answer: app.answer,
    };
    // format the data as a string
    const dataString = JSON.stringify(data);
    // add data to the page
    return <pre>{dataString}</pre>;
};
