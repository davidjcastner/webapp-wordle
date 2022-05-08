import { VALID_CHARACTERS } from '../data/ValidCharacters';
import { ActionType } from '../enums/actionType';
import { WordleApp } from '../interfaces/WordleApp';
import { WordleAppImplementation } from '../logic/WordleAppImplementation';

/** ensures that execution is stopped if payload is not a wordle app */
const validatePayloadIsWordleApp = (payload: any): void => {
    if (!(payload instanceof WordleAppImplementation)) {
        throw new Error(`Payload is not a wordle app`);
    }
};

/** ensures that execution is stopped if payload is not a character */
const validatePayloadIsCharacter = (payload: any): void => {
    if (!VALID_CHARACTERS.has(payload)) {
        throw new Error(`Payload is not a character`);
    }
};

/** ensures that execution is stopped if payload is not a positive integer */
const validatePayloadIsPositiveInteger = (payload: any): void => {
    if (!(payload > 0 && Number.isInteger(payload))) {
        throw new Error(`Payload is not a positive integer`);
    }
};

/** applies state changes based on the action type given */
export const wordleReducer = (
    state: WordleApp,
    action: { type: ActionType; payload?: any }
): WordleApp => {
    try {
        switch (action.type) {
            case ActionType.REMOVE_ERROR:
                validatePayloadIsPositiveInteger(action.payload);
                return state.removeError(action.payload);
            case ActionType.INITIALIZE:
                validatePayloadIsWordleApp(action.payload);
                return action.payload;
            case ActionType.NEW_GAME:
                return state.newGame();
            case ActionType.ADD_CHARACTER:
                validatePayloadIsCharacter(action.payload);
                return state.addCharacter(action.payload);
            case ActionType.REMOVE_CHARACTER:
                return state.removeCharacter();
            case ActionType.SUBMIT_GUESS:
                return state.submitGuess();
            default:
                console.log(`Unknown action type: ${action.type}`);
                return state;
        }
    } catch (error) {
        return state.addError(error.message);
    }
};
