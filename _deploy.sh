#!/bin/sh
set -e

echo TRAVIS_PULL_REQUEST is "${TRAVIS_PULL_REQUEST}"
echo TRAVIS_BRANCH is "${TRAVIS_BRANCH}"

[ -z "${GITHUB_PAT}" ] && exit 0
[ "${TRAVIS_BRANCH}" != "source" ] && exit 0
[ "${TRAVIS_PULL_REQUEST}" != "false" ] && exit 0

git config user.name "rapporter-travis"
git config user.email "travis"

git clone -b main https://${GITHUB_PAT}@github.com/${TRAVIS_REPO_SLUG}.git book-output
cd book-output
cp -r ../_book/* ./
git add --all *
git commit -m"Automatic deployment after $TRAVIS_COMMIT [ci skip]" || true
git push -q origin main 
