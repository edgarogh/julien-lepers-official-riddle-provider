declare module 'oh-csv' {

    export const tsvOpts: ParserOptions;

    class Parser {

        constructor(options: ParserOptions);

        read(): string[];
        
        on(event: 'readable', listener: () => void): void;

    }

    interface ParserOptions {

    }

}