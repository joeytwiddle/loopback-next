#!/bin/bash

set -ev

# Make sure we use the correct repo root dir
DIR=`dirname $0`
REPO_ROOT=$DIR/..
pushd $REPO_ROOT >/dev/null
rm -rf sandbox/loopback.io/
# Shadow clone is faster
git clone --depth 1 https://github.com/strongloop/loopback.io.git sandbox/loopback.io
npm run bootstrap
pushd $REPO_ROOT/sandbox/loopback.io/ >/dev/null
# The following 3 lines will be replaced with npm run build
bundle install
npm run fetch-readmes
bundle exec jekyll build
popd >/dev/null
popd >/dev/null
