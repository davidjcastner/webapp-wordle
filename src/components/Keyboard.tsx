// import { FC, useEffect } from "react";
// import { useWordle } from "../context/wordle";

// /** helper lookup for event.code to character */
// const keyCodeToLetter = { KeyA: 'A', KeyB: 'B', KeyC: 'C', KeyD: 'D', KeyE: 'E', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyI: 'I', KeyJ: 'J', KeyK: 'K', KeyL: 'L', KeyM: 'M', KeyN: 'N', KeyO: 'O', KeyP: 'P', KeyQ: 'Q', KeyR: 'R', KeyS: 'S', KeyT: 'T', KeyU: 'U', KeyV: 'V', KeyW: 'W', KeyX: 'X', KeyY: 'Y', KeyZ: 'Z' };

// /** displays a clickable keyboard for the user to provide input */
// export const Keyboard: FC = () =>{
//     const ctx = useWordle();

//     // bind keys to context
//     const keydownHandler = (event: KeyboardEvent): void => {
//         const code = event.code;
//         if (code === 'Slash') {
//             ctx.newGame();
//         } else if (code in keyCodeToLetter) {
//             ctx.addCharacter(keyCodeToLetter[code]);
//         } else if (code === 'Backspace') {
//             ctx.removeCharacter();
//         } else if (code === 'Enter') {
//             ctx.submitGuess();
//         }
//     }

//     // add event listener when app is ready
//     useEffect(() => {
//         ctx.isReady && document.addEventListener('keydown', keydownHandler);
//     }, [ctx.isReady])

//     // return dummy fragment
//     return <></>
// }
