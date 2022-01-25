FROM koalaman/shellcheck-alpine as verify-sh
WORKDIR /src
COPY ./*.sh ./
RUN shellcheck -e SC1091,SC1090 ./*.sh

FROM node:17 AS restore
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM restore AS verify-format
ENV CI=true
RUN yarn verify-format

FROM restore AS test
ENV CI=true
# RUN yarn test
# Demo purpose:
RUN echo TODO: run the tests here!

FROM restore AS build
ENV CI=true
ARG public_url="."
ENV PUBLIC_URL="${public_url}"
# RUN yarn build
# Demo purpose:
RUN mkdir -p ./build
RUN mkdir -p ./build/static
RUN echo build $(date) > ./build/static/build.txt
RUN echo "{ \"demo\": \"TODO: generate the manifest file\" }" > ./build/asset-manifest.json

# Using specific digest (f7f7607...) to avoid unwanted changes in the non-oficial image
FROM ttionya/openssh-client@sha256:f7f7607d56f09a7c42e246e9c256ff51cf2f0802e3b2d88da6537bea516fe142 as final
COPY ./cdn-helpers/* ./
COPY --from=build /src/build ./build/
