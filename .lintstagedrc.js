module.exports = {
  '*': 'prettier --write --ignore-unknown',
  '*.{js,ts,jsx,tsx,vue}': ['oxlint --fix', 'eslint --fix'],
};
