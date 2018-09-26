/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const watch = require('node-watch');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const watchOptions = {
  recursive: true,
  filter: (path) => {
    if (path.indexOf('node_modules') > -1) {
      return false;
    }
    if (path.indexOf('src') === -1) {
      return false;
    }
    return /.(?:ts|scss)$/.test(path);
  },
};

watch('packages', watchOptions, function() {
  addToQueue();
});

let updating = false;

async function addToQueue() {
  if (updating) {
    return;
  }
  console.log('saw changes!');
  updating = true;
  const {stdout, stderr} = await exec('npm run build');
  console.log(stdout);
  if (stderr) {
    console.error('ERROR:', stderr);
  }
  console.log('watcher build complete!');
  updating = false;
}
