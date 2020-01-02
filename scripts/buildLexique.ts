import { createReadStream, promises as FS } from 'fs';
import csv from 'oh-csv';
import pako from 'pako';
import stream from 'stream';
import V8 from 'v8';

const SOURCE = 'lexique.tsv';
const DESTINATION = 'dist/lexique.bin';

function parseFromStream(stream: stream.Readable) {
    let resolve: Function;
    const promise = new Promise<[]>(resolve_ => resolve = resolve_); // TODO sale

    const rows: any[] = [];
    const parser = new csv.Parser(csv.tsvOpts);

    const KEPT_COLUMNS = ['ortho', 'genre', 'nombre', 'cgram', 'freqlivres'];

    let indexes: number[];

    parser.on('readable', () => {
        const row = parser.read();

        if (row === null) {
            return resolve(
                rows
                    .sort((a, b) => {
                        return b.freqlivres - a.freqlivres;
                    })
                    .map((row) => {
                        delete row.freqlivres;
                        return row;
                    })
            );
        }

        if (!indexes) {
            indexes = [];
            let i = 0;

            for (const colName of row) {
                indexes[KEPT_COLUMNS.indexOf(colName)] = i++;
            }

            delete indexes[-1];
        }
        else {
            const obj: any = {};
            let i = 0;
            for (const key of KEPT_COLUMNS) {
                obj[key] = row[indexes[i++]];
            }
            rows.push(obj);
        }
    });

    // @ts-ignore
    stream.pipe(parser);

    return promise;
}

(async function main() {
    const rows = await parseFromStream(createReadStream(SOURCE));

    const serialized = V8.serialize(rows);
    const buffer = pako.deflate(serialized);

    await FS.writeFile(DESTINATION, buffer);
})();
