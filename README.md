
## Install requirement

- **Nodejs**: 10.16.0 (every version >= 8.\* is OK)
- **Mysql**: 5.7.25

## Development environments

- **LCL**: Local environment
- **DEV**: Development environment
- **STG**: Staging environment
- **PRO**: Production environment


- The configuration file with the corresponding environments is located in the directory `env`.
- Command line without specify environment, the default environment is `LCL`

## Install project và run server

- **Step 1:** Clone git repository:
- **Step 2:** Install packages:
  `npm install`
- **Step 3:** In folder env:

  - Copy file `LCL.env.example`
  - Rename to `LCL.env`

    Change configuration to connect database , redis at local, ...

- **Step 4:** Running server
  - Normal run: `npm start`
  - Watch run: `npm run watch`

## Create database

- At **Step 4** in **Install**, **database migration** process will be run automatically.

  Refer to the list of environments in the above section.

## Api docs

- To **create API docs**, run `./gendoc.sh`
- To **view API docs**, open file path: `doc/apidoc/index.html`

## Sequelize

Sequelize is an ORM used for SQL. Read document [Sequelize](http://docs.sequelizejs.com/).
In this project, Sequelize is configured to read corresponding environment variables.

To run command lines of Sequelize, run file `sequelizer.sh` and provide configurations same as sequelize-cli

**Example:**

- `./sequelizer db:migrate`
- `./sequelizer migration:generate --env=DEV`
  If --env provided, default is `--env=LCL`

## Build and deploy

- **Step 1:** run `npm run build`, folder `dist` will be created.
- **Step 2:** run `NODE_ENV=DEV pm2 start dist/app.js`
  If `pm2` not installed, run `npm install pm2 -g`
