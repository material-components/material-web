#!/usr/bin/env bash

##
# Copyright 2016 Google Inc. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

set -e

`npm bin`/lerna bootstrap --hoist
`npm bin`/lerna clean --yes

packages=(`find packages -name "package.json" | xargs -I '{}' dirname '{}'`)

for package in ${packages[@]}; do
  npmname=`node -e "console.log(require(\"${INIT_CWD}/${package}/package.json\").name)"`
  if [ ! -L ${INIT_CWD}/node_modules/${npmname} ]; then
    ln -sfv ${INIT_CWD}/${package} ${INIT_CWD}/node_modules/${npmname}
  fi
done