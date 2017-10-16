import * as fs from 'fs'
import * as util from 'util'

export default class i18n {

    private resources

    constructor(private defaultLang: string, lang: string, localePath: string) {
        lang = lang.toLowerCase()
        let langs = [lang, lang.split('-')[0], defaultLang]

        for (let language of langs) {
            let langResourcePath = util.format(localePath, language)
            if (fs.existsSync(langResourcePath)) {
                this.resources = JSON.parse(fs.readFileSync(langResourcePath, 'utf8'))
                break
            }
        }
    }

    get(sections: string, ...args) {
        let _sections = sections.split('.'),
            resource = this.resources

        for (let section of _sections)
            resource = resource[section]
        for (let arg of args)
            resource = util.format(resource, arg)
        return resource
    }
}