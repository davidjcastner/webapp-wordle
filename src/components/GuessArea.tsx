import { FC } from 'react';
import { useWordle } from '../context/wordle';
import { StatusToClassName } from '../data/StatusToClassName';
import { LetterStatus } from '../enums/LetterStatus';
import { WordleApp } from '../interfaces/WordleApp';

/** information for rendering a letter */
type LetterData = { character: string; status: LetterStatus };

/** helper for getting the letter data from the wordle app */
const getLetterData = (
    app: WordleApp,
    guessIndex: number,
    letterIndex: number
): LetterData => {
    // check if the app has a letter for the position
    // default to space if there is no letter
    const hasLetter =
        app.guesses.length > guessIndex &&
        app.guesses[guessIndex].length > letterIndex;
    const letter = hasLetter ? app.guesses[guessIndex][letterIndex] : ' ';
    // check if there is a result for the guess
    // default to unset if there is no result
    const hasResult = app.results.length > guessIndex;
    const result = hasResult
        ? app.results[guessIndex][letterIndex]
        : LetterStatus.UNSET;
    return { character: letter, status: result };
};

/** individual letter */
const Letter: FC<{ data: LetterData }> = ({ data }) => {
    const description = StatusToClassName[data.status];
    return (
        <div className={`guess-letter ${description}`}>{data.character}</div>
    );
};

/** row for a guess */
const GuessRow: FC<{ letters: Array<LetterData> }> = ({ letters }) => (
    <div className='guess-row'>
        {letters.map((data, index) => (
            <Letter key={index} data={data} />
        ))}
    </div>
);

/** displays the guesses and their results */
export const GuessArea: FC = () => {
    // get the context
    const { app } = useWordle();

    // format the data
    const allGuessData: Array<Array<LetterData>> = [];
    for (let i = 0; i < app.maxGuesses; i++) {
        const guessData = [];
        for (let j = 0; j < app.wordLength; j++) {
            const letterData = getLetterData(app, i, j);
            guessData.push(letterData);
        }
        allGuessData.push(guessData);
    }

    // display the guess
    return (
        <div className='guess-area'>
            {allGuessData.map((guessData, index) => (
                <GuessRow key={index} letters={guessData} />
            ))}
        </div>
    );
};
