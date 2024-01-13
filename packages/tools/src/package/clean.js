/**
 * Remove all node_modules/@monorepo symlinks created by hoistLocal.js
 */
const { includes } = require('lodash');
const { exists, readdir } = require('fs');
const { promisify } = require('util');
const rimraf = require('rimraf');

const existsAsync = promisify(exists);
const rimrafAsync = promisify(rimraf);
const readdirAsync = promisify(readdir);

const monorepo = '@monorepo';

const clean = async () => {
  console.log(`Removing all ${monorepo}/* packages from the monorepo root`);

  const packages = await readdirAsync(`node_modules/${monorepo}`);
  await Promise.all(
    packages
      .filter((p) => !includes(p, 'tools'))
      .map(async (p) => {
        const symlinkPath = `node_modules/${monorepo}/${p}`;
        if (await existsAsync(symlinkPath)) {
          console.info('Removed symlink', symlinkPath);
          await rimrafAsync(symlinkPath);
        }
      }),
  );
};

module.exports = { clean };
