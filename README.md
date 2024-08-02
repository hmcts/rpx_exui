# Manage Cases

To run the application locally please make sure you follow the prerequisite task of
Setting up Secrets locally as documented below.

Then follow: 
## Startup the Node service locally


1. Make sure you have local-development.json within /config, if you do not you can get this from an XUI team member.
2. Start the Node service locally using: 
`export IDAM_SECRET=* && export S2S_SECRET=* && export NODE_CONFIG_DIR=../config && export NODE_CONFIG_ENV=development
&& export ALLOW_CONFIG_MUTATIONS=1 && npm run start:node`


Explanation: 

NODE_CONFIG_DIR tells the machine where the configuration for the Node application is located.
NODE_CONFIG_ENV=development sets the machine so that the config that is used is local-development.json

@see https://github.com/lorenwest/node-config/wiki/Configuration-Files

## Startup the Angular service locally

Run `yarn start:ng` to start up the UI.

## Running unit tests 

Run `yarn test` to execute the unit tests on both the Angular and Node layers. Note that 
`yarn test` is run on the build pipelines.

## Linting 

Run `yarn lint` to execute all linting across both Angular and Node layers. Note that this
is run on the build pipelines.
Run `yarn lint:node` to execute note linting.

## PACT

Run `yarn test-pact` to run the PACT tests.

Run `yarn pact-stub` to run the PACT stub server. 

# Branches, Environment and Deployment methods used
# Branches, Environment and Deployment methods used 

```javascript
 |---------------------------------------|
 | Branch | Environment | Deployment via |
 |---------------------------------------|
 | local  | development | -              |
 | PR     | preview     | Jenkins        |
 | Master | aat         | Jenkins        |
 | Master | aat         | Flux           |
 | Master | ithc        | Flux           |
 | Master | production  | Flux           |
 |---------------------------------------|
```

# Path to configuration

The application should point to the configuration folder that contains the .json configuration files. There 
should only ever be three files within this folder:

`custom-environmental-variables.json` - Allows configuration values to be set by the machines environmental values.
Through the Jenkins pipelines they are overwritten by values.*.template.yaml files for the Preview and AAT enviroments.
On AKS they are only overwritten by the values.yaml file
`default.json` - Should contain Production configuration values as per Reform standards.
`local-development.json` - Is used for local development

Adding new files into /config should be avoided, as it increases complexity.

It increases complexity if we were to add files to /config as we already have the Preview and AAT Jenkins enviromental
values contained within values.preview.template.yaml and values.aat.template.yaml.

# Setting up Secrets locally (Required) 

You need to setup secrets locally before you run the project. Why? - When you push this application
up through AKS deployed through Flux to AAT, ITHC and Prod, the application will take in the secrets on these environments.

The developer needs to set these up locally, so that the developer can see any issues early in
the development process, and not when the application is placed up onto the higher AKS environments.

To setup the secrets locally do the following:

Note that Mac OS Catalina introduced a new feature that overlaps and reinforces the filesystem,
therefore you will not be able to make changes in the root directory of your file system, hence there are different
ways to setup secrets, Pre Catalina and Post Catalina, note that the Post Catalina way should work 
for all operating system, but I have yet to try this.

####MAC OS - Pre Catalina

1. Create a Mount point on your local machine<br/>
Create the folder: `/mnt/secrets/rpx`
2. In this folder we create a file per secret.
ie.
We create the file postgresql-admin-pw (no extension).
Within the file we have one line of characters which is the secret.

####MAC OS - Post Catalina 

1. Create a Mount point on your local machine within the Volumes folder<br/>
Create the folder: `/Volumes/mnt/secrets/rpx`
2. In this folder we create a file per secret.
ie.
We create the file postgresql-admin-pw (no extension).
Within the file we have one line of characters which is the secret.
3. If you want to test the secrets locally override the default mountPoint with the following additional option added to .addTo
ie. 
`propertiesVolume.addTo(secretsConfig, { mountPoint: '/Volumes/mnt/secrets/' });`

Note that this is connected into the application via the following pieces of code:
```javascript
  keyVaults:
    rpx:
      secrets:
        - postgresql-admin-pw
        - appinsights-instrumentationkey-tc
```

which in turn uses `propertiesVolume.addTo()`

# How Application Configuration (Node Config) Works

The application picks up the configuration from the /config .json files. 

The references within *.json ie. production.json are set by the /charts/xui-terms-and-conditions/values.yaml file ie.
POSTGRES_SERVER_PORT is set by POSTGRES_SERVER_PORT within values.yaml. <br><br>HOWEVER if there is a
values.*.template.yaml file it will override the values within the values.yaml file, BUT this only happens on the JENKINS
pipelines, where values.*.template.yaml are available to the build pipeline.

AKS uses a .json file in /config and the values.yaml from within charts/xui-terms-and-conditions ONLY.
 
 
AKS does not use values.aat.template.yaml and values.previews.template.yaml

DO NOT create a new .json file within /config as this increases the complexity of configuration. 

The 3rd party Node config package selects the file within /config based on `NODE_ENV` which is always production on all environments,
due to Reform standards, this does not change on different environments, it is always `NODE_ENV=production`

If production.json is not within /config, it's not in the case of Manage Cases, it will use the files in the order specified by
@see https://github.com/lorenwest/node-config/wiki/Configuration-Files

We DO NOT need to leverage `NODE_CONFIG_ENV` on the Manage Cases project - All application code be written so that it's 
not environment specific!

Note about secrets ie. 

```javascript
  keyVaults:
    rpx:
      secrets:
        - postgresql-admin-pw
        - appinsights-instrumentationkey-tc
 ```   
are set within the values.yaml and there should be NO REFERENCE to them within any /config/*.json file.

The application pulls out the secrets directly using `propertiesVolume.addTo()`

## Issues and Solutions

Property 'cookies' does not exist on type 'EnhancedRequest' - you will need to make
sure @types/express-session is added ie.
`yarn add @types/express-session`

### The following is the legacy readme.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running pure playwright end-to-end tests

Run `HEAD=true APPBASEURL=https://manage-case.aat.platform.hmcts.net yarn test:playwrightE2E` to execute the pure playwright end-to-end tests on aat via [Playwright](https://playwright.dev/).

## Running Consumer Driven Contract tests (pact)

Run `yarn test-pact` to execute the Pact tests 
For publishing the pacts to broker execute `yarn publish-pact`


## Integration Documentation

https://tools.hmcts.net/confluence/display/EUI/EXUI+Low+Level+Design

## Further help

To get more help on the Angular CLI use `ng help` or go and check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Logger errors and warnings

Extended version of script below:

(https://robferguson.org/blog/2017/09/09/a-simple-logging-service-for-angular-4/)

END
Trigger2 Trigger3
