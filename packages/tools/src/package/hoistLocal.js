const { flatten } = require('lodash');
const rimraf = require('rimraf');

const { resolve } = require('path');
const getRelativePath = require('get-relative-path');
const { readFile, symlink, mkdirp } = require('fs-extra');
const { exists } = require('fs');
const { promisify } = require('util');
const glob = require('glob');

const existsAsync = promisify(exists);
const rimrafAsync = promisify(rimraf);
const globAsync = promisify(glob);

const monorepo = '@monorepo';

const hoistLocal = async () => {
  await mkdirp(`node_modules/${monorepo}`);

  /**
   * @type {{packages: string[]}}
   */
  const { packages } = JSON.parse(await readFile(`lerna.json`, 'utf8'));

  const localPackages = flatten(
    await Promise.all(
      packages.map(async (packagePattern) => {
        return globAsync(packagePattern);
      }),
    ),
  );

  await removeNestedSymlinks({ localPackages });
  await createRootSymlinks({
    localPackages,
  });
};

/**
 * @param {object} input
 * @param {string[]} input.localPackages
 */
async function removeNestedSymlinks({ localPackages }) {
  await Promise.all(
    localPackages.map(async (localPackage) => {
      const symlinkPath = `${localPackage}/node_modules/${monorepo}`;
      if (await existsAsync(symlinkPath)) {
        console.log('Removing symlink', symlinkPath);
        await rimrafAsync(symlinkPath);
      }
    }),
  );
}

/**
 * @param {object} input
 * @param {string[]} input.localPackages
 */
async function createRootSymlinks({ localPackages }) {
  await Promise.all(
    localPackages.map(async (localPackage) => {
      if (!(await existsAsync(`${localPackage}/package.json`))) {
        return;
      }

      const { name } = JSON.parse(
        await readFile(`${localPackage}/package.json`, 'utf8'),
      );
      const symlinkPath = `node_modules/${name}`;
      console.log('Creating symlink', symlinkPath);
      if (!(await existsAsync(symlinkPath))) {
        await symlink(
          getRelativePath(resolve(symlinkPath), resolve(localPackage)),
          symlinkPath,
        );
      }
    }),
  );
}

module.exports = { hoistLocal };
