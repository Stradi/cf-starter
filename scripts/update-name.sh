#!/bin/bash

NEW_NAME=$1
OLD_NAME=$2

if [ -z "$OLD_NAME" ]; then
  OLD_NAME="cf-starter"
fi

if [ -z "$NEW_NAME" ]; then
  echo "Error: Please provide a new name"
  echo "Usage: $0 <new-name> [old-name]"
  echo "  <new-name>: Required. The new name to use"
  echo "  [old-name]: Optional. The name to replace (default: 'cf-starter')"
  exit 1
fi

echo "Replacing all occurrences of '$OLD_NAME' with '$NEW_NAME'..."

FIRST_CHAR=$(echo "$OLD_NAME" | cut -c1 | tr '[:lower:]' '[:upper:]')
REST_CHARS=$(echo "$OLD_NAME" | cut -c2-)
CAPITAL_OLD_NAME="${FIRST_CHAR}${REST_CHARS}"

all_files=$(find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.jsonc" -o -name "*.html" \) -not -path "*/node_modules/*" -not -path "*/.git/*")
modified_count=0

for file in $all_files; do
  if grep -q "$OLD_NAME\|$CAPITAL_OLD_NAME" "$file"; then
    echo "Updating $file"
    modified_count=$((modified_count + 1))
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/$OLD_NAME/$NEW_NAME/g" "$file"
      sed -i '' "s/@$OLD_NAME/@$NEW_NAME/g" "$file"
      sed -i '' "s/$CAPITAL_OLD_NAME Starter/$NEW_NAME/g" "$file"
      sed -i '' "s/$OLD_NAME-worker/$NEW_NAME-worker/g" "$file"
    else
      sed -i "s/$OLD_NAME/$NEW_NAME/g" "$file"
      sed -i "s/@$OLD_NAME/@$NEW_NAME/g" "$file"
      sed -i "s/$CAPITAL_OLD_NAME Starter/$NEW_NAME/g" "$file"
      sed -i "s/$OLD_NAME-worker/$NEW_NAME-worker/g" "$file"
    fi
  fi
done

echo "Replacement complete! Modified $modified_count files."
