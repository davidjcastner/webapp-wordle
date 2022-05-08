import { FC } from 'react';
import { useWordle } from '../context/wordle';
import { ActionType } from '../enums/actionType';

/** displays the games results and has a button to start a new game */
export const NewGame: FC = () => {
    // get the context
    const { app, dispatch } = useWordle();

    // status for displaying results
    const isWin = new Set(app.guesses).has(app.answer);
    const score = app.guesses.length;

    // start a new game
    const handleClick = (): void => {
        dispatch({ type: ActionType.NEW_GAME });
    };

    // render
    return (
        <div className='new-game'>
            {isWin && <h1>Congrats, you won!</h1>}
            {isWin && score > 1 && <p>You got the answer in {score} guesses</p>}
            {isWin && score === 1 && (
                <p>Wow, you guessed right on first try!</p>
            )}
            {!isWin && <h1>Sorry, you lost!</h1>}
            {!isWin && <p>Better luck next time!</p>}
            <p>
                Answer: <span className='text-answer'>{app.answer}</span>
            </p>
            <button onClick={handleClick}>New Game</button>
        </div>
    );
};
