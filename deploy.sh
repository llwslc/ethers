#!/bin/sh

npm run build

cd build

git init
git config user.name "llwslc"
git config user.email "llwslc@gmail.com"
git add -A
git commit -m 'deploy'

git push -f git@github.com:llwslc/ethers.git master:gh-pages