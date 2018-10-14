import * as micromatch from 'micromatch';
import { should, expect } from 'chai';

should();

let files = [
    'projectA/bin/a.bat',
    'projectA/bin/[prefix]b.bat',
    'projectA/bin/[prefix]c.cmd',
    'projectA/src/main.ts',
    'projectA/test/main.spec.ts',
    'projectA/Readme.md',
],
    options = { matchBase: true, dot: true }

describe('micromatch()', () => {

    it('filename.ext', () => {
        micromatch(files, '*.*', options).forEach(path => expect(path).to.be.match(/.[^.]+$/));
        micromatch(files, '*.ts', options).forEach(path => expect(path).to.be.match(/\/[^/]+\.ts$/));
        micromatch(files, '*.spec.ts', options).forEach(path => expect(path).to.be.match(/\/[^/]+\.spec\.ts$/));
    });

    it('filename.@(extlist)', () => {
        micromatch(files, '*.@(bat|cmd)', options).forEach(path => expect(path).to.be.match(/\/[^/]+\.(?:bat|cmd)$/));
    });

    it('[prefix]filename.@(extlist)', () => {
        micromatch(files, '\\[*\\]*.@(bat|cmd)', options).forEach(path => expect(path).to.be.match(/\/\[[^/]+\][^/]+\.(?:bat|cmd)$/));
    });
});