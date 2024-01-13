#!/usr/bin/env node

const yargs = require('yargs');
const { flow } = require('lodash');
const { hoistLocal } = require('../src/package/hoistLocal');
const { clean } = require('../src/package/clean');

async function main() {
  await yargs
    .command('package', 'Package', (packageYargs) => {
      return flow([addHoistLocal, addClean])(packageYargs).demandCommand();
    })
    .demandCommand()
    .strict()
    .help().argv;
}

/**
 *
 * @param {yargs.Argv<{}>} packageYargs
 * @returns {yargs.Argv<{}>}
 */
function addHoistLocal(packageYargs) {
  return packageYargs.command(
    'hoist-local',
    'Hoist local packages',
    {},
    hoistLocal,
  );
}

/**
 *
 * @param {yargs.Argv<{}>} packageYargs
 * @returns {yargs.Argv<{}>}
 */
function addClean(packageYargs) {
  return packageYargs.command('clean', 'Clan local packages', {}, clean);
}

main().catch((err) => {
  console.error('Failed to execute', err);
  process.exit(1);
});
