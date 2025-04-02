#!/bin/bash

# Check if at least one argument is provided
if [ "$#" -eq 0 ]; then
  echo "❌ Please provide at least one proto file name"
  exit 1
fi

# Convert the plugin path to Windows format for Git Bash compatibility
PROTOC_PLUGIN_PATH="$(cygpath -w "./node_modules/.bin/protoc-gen-ts_proto.cmd")"

# Loop through each provided proto file argument
for proto in "$@"; do
  PROTO_FILE="libs/shared/src/proto/${proto}.proto"

  echo "⚡ Generating ${PROTO_FILE}..."

  # Run protoc with Windows-compatible path
  winpty protoc --plugin=protoc-gen-ts_proto="${PROTOC_PLUGIN_PATH}" --ts_proto_opt=nestJs=true --ts_proto_out=. "${PROTO_FILE}"

  # Check if the last command was successful
  if [ $? -eq 0 ]; then
    echo "✅ Successfully generated ${PROTO_FILE}"
  else
    echo "❌ Error generating ${PROTO_FILE}"
  fi
done
