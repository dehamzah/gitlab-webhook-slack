module.exports = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => `<@${item}>`);
  } else if (typeof input === "string") {
    return `<@${input}>`;
  }

  return null;
};
