import { ActionType } from '../enums/actionType';
import { WordleApp } from './WordleApp';

/** context for various app components */
export interface WordleContext {
    app: WordleApp;
    dispatch: React.Dispatch<{
        type: ActionType;
        payload?: any;
    }>;
}
