---
title: Remote Communication
---

# Remote Communication

While the 4G module allows the catamaran to access the Internet, the catamaran can only actively connect to the Internet, 
but not the other way around, which means that the catamaran cannot be accessed from the Internet.

To solve this problem, we used [frp](https://github.com/fatedier/frp) to establish a reverse proxy, so that we can send 
data to the catamaran through an intermediate server.

## frp

I wrote scripts to automate the deployment of frp. Those scripts can be found on [GitHub](https://github.com/BrandenXia/OceanCleanX/tree/main/config/frp).

> Note: Those scripts are written for Ubuntu 18.04 and require root privileges to run.

### Installation

Get the scripts:
```shell
$ git clone https://github.com/BrandenXia/OceanCleanX.git
$ cd OceanCleanX/config/frp
```

Setup necessary environment variables:
```shell
$ export FRP_TOKEN="your_token"
$ export DASHBOARD_USER="your_user"
$ export DASHBOARD_PASSWORD="your_password"
$ export SERVER_IP="your_server_ip"
```

Server side:
```shell
$ sudo ./frps.sh
```

Client side:
```shell
$ sudo ./frpc.sh
```

### File Structure

The scripts are organized as follows:

```shell
$ tree config/frp
config/frp
├── frpc
│   ├── frpc.service
│   └── frpc.toml
├── frpc.sh
├── frps
│   ├── frps.service
│   └── frps.toml
├── frps.sh
└── install_frp.sh

3 directories, 7 files
```

- `install_frp.sh`: Install frp, does not need to be executed manually, called by `frpc.sh` and `frps.sh`
- `frps`: frp server configuration
  - `frps.toml`: configuration file for frp server
  - `frps.service`: systemd service file for frp server
- `frpc`: frp client configuration
  - `frpc.toml`: configuration file for frp client
  - `frpc.service`: systemd service file for frp client

Those scripts will use previous files to setup frp on the server and client side:
- `frps.sh`: setup frp on the server side
- `frpc.sh`: setup frp on the client side
