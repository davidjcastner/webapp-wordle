/** available actions for the wordle ui to take */
export enum ActionType {
    REMOVE_ERROR = 'REMOVE_ERROR',
    INITIALIZE = 'INITIALIZE',
    NEW_GAME = 'NEW_GAME',
    ADD_CHARACTER = 'ADD_CHARACTER',
    REMOVE_CHARACTER = 'REMOVE_CHARACTER',
    SUBMIT_GUESS = 'SUBMIT_GUESS',
}
