# Mediasummon
### Summon your photos and videos back to you

Mediasummon is an open source application that fetches a copy of all your
photos and videos, and keeps them continuously backed up into one organized
directory either on your computer or on a cloud storage provider.

<p align="center">
  <img width="800" height="480" src="/admin/static/design/Figure.png?raw=true" />
</p>

## Supported Media Services

Mediasummon can connect to several online services to back up you media, and
once you have authorized it to do so, it will periodically connect to each
service and download any new photos or videos you have uploaded. Currently
supported:

* Google Photos
* Instagram
* Facebook Photos

## Supported Cloud Storage

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

```bash
curl -O https://github.com/ericflo/mediasummon/releases/download/mediasummon-0.0.1/mediasummon_linux_amd64
chmod +x ./mediasummon_linux_amd64
./mediasummon_linux_amd64
```