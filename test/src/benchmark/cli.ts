/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import {readdirSync} from 'fs';
import {join as pathjoin} from 'path';
import {main} from 'tachometer/lib/cli';

/* eslint-disable no-console */

const optionDefinitions: commandLineUsage.OptionDefinition[] = [
  {
    name: 'help',
    description: 'Show documentation',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'package',
    description: 'Select which individual packages to benchmark.\ne.g.' +
        ' "-p button radio icon-button".\n(default runs all)',
    alias: 'p',
    type: String,
    multiple: true,
    defaultValue: [],
  },
  {
    name: 'remote',
    description: 'Remote location to point tachometer.\ne.g. if running' +
        ' a remote SSH Selenium tunnel on port 4444:\n' +
        '-r http://localhost:4444/wd/hub.\n(default runs locally)',
    alias: 'r',
    type: String,
    defaultValue: ''
  },
  {
    name: 'sample-size',
    description: 'Minimum number of times to run each benchmark.\n(default 50)',
    alias: 'n',
    type: Number,
    defaultValue: 50
  },
  {
    name: 'browser',
    description: 'Which browsers to launch in automatic mode.' +
        '\n(default chrome)',
    alias: 'b',
    type: String,
    defaultValue: 'chrome',
  },
];

interface Options {
  help: boolean;
  package: string[];
  remote: string;
  'sample-size': string;
  browser: string;
}

(async () => {
  const opts = commandLineArgs(optionDefinitions) as Options;

  if (opts.help) {
    console.log(commandLineUsage([
      {
        header: 'benchmark runner',
        content: 'Runs benchmarks for MWC',
      },
      {
        header: 'Usage',
        content: `Run all benchmarks for all MWC components:
$ node test/lib/benchmark/cli

Run all benchmarks for specific components:
$ node test/lib/benchmark/cli -p button ripple
$ node test/lib/benchmark/cli -p button -p ripple

Run benchmarks on remote Selenium server or SSH tunnel:
$ node test/lib/benchmark/cli -r http://localhost:4444/wd/hub

Run benchmarks n times on each package:
$ node test/lib/benchmark/cli -n 20
`,
      },
      {
        header: 'Options',
        optionList: optionDefinitions,
      },
    ]));
    return;
  }

  let packages: string[] = [];

  if (opts.package.length) {
    packages = opts.package;
  } else {
    packages = readdirSync(pathjoin('test', 'benchmark'), {withFileTypes: true})
                   .filter((dirEntry) => dirEntry.isDirectory())
                   .map((dirEntry) => dirEntry.name);
  }


  const printResults: string[] = [];
  for (const packageName of packages) {
    const runCommands: string[] = [];

    const benchmarks =
        readdirSync(
            pathjoin('test', 'lib', 'test', 'src', 'benchmark', packageName),
            {withFileTypes: true})
            .filter(
                (dirEntry) =>
                    dirEntry.isFile() && dirEntry.name.endsWith('.js'))
            .map((dirEntry) => dirEntry.name.replace(/\.js$/, ''));


    for (const benchmark of benchmarks) {
      runCommands.push(
          `${packageName}:${benchmark}=test/bench-runner.html` +
          `?bench=${benchmark}` +
          `&package=${packageName}`);
    }

    const statResults = await main([
      ...runCommands,
      '--measure=global',
      `--browser=${opts.browser}${opts.remote ? `@${opts.remote}` : ''}`,
      `--sample-size=${opts['sample-size']}`
    ]);

    if (!statResults) {
      return;
    }

    for (const statResult of statResults) {
      const name = statResult.result.name;
      const low = statResult.stats.meanCI.low.toFixed(2);
      const high = statResult.stats.meanCI.high.toFixed(2);
      printResults.push(`${name}: ${low}ms - ${high}ms`);
    }
  }

  for (const printResult of printResults) {
    console.log(printResult);
  }
})();
