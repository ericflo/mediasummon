
workflow "mediasummon release workflow" {
  on = "release"
  resolves = "upload binaries"
}

action "github official action" {
  uses = "actions/bin/sh@master"
  args = ["ls"]
}

action "docker action" {
  needs = "github official action"
  uses = "docker://node:6"
  args = ["node", "--version"]
}

action "build binaries" {
  needs = "docker action"
  uses = "sosedoff/actions/golang-build@master"
  args = ["github.com"]
}

action "upload darwin/386 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "mediasummon_darwin_386 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload darwin/amd64 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "/github/workspace/.release/mediasummon_darwin_amd64 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload linux/386 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "/github/workspace/.release/mediasummon_linux_386 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload linux/amd64 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "/github/workspace/.release/mediasummon_linux_amd64 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload windows/386 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "/github/workspace/.release/mediasummon_windows_386 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload windows/amd64 binary" {
  needs = "build binaries"
  uses = "JasonEtco/upload-to-release@master"
  args = "/github/workspace/.release/mediasummon_windows_amd64 application/octet-stream"
  secrets = ["GITHUB_TOKEN"]
}

action "upload binaries" {
  needs = [
    "upload darwin/386 binary"
    "upload darwin/amd64 binary"
    "upload linux/386 binary"
    "upload linux/amd64 binary"
    "upload windows/386 binary"
    "upload windows/amd64 binary"
  ]
  uses = "actions/bin/sh@master"
  args = "ls -ltr /github/workspace/.release/"
}
