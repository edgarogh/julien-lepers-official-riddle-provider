import { createError } from 'micro';
import { getDefinition } from './larousse';
import * as lexique from './lexique';

export default async function getRiddle(word: string) {
    const rawDefinition = await getDefinition(word);
    
    if (!rawDefinition) {
        throw createError(404, 'Word not found');
    }

    const definition = rawDefinition[0].toLowerCase() + rawDefinition.slice(1);

    const firstWordString = definition.split(' ')[0];
    const firstWord = lexique.findWord(firstWordString);

    return {
        word,
        riddle: `Je suis ${getConnector(firstWord)} ${definition}`,
    };
}

function getConnector(firstWord: lexique.Word | undefined) {
    if (!firstWord) return ':';

    if (firstWord.cgram === 'VER') return 'le fait de';

    return firstWord.nombre === 's'
        ? 'un.e'
        : 'des';
}
