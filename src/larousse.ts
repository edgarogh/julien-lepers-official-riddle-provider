import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = "https://www.larousse.fr/dictionnaires/francais/";

export async function getDefinition(word: string): Promise<string | undefined> {
    const response = await axios.get(BASE_URL + word);
    const $ = cheerio.load(response.data);

    const definitionElement = $('.Definitions .DivisionDefinition');

    return definitionElement.text();
}
