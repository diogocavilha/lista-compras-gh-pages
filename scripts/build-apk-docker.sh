#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

IMAGE_NAME="lista-compras-android-builder"
APK_OUTPUT="$PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

echo "Building Docker image (first run downloads ~1GB of Android SDK)..."
docker build -f "$PROJECT_DIR/Dockerfile.android" -t "$IMAGE_NAME" "$PROJECT_DIR"

echo "Building APK..."
docker run --rm \
  -v "$PROJECT_DIR":/project \
  -v "$HOME/.gradle":/root/.gradle \
  "$IMAGE_NAME"

if [ -f "$APK_OUTPUT" ]; then
  echo ""
  echo "APK gerado com sucesso!"
  echo "  $APK_OUTPUT"
  echo ""
  echo "Para instalar via ADB:"
  echo "  adb install \"$APK_OUTPUT\""
else
  echo "APK nao encontrado. Verifique os logs acima."
  exit 1
fi
