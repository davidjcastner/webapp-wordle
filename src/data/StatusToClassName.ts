import { LetterStatus } from '../enums/LetterStatus';

/** lookup for css class names based on letter status */
export const StatusToClassName = {
    [LetterStatus.UNSET]: 'is-unset',
    [LetterStatus.WRONG]: 'is-wrong',
    [LetterStatus.CLOSE]: 'is-close',
    [LetterStatus.MATCH]: 'is-match',
};
