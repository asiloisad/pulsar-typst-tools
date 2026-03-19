const path = require("path");

/**
 * Get the output file path for a Typst source file.
 * @param {string} typFilePath - Path to the .typ file
 * @param {string} format - Output format (pdf, png, svg)
 * @returns {string} Output file path
 */
function getOutputPath(typFilePath, format = "pdf") {
  return typFilePath.replace(/\.typ$/, `.${format}`);
}

/**
 * Get the source .typ file path for a given output file.
 * @param {string} outputPath - Path to the output file (e.g., .pdf)
 * @returns {string} Corresponding .typ file path
 */
function getSourcePath(outputPath) {
  const ext = path.extname(outputPath);
  return outputPath.replace(new RegExp(`\\${ext}$`), ".typ");
}

module.exports = { getOutputPath, getSourcePath };
