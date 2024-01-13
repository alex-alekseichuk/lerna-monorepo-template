#!/bin/bash

set -ex

lerna bootstrap --no-private --concurrency ${CONCURRENCY:-2} --include-dependencies "$@"
monorepo-cli package hoist-local

npm run bootstrap:always -- "$@"
