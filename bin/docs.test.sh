#!/bin/bash

rm -rf sandbox/loopback.io/
git clone https://github.com/strongloop/loopback.io.git sandbox/loopback.io
npm run bootstrap
cd sandbox/loopback.io/
bundle install
npm run fetch-readmes
bundle exec jekyll build
