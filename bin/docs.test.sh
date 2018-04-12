#!/bin/bash

rm -rf loopback.io
git clone https://github.com/strongloop/loopback.io.git
npm run bootstrap
cd loopback.io/
bundle install
npm run fetch-readmes
bundle exec jekyll build
