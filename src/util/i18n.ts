import * as fs from 'fs';
import * as util from 'util';
import get from './get';

export default class i18n {

    private resources;

    constructor(private defaultLang: string, lang: string, localePath: string) {
        lang = lang.toLowerCase();
        const langs = [lang, lang.split('-')[0], defaultLang];

        for (const language of langs) {
            const langResourcePath = util.format(localePath, language);
            if (fs.existsSync(langResourcePath)) {
                this.resources = JSON.parse(fs.readFileSync(langResourcePath, 'utf8'));
                break;
            }
        }
    }

    message(sections: string) {
        return get(this.resources, sections);
    }
}