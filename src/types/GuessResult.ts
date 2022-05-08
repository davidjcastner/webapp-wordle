import { LetterStatus } from '../enums/LetterStatus';

/** the complete result of a single guess */
export type GuessResult = Readonly<Array<LetterStatus>>;
