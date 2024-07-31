#!/usr/bin/env sh
FILE_DIR=$(dirname "$0")

# check for root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

INSTALL_DIR=/usr/local/bin/frp
SERVICE_DIR=/etc/systemd/system/frps.service

# check for required env vars
if [ -z "$FRP_TOKEN" ]; then
  echo "Please set FRP_TOKEN"
  exit
fi
if [ -z "$DASHBOARD_USER" ]; then
  echo "Please set DASHBOARD_USER"
  exit
fi
if [ -z "$DASHBOARD_PASSWORD" ]; then
  echo "Please set DASHBOARD_PASSWORD"
  exit
fi

# install frp
sh $FILE_DIR/install_frp.sh "$INSTALL_DIR"

# create config file
sed "s/__FRP_TOKEN__/${FRP_TOKEN}/" "$FILE_DIR/frps/frps.toml" \
  | sed "s/__DASHBOARD_USER__/${DASHBOARD_USER}/" \
  | sed "s/__DASHBOARD_PASSWORD__/${DASHBOARD_PASSWORD}/" \
  > "$INSTALL_DIR/frps.toml"

# create service file
sed "s/__INSTALL_DIR__/'${INSTALL_DIR//\//\\/}'/g" "$FILE_DIR/frps/frps.service" > "$SERVICE_DIR"

# enable and start service
systemctl daemon-reload
systemctl enable frps
systemctl start frps
