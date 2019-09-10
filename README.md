# Mediasummon

[![Documentation](https://godoc.org/github.com/ericflo/mediasummon?status.svg)](https://godoc.org/github.com/ericflo/mediasummon)
[![License](https://img.shields.io/github/license/ericflo/mediasummon.svg?maxAge=2592000)](https://github.com/ericflo/mediasummon/blob/master/LICENSE.md)

<img width="100" height="100" src="/admin/static/icons/apple-touch-icon.png?raw=true" />

### Summon your photos and videos back to you

Mediasummon is an open source application that fetches a copy of all your
photos and videos, and keeps them continuously backed up into one organized
directory either on your computer or on a cloud storage provider.

<p align="center">
  <img width="800" height="480" src="/admin/static/design/Figure.png?raw=true" />
</p>


## Supported media services

Mediasummon can connect to several online services to back up you media, and
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
./mediasummon_linux_amd64
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

**S3_AWS_ACCESS_KEY_ID**, **S3_AWS_SECRET_ACCESS_KEY**, and **S3_REGION**:
Credentials to access an S3, for used in syncing to a bucket.


## Per-user configuration

While environment-based configuration is the easiest way to get started,
Mediasummon also supports a configuration file option. The benefit of using
configuration files is that you can supply multiple, and then multiple
users can log in and use the same Mediasummon instance. Make accounts for
everyone in your family, and you can all share the same one!

