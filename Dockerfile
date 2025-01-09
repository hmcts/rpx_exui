FROM hmctspublic.azurecr.io/base/node:18-alpine as base
LABEL maintainer = "HMCTS Expert UI <https://github.com/hmcts>"

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./

RUN yarn

FROM base as build

COPY --chown=hmcts:hmcts . .

RUN yarn build && rm -r node_modules/ && yarn cache clean

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000
CMD [ "yarn", "start" ]
