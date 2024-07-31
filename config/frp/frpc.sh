#!/usr/bin/env sh
FILE_DIR=$(dirname "$0")

# check for root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

INSTALL_DIR=/usr/local/bin/frp
SERVICE_DIR=/etc/systemd/system/frpc.service

# check for required env vars
if [ -z "$FRP_TOKEN" ]; then
  echo "Please set FRP_TOKEN"
  exit
fi
if [ -z "$SERVER_IP" ]; then
  echo "Please set SERVER_IP"
  exit
fi

# install frp
sh $FILE_DIR/install_frp.sh "$INSTALL_DIR"

# create config file
sed "s/__SERVER_IP__/${SERVER_IP}/" "$FILE_DIR/frpc/frpc.toml" \
  | sed "s/__FRP_TOKEN__/${FRP_TOKEN}/" \
  > "$INSTALL_DIR/frpc.toml"

# create service file
sed "s/__INSTALL_DIR__/'${INSTALL_DIR//\//\\/}'/g" "$FILE_DIR/frpc/frpc.service" > "$SERVICE_DIR"

# enable and start service
systemctl daemon-reload
systemctl enable frpc
systemctl start frpc
