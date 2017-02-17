// Example usage: npm --newVersion=2.7.2 run version

const fs = require('fs'),
  path = require('path'),
  config = {
    files: ['bower.json', 'package.json', 'index.html']
  };

/**
 * Convert node arguments into an object
 * @return {Object} Arguments
 */
const argvToObject = () => {
  const args = {};
  let arg = null;
  process.argv.forEach((val, index) => {
    if(/^--/.test(val)) {
      arg = {
        index: index,
        name: val.replace(/^--/, '')
      }
      return;
    }

    if(arg && ((arg.index+1 === index ))) {
      args[arg.name] = val;
    }
  });

  return args;
};

const updateVersion = (config) => {
  const args = argvToObject();
  const currentVersion = args.current;
  const newVersion = args.new;
  console.log(`Updating version from ${currentVersion} to ${newVersion}`);
  config.files.forEach((file) => {
    const filePath = path.join(__dirname, file);
    const regex = new RegExp(currentVersion, 'g');

    let contents = fs.readFileSync(filePath, 'utf-8');
    contents = contents.replace(regex, newVersion);
    fs.writeFileSync(filePath, contents);
  });

  console.log(`Updated version to ${newVersion}`);
};

updateVersion(config);
