#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import { versionFromString } from "number3rd";
import { parse as parsePath } from "path";
import { parse as parseRan3Tabular } from "tabular3rd";
import { testCases } from "tabular3rd-lint";

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
