#!/usr/bin/env bash

##
# Copyright 2018 Google Inc. All Rights Reserved.
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

# Remove previous build
rm -rf gh-pages
# Get list of demos
demos=`ls demos/*.html`
# Clone gh-pages branch
git worktree add gh-pages origin/gh-pages
# Copy built source to gh-pages
cp -rf demos/* gh-pages/demos

# get list of demos to transform
files=(`ls gh-pages/demos/*.html`)
for file in ${files[@]}; do
  # rollup bundle demos
  node scripts/build/rollup-demos.js ${file}
  # node scripts/build/rollup-demos.js gh-pages/demos/index.html
done

# Push to gh-pages
read -p "Test build/gh-pages/demos/index.html, then press 'y' to publish to gh-pages: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  (cd gh-pages && git add -A && git commit -m 'Update gh-pages' && git push origin HEAD:gh-pages)
fi

# Bundled/compiled build currently not working well....

# # Run polymer build to do node module resolution on the demos, output to build/default
# polymer build --js-compile --module-resolution=node $fragments
# # Make a build/interim copy of build/default
# cp -rf build/default build/interim
# # Add babel-polyfill to the babel helpers injected build-entrypoint
# echo '<script src="../node_modules/babel-polyfill/dist/polyfill.js"></script>' >> build/default/build-entrypoint.html
# # Inject the babel helpers from the original entrypoint into each demo in interim
# for f in $demos; do sed '/<!--! do not remove -->/ r build/default/build-entrypoint.html' build/default/$f > build/interim/$f; done;
# # Install babel-polyfill
# (cd build/interim && npm install babel-polyfill)
# # Move webcomponents into the interim copy (for some reason --extra-dependencies on polymer build above was failing)
# cp -rf node_modules/@webcomponents/webcomponentsjs build/interim/node_modules/@webcomponents
# # Clear the build entrypoint file in the interim copy
# echo '' > build/interim/build-entrypoint.html
# # Bundle the interim demos
# (cd build/interim && polymer build --module-resolution=node --bundle $fragments --entrypoint build-entrypoint.html)
# # Blow away interim
# # rm -rf build/default
# # mv build/interim/build/default build/default
# # rm -rf build/interim