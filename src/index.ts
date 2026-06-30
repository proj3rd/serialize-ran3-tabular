#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import { parse as parsePath } from "path";
import { parse as parseRan3Tabular } from "tabular3rd";
import { testCases } from "tabular3rd-lint";

function versionFromChar(char: string) {
  const converted = Number(char);
  if (!Number.isNaN(converted)) {
    return converted;
  }
  return char.charCodeAt(0) - "a".charCodeAt(0) + 10;
}

function versionFromString(str: string) {
  const unit = str.length / 3;
  return [0, 1, 2]
    .map((step) => str.substring(step * unit, (step + 1) * unit))
    .map(versionFromChar);
}

async function commandSerialize(path: string) {
  const { name } = parsePath(path);
  const content = readFileSync(path);
  const parsed = await parseRan3Tabular(content);
  const lastIndexOfHyphen = name.lastIndexOf("-");
  if (lastIndexOfHyphen !== -1) {
    const specNum = name.substring(0, lastIndexOfHyphen);
    const versionString = name.substring(lastIndexOfHyphen + 1);
    const version = versionFromString(versionString).join(".");
    testCases.forEach((testCase) => {
      testCase(parsed, specNum, version);
    });
  }
  writeFileSync(`${name}.tabular.json`, JSON.stringify(parsed));
}

const program = new Command();
program
  .name("serialize-ran3-tabular")
  .description("3GPP RAN3 tabular specification serializer");

program
  .description(
    "Serialize 3GPP RAN3 tabular definition from a file of a given path"
  )
  .argument(
    "<path>",
    "path of a .docx file containing 3GPP RAN3 tabular definition"
  )
  .action((path) => commandSerialize(path));

program.parse();
