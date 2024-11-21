// src/generateExamples.js
const fs = require("fs");
const path = require("path");

const examplesDirectory = path.join(__dirname, "examples");
const outputFilePath = path.join(__dirname, "examples.js");

function generateExamples() {
  const examples = [];
  const files = fs.readdirSync(examplesDirectory);

  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(examplesDirectory, file);
      const example = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const svgFilePath = path.join(
        examplesDirectory,
        `${path.basename(file, ".json")}.svg`
      );
      if (fs.existsSync(svgFilePath)) {
        example.figure = fs.readFileSync(svgFilePath, "utf-8");
      }
      examples.push(example);
    }
  });

  const outputContent = `export const examples = ${JSON.stringify(
    examples,
    null,
    2
  )};`;
  fs.writeFileSync(outputFilePath, outputContent, "utf-8");
}

generateExamples();
