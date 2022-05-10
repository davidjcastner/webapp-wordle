import { FC, useEffect } from 'react';
import { useWordle } from '../context/wordle';
import { KEYCODE_LOOKUP } from '../data/KeycodeLookup';
import { StatusToClassName } from '../data/StatusToClassName';
import { ActionType } from '../enums/actionType';
import { LetterStatus } from '../enums/LetterStatus';
import './Keyboard.css';

/** individual keyboard clickable button */
const KeyboardButton: FC<{ code: string }> = ({ code }) => {
    // get the context
    const { app, dispatch } = useWordle();
    // properties for displaying the button
    const status =
        code in app.characterStatus
            ? app.characterStatus[code]
            : LetterStatus.UNSET;
    const statusClass = StatusToClassName[status];
    const isWideClass = code.length > 1 ? 'is-wide' : '';
    const displayName = code !== 'Backspace' ? code : '⌫';
    const fullClassName = `keyboard-button ${statusClass} ${isWideClass}`;
    const buttonId = `button-${code.toLowerCase()}`;
    // handle the click
    const handleClick = () => {
        if (code in app.characterStatus) {
            dispatch({
                type: ActionType.ADD_CHARACTER,
                payload: code,
            });
        } else if (code === 'Backspace') {
            dispatch({ type: ActionType.REMOVE_CHARACTER });
        } else if (code === 'Enter') {
            dispatch({ type: ActionType.SUBMIT_GUESS });
        }
    };
    // dom for the button
    return (
        <button id={buttonId} className={fullClassName} onClick={handleClick}>
            {displayName}
        </button>
    );
};

/** provides a clickable keyboard,
 * and listens for keydown events on the document */
export const Keyboard: FC = () => {
    // get the context
    const { dispatch } = useWordle();

    // bind dispatch to event handler
    const keydownHandler = (event: KeyboardEvent): void => {
        // check if actionable key
        if (event.code === 'Slash') {
            dispatch({ type: ActionType.NEW_GAME });
        } else if (event.code in KEYCODE_LOOKUP) {
            dispatch({
                type: ActionType.ADD_CHARACTER,
                payload: KEYCODE_LOOKUP[event.code],
            });
        } else if (event.code === 'Backspace') {
            dispatch({ type: ActionType.REMOVE_CHARACTER });
        } else if (event.code === 'Enter') {
            dispatch({ type: ActionType.SUBMIT_GUESS });
        }
    };

    // add event listener on mount
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);

    // display the keyboard
    return (
        <div className='keyboard'>
            <div className='keyboard-row'>
                <KeyboardButton code='Q' />
                <KeyboardButton code='W' />
                <KeyboardButton code='E' />
                <KeyboardButton code='R' />
                <KeyboardButton code='T' />
                <KeyboardButton code='Y' />
                <KeyboardButton code='U' />
                <KeyboardButton code='I' />
                <KeyboardButton code='O' />
                <KeyboardButton code='P' />
            </div>
            <div className='keyboard-row'>
                <KeyboardButton code='A' />
                <KeyboardButton code='S' />
                <KeyboardButton code='D' />
                <KeyboardButton code='F' />
                <KeyboardButton code='G' />
                <KeyboardButton code='H' />
                <KeyboardButton code='J' />
                <KeyboardButton code='K' />
                <KeyboardButton code='L' />
            </div>
            <div className='keyboard-row'>
                <KeyboardButton code='Enter' />
                <KeyboardButton code='Z' />
                <KeyboardButton code='X' />
                <KeyboardButton code='C' />
                <KeyboardButton code='V' />
                <KeyboardButton code='B' />
                <KeyboardButton code='N' />
                <KeyboardButton code='M' />
                <KeyboardButton code='Backspace' />
            </div>
        </div>
    );
};
