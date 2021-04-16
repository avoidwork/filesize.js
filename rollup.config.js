import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const bannerLong = `/**
 * ${pkg.name}
 *
 * @copyright ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */`;

const bannerShort = `/*!
 2020 Jason Mulligan <jason.mulligan@avoidwork.com>
 @version ${pkg.version}
*/`;

const umdOutBase = { format: 'umd', name: 'filesize' };

export default [
  {
    input: 'src/filesize.js',
    output: [
      { ...umdOutBase, file: 'lib/filesize.es6.js', banner: bannerLong },
      { ...umdOutBase, file: 'lib/filesize.es6.min.js', banner: bannerShort, plugins: [ terser() ], sourcemap: true },
    ]
  },
  {
    input: 'src/filesize.js',
    output: [
      { ...umdOutBase, file: 'lib/filesize.js', banner: bannerLong },
      { ...umdOutBase, file: 'lib/filesize.min.js', banner: bannerShort, plugins: [ terser() ], sourcemap: true },
    ],
    plugins: [ babel({presets: [['@babel/preset-env', { modules: false }]]}) ]
  }
]
