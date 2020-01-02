import FS from 'fs';
import pako from 'pako';
import Path from 'path';
import V8 from 'v8';

export interface Word {
    ortho: string;
    genre: '' | 'm' | 'f';
    nombre: '' | 's' | 'p';
    cgram: string;
}

const LEXIQUE_PATH = Path.join(__dirname, 'lexique.bin');

const buffer = pako.inflate(FS.readFileSync(LEXIQUE_PATH));
export const words: Word[] = V8.deserialize(buffer);

export function findWord(name: string) {
    name = name.toLowerCase();
    return words.find((word) => word.ortho === name);
}

export function getRandomName() {
    return words[~~(Math.random() * words.length)];
}
