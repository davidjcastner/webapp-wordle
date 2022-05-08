import { LetterStatus } from '../enums/LetterStatus';
import { GuessResult } from '../types/GuessResult';

/** returns the result for the guess based on the answer,
 * assumes that the guess and answer are both valid */
export const calculateResult = (guess: string, answer: string): GuessResult => {
    // start with the default of all letters being wrong
    const result: LetterStatus[] = Array(guess.length).fill(LetterStatus.WRONG);
    // start with checking for correct letters
    // while tracking unsolved positions
    const unsolvedPositions = new Set<number>();
    [...guess].forEach((letter, index) => {
        if (letter === answer[index]) {
            result[index] = LetterStatus.MATCH;
        } else {
            unsolvedPositions.add(index);
        }
    });
    // get the letter frequency skipping over correct letters
    const letterCount = {};
    [...answer].forEach((letter, index) => {
        if (unsolvedPositions.has(index)) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
    });
    // loop through remaining letters and check for matches
    // decrement the letter count each time
    // this ensures only the correct amount of letters are set to wrong position
    // without going over, and the only the first ones will be checked
    [...guess].forEach((letter, index) => {
        if (unsolvedPositions.has(index)) {
            if (letterCount[letter] > 0) {
                result[index] = LetterStatus.CLOSE;
                letterCount[letter]--;
            }
        }
    });
    // return the result
    return result;
};
