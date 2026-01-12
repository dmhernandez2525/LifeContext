#!/bin/bash
echo "📦 Packaging LifeContext Chrome Extension..."

# Remove old build
rm -f extension.zip

# Create zip
zip -r extension.zip . -x "*.git*" -x "build.sh" -x ".DS_Store"

echo "✅ Extension packaged: extension.zip"
ls -lh extension.zip
