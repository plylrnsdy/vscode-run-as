export default function get(object: any, path: string): string {
    let o = object;
    const props = path.split('.');

    for (const prop of props) {
        o = o[prop];
    }
    return o;
}