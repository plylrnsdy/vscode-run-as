import config from './config'
import Terminal from './Terminal'
import Runner from '../src/Runner'

let runner = new Runner(new config('win32', true), new Terminal('Run as ...'))

runner.run('files-to-run\\run as.bat')
runner.run('files-to-run\\run as.md')