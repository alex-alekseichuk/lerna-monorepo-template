#!/usr/bin/env node
const fs = require('fs-extra');
const yargs = require('yargs');

console.log('script1 tool:');

const configFile = '.development.local.env';
if (fs.existsSync(configFile)) {
  console.log('there is local file');
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  // require('dotenv').config({ path: configFile });
} else {
  console.log('there is no local file');
}

async function main() {
  const rootYargs = yargs(process.argv.slice(2));
  await rootYargs
    .command('test [config]', 'Test config', (yargs) => {
      yargs.positional('config', {
        type: 'string',
        demand: true,
        describe: 'Path to config'
      })
    }, function (argv) {
      console.log('Config:', argv.config);
      const config = fs.readJsonSync(argv.config);
      console.log(config);
    })
    .demandCommand()
    .strict()
    .help()
    .argv;
}

main()