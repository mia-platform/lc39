#!/usr/bin/env sh

set -o errexit
set -o nounset

umask 077

# Automatically get the folder where the source files must be placed.
__DIR=$(dirname "${0}")
SOURCE_DIR="${__DIR}/../"
TAG_VALUE="${1}"

# Create a variable that contains the current date in UTC
# Different flow if this script is running on Darwin or Linux machines.
if [ "$(uname)" = "Darwin" ]; then
  NOW_DATE="$(date -u +%F)"
else
  NOW_DATE="$(date -u -I)"
fi

sed -i.bck "s|### TBR|### v${TAG_VALUE} (${NOW_DATE})|g" "${SOURCE_DIR}/CHANGELOG.md"
rm -fr ${SOURCE_DIR}/CHANGELOG.md.bck
