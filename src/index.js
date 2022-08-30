import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import parseFile from './parsers.js';

const readFile = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  const format = path.extname(fullPath);
  const data = fs.readFileSync(fullPath);
  return { data, format };
};

const planeDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const keys = _.union(keys1, keys2).sort();
  const diff = keys.reduce((acc, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const diffObj2 = `\t- ${key}: ${value1}`;
    const diffObj1 = `\t+ ${key}: ${value2}`;
    const noDiff = `\t  ${key}: ${value1}`;
    if (value2 === undefined) {
      return [...acc, diffObj2];
    }
    if (value1 === undefined) {
      return [...acc, diffObj1];
    }
    if (value1 === value2) {
      return [...acc, noDiff];
    }
    return [...acc, diffObj2, diffObj1];
  }, []);
  return `{\n${diff.join('\n')}\n}`;
};

export default (path1, path2) => {
  const obj1 = parseFile(readFile(path1));
  const obj2 = parseFile(readFile(path2));
  return planeDiff(obj1, obj2);
};
