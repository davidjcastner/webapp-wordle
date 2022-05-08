import { LetterStatus } from '../enums/LetterStatus';

/** lookup for css class names based on letter status */
export const StatusToClassName = {};
StatusToClassName[LetterStatus.UNSET] = 'is-unset';
StatusToClassName[LetterStatus.WRONG] = 'is-wrong';
StatusToClassName[LetterStatus.CLOSE] = 'is-close';
StatusToClassName[LetterStatus.MATCH] = 'is-match';
