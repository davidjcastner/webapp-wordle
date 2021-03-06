import { FC, useEffect } from 'react';
import { useWordle } from '../context/wordle';
import { ActionType } from '../enums/actionType';
import './ErrorHandler.css';

/** display errors when they occur and removes them after a short delay */
export const ErrorHandler: FC = () => {
    // get the context
    const { app, dispatch } = useWordle();

    // remove the error after a short delay
    useEffect(() => {
        if (app.errorId > 0) {
            setTimeout(() => {
                dispatch({
                    type: ActionType.REMOVE_ERROR,
                    payload: app.errorId,
                });
            }, 3000);
        }
    }, [app.errorId]);

    // get an array of error messages
    const errors = Object.entries(app.errors);
    const countClass = `count-${Math.min(errors.length, 5)}`;

    // display the error
    // TODO: change key to errorId
    return (
        <div className={`error-handler ${countClass}`}>
            {errors.map((errorEntry) => {
                const [errorId, message] = errorEntry;
                return (
                    <div className='error-message' key={errorId}>
                        {message}
                    </div>
                );
            })}
        </div>
    );
};
