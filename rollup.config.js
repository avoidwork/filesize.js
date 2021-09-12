import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const year = new Date().getFullYear();

const bannerLong = `/**
 * ${pkg.name}
 *
 * @copyright ${year} ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */`;

const bannerShort = `/*!
 ${year} Jason Mulligan <jason.mulligan@avoidwork.com>
 @version ${pkg.version}
*/`;

const umdOutBase = { format: 'umd', name: 'filesize' };
const esmOutBase = { format: 'esm', name: 'filesize' };

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
      { ...esmOutBase, file: 'lib/filesize.esm.js', banner: bannerLong },
      { ...esmOutBase, file: 'lib/filesize.esm.min.js', banner: bannerShort, plugins: [ terser() ], sourcemap: true },
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
