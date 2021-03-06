# Mediasummon

[![Documentation](https://godoc.org/github.com/ericflo/mediasummon?status.svg)](https://godoc.org/github.com/ericflo/mediasummon)
[![License](https://img.shields.io/github/license/ericflo/mediasummon.svg)](https://github.com/ericflo/mediasummon/blob/master/LICENSE.md)
[![Build Status](https://github.com/ericflo/mediasummon/workflows/mediasummon%20release%20workflow/badge.svg)](https://github.com/ericflo/mediasummon/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/ericflo/mediasummon)](https://hub.docker.com/r/ericflo/mediasummon)

<img width="100" height="100" src="/admin/static/icons/apple-touch-icon.png?raw=true" />

### Summon your photos and videos back to you

Mediasummon is an open source application that fetches a copy of all your
photos and videos, and keeps them continuously backed up into one organized
directory either on your computer or on a cloud storage provider.

<p align="center">
  <img height="480" src="/admin/static/design/Figure.png?raw=true" />
</p>


## Supported media services

Mediasummon can connect to several online services to back up your media, and
once you have authorized it to do so, it will periodically connect to each
service and download any new photos or videos you have uploaded. Currently
supported:

* Google Photos
* Instagram
* Facebook Photos


## Supported cloud storage

You can store the downloaded files in a directory on your computer, or you can
have Mediasummon synchronize the files to a directory on a cloud storage
provider like Dropbox, Google Drive, or Amazon's S3. You don't have to
pick one, you can synchronize to several of these at once:

* Dropbox
* Google Drive
* Amazon S3


## Installation

Mediasummon is a single executable binary, so the easiest way to install it is
to download it, make it executable, and run it:

```console
curl -LO https://github.com/ericflo/mediasummon/releases/latest/download/mediasummon_linux_amd64
chmod +x ./mediasummon_linux_amd64
./mediasummon_linux_amd64 admin
```

To set it up to start when your system starts, set up a systemd configuration
in `/lib/systemd/system/mediasummon.service` like so, making sure to edit the
instances of `USERNAME` to your actual username and change `mediasummon_linux_amd64`
to the executable for your system:

```ini
[Unit]
Description=mediasummon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=5s
WorkingDirectory=/home/USERNAME
User=USERNAME
Group=USERNAME
ExecStart=/home/USERNAME/mediasummon_linux_amd64 admin

[Install]
WantedBy=multi-user.target
```

To set environment variables on startup, set them under the `Service` section
like so:

```ini
[Service]
...
Environment=PORT=5050
Environment=FRONTEND_URL=http://myhost.local:5050
```

Finally, run the following commands to start it up:

```console
sudo service mediasummon start
sudo service mediasummon enable
```

If you're a fan of Docker, there's an official image at `ericflo/mediasummon`.
Running it via Docker looks like this:

```console
mkdir -p ~/mediasummon
docker container run \
  -it --rm -p 5000:5000 \
  --mount type=bind,source=~/mediasummon,target=/mediasummon \
  ericflo/mediasummon:latest admin
```

This example sets it up to sync file to a new `~/mediasummon` directory,
running the admin web interface at [http://localhost:5000](http://localhost:5000).

### The default username is `mediasummon` and the default password is `admin`


## Raspberry Pi Installation Video Tutorial
[![Instagram-to-Raspberry Pi backup in 8 minutes](https://img.youtube.com/vi/-UrIY5Se2f0/0.jpg)](https://www.youtube.com/watch?v=-UrIY5Se2f0)

## Configuration

The easiest way to configure Mediasummon is using environment variables. If you
set any of the following env vars, Mediasummon will use your provided setting.
It also checks for a `.env` file in the current directory following
[dotenv](https://github.com/motdotla/dotenv) syntax, so you can either provide
the env vars environmentally, or by updating the contents of `.env`.

**DEFAULT_TARGET**: The target directory you want to save your photos to.
Examples of this would be: `~/mediasummon`, `s3://bucketname`,
`dropbox://Mediasummon`, `gdrive://Mediasummon`. The default default is
`~/mediasummon`.

**IS_DEBUG**: Set to `true` if you're just testing things out or working on
Mediasummon itself, otherwise leave empty or set to `false`.

**IS_HTTPS**: Set to `true` if you're hosting the http service securely as HTTPS,
otherwise leave empty or set to `false`.

**FRONTEND_URL**: This is the URL to the admin frontend, which defaults to
`http://localhost:5000`.

**PORT**: The port to host the admin frontend on. Somewhat redundant to
``FRONTEND_URL``, but split out for Reasons. Defaults to `5000`.

**CSRF_SECRET**: A 32 byte secret used to protect against cross site request
forgery. If not provided, one will be generated and saved in .env in the
current directory.

**NUM_FETCHERS**: The maximum number of concurrent fetchers to run per media
service. Defaults to `6`, which should be fine for most users.

**The following are especially optional**, because they can be provided via the
admin. However if you'd like to provide them using env vars, here they are:

**{GOOGLE,INSTAGRAM,FACEBOOK,DROPBOX,GDRIVE}_CLIENT_ID**: Client credentials to
the OAuth application to auth with for the given service.

**{GOOGLE,INSTAGRAM,FACEBOOK,DROPBOX,GDRIVE}_CLIENT_SECRET**: Client secret to
the OAuth application to auth with for the given service.

**AWS_ACCESS_KEY_ID**, **AWS_SECRET_ACCESS_KEY**, and **AWS_DEFAULT_REGION**:
Credentials to access an S3, for used in syncing to a bucket.


## Per-user configuration

While environment-based configuration is the easiest way to get started,
Mediasummon also supports a configuration file option. The benefit of using
configuration files is that you can supply multiple, and then multiple
users can log in and use the same Mediasummon instance. Make accounts for
everyone in your family, and you can all share the same one!

