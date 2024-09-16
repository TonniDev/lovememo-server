#!/bin/bash

if ! command -v yarn &> /dev/null; then
    echo "WARNING: Please install yarn to execute husky script."
    exit 0
fi

if [ ! -f '.husky/_/husky.sh' ]; then
    echo 'Could not find husky locally.'
    echo 'Installing yarn dependencies locally to run husky...'
    yarn
fi

./.husky/pre-commit
