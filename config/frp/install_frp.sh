#!/usr/bin/env sh
INSTALL_DIR=$1

FRP_VERSION=0.59.0
ARCH="$(uname -m)"
if [ "$ARCH" = "aarch64" ]; then
  ARCH="arm64"
fi
FRP_URL="https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_${ARCH}.tar.gz"

# Create temporary directory for download
TMP_DIR=$(mktemp -d -t frp-XXXXXXXXXX)
DOWNLOAD_FILE="$TMP_DIR/frp_${FRP_VERSION}_linux_${ARCH}.tar.gz"

# Install frp
wget $FRP_URL -O "$DOWNLOAD_FILE" || {
  echo "Download failed"
  exit 1
}
tar -zxvf "$DOWNLOAD_FILE" -C "$TMP_DIR" || {
  echo "Extraction failed"
  exit 1
}
mv "$TMP_DIR/frp_${FRP_VERSION}_linux_${ARCH}" "$INSTALL_DIR" || {
  echo "Move operation failed"
  exit 1
}
rm -rf "$TMP_DIR"
