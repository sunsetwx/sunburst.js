import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { name, version, author, license } from './package.json';

const banner = `/* ${name} v${version} | (c) ${author} and other contributors | ${license} License */`;

const shared = {
  properties: {
    input: 'src/index.js'
  },
  babel: {
    exclude: 'node_modules/**',
    babelrc: false,
    presets: [
      ["env", { modules: false }]
    ],
    plugins: ['external-helpers']
  }
};

const babelEnv = {
  browser: Object.assign({}, shared.babel),
  node: Object.assign({}, shared.babel)
};

babelEnv.browser.presets[0][1].targets = {
  browsers: ['>= 0.25%']
};

babelEnv.node.presets[0][1].targets = {
  node: '6.5'
};

const browserIife = Object.assign({}, shared.properties, {
  output: {
    file: 'dist/sunburst.iife.js',
    format: 'iife',
    name: 'SunburstJS',
    interop: false
  },
  plugins: [
    nodeResolve({ module: false, browser: true }),
    commonjs(),
    json(),
    babel(babelEnv.browser),
    uglify({
      compress: {
        passes: 2
      },
      output: {
        preamble: banner
      }
    })
  ]
});

const browserEsm = Object.assign({}, shared.properties, {
  output: {
    file: 'dist/sunburst.esm.js',
    format: 'es',
    name: 'SunburstJS',
    interop: false
  },
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    babel(babelEnv.browser),
    uglify({
      compress: {
        passes: 2
      },
      output: {
        preamble: banner
      }
    })
  ]
});

const node = Object.assign({}, shared.properties, {
  output: {
    file: 'dist/sunburst.js',
    format: 'cjs',
    banner,
    interop: false
  },
  external: ['url', 'querystring', 'https'],
  plugins: [
    nodeResolve({ module: false }),
    commonjs(),
    json(),
    babel(babelEnv.node)
  ]
});

export default [
  browserIife,
  browserEsm,
  node
];
