import * as micromatch from 'micromatch';
import { expect } from 'chai';

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
        expect(micromatch(files, '*.*', options)).to.deep.eq(files);
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