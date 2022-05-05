/** all possible results for a single letter */
export enum LetterResult {
    /** the letter or nth count of the letter
     * does not appear in the answer */
    WRONG = 'wrong',
    /** the letter appears in the answer
     * but not at this letter's position */
    CLOSE = 'close',
    /** the letter is at this position in the answer */
    MATCH = 'match',
}
