import { IncomingMessage, ServerResponse } from 'http';
import getRiddle from './getRiddle';
import * as lexique from './lexique';

async function handle(req: IncomingMessage, res: ServerResponse) {
    if (!req.url || req.url === '/') {
        const word = lexique.getRandomName().ortho;
        res.statusCode = 302;
        res.setHeader('Location', word);
        res.end();
        return;
    }

    const wordString = unescape(req.url.substring(1));

    return getRiddle(wordString);
};

module.exports = handle;
