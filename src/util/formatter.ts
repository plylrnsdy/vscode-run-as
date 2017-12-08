export function format(template: string, dataObject): string {
    return template.replace(/\$\{([^}]+)\}/g, (match, variable) => {
        return dataObject[variable]
    })
}