FROM golang:1.13-alpine

# Set up the mediasummon dir, env, and default target
ENV MEDIASUMMON_DIR /mediasummon
VOLUME ${MEDIASUMMON_DIR}
ENV DEFAULT_TARGET "file:///${MEDIASUMMON_DIR}"

# Copy in the mediasummon source and build it
WORKDIR /usr/src/mediasummon
ADD . /usr/src/mediasummon
RUN go build -o /usr/bin/mediasummon

# Set up the etc dir for config and working dir
WORKDIR /etc/mediasummon
RUN cp -R /usr/src/mediasummon/admin /etc/mediasummon/

# Entrypoint is the binary but we'll leave the working dir as the setup mediasummon dir
ENTRYPOINT ["/usr/bin/mediasummon"]