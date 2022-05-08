/** fetches a set of words to use */
export const fetchWordSet = (
    url: string,
    callback: (words: Set<string>) => void
): void => {
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const words = text
                .split('\n')
                .map((word) => word.trim().toUpperCase())
                .filter((word) => word.length > 0);
            callback(new Set(words));
        });
};
