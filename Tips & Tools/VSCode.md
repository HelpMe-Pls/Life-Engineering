## Short keys 
Ctrl + `[` or `]`: Code block indent

Alt + ↑ or ↓: Move the selected *line*/code block 

Alt + Shift + ⮜ or ⮞: Move the selected TEXT to left/right

Alt + Click: Multiplying cursors at clicked position

Ctrl + D: Select next same text of the current selected one, Ctrl + D + K to skip the current selected

Ctrl + Alt + ↑ or ↓: Multiline editing

Ctrl + / or Shift + Alt + A: comment the selected code

Shift + Alt + ↑ or ↓: Duplicate line of code based on current position

Ctrl + Shift + K: Delete whole current line 
OR 
Shift + Del (works like a shortcut of Ctrl + X for that line without having to select it & not saving it in the clipboard) 

clg + Tab: `console.log()`

`.` To open the online VSCode in a [GitHub](https://github.com) repo when you visit 

Open DevTool's console: Ctrl + Shift + `I`
To clear DevTool's console history: Ctrl + Shift + P then type "clear" then choose it

The equivalent of `npx` is `pn dlx` (for download) or `pn exec` for running executables

#### Wrap a block of code inside a new scope:
- Select text (optional)
- Open command palette (usually Ctrl+Shift+P)
- Type in: Emmet: Wrap with Abbreviation then hit Enter
- Enter a tag name (or an abbreviation .className>p) then hit Enter

#### ToLower - ToUpper:
- Select text
- Ctrl + Shift + P
- Type in upper or lower on your preference
- Hit Enter


---
### Initial setups for a new project 
[1] Add this to `package.json` (or `.prettierrc` file) and you'll have to restart VSCode for it to work:
"prettier": {	
    "trailingComma": "es5",	// or "none" || "all"
    "tabWidth": 2,
    "useTabs": true,
    "semi": false,
    "singleQuote": true
 }

[2] IF decided to use yarn: `yarn set version berry`
Add `nodeLinker: node-modules` to `.yarnrc.yml` file if there's `Cannot find module...` error

[3] `.gitignore`:
node_modules/
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

[4] `.eslintrc.js`:
module.exports = {
  extends: ['react-app'],
  root: true,
  plugins: ['react-hooks'],
  rules: {
    'no-nested-ternary': 'off',
    'no-var': 'warn',
    'no-undef': 'warn',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'no-constant-condition': 'off',
    'consistent-return': 'warn',
    'default-case': 'off',
    'react/require-default-props': 'warn',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'prettier/prettier': 'off',
     eqeqeq: 'warn',
  },
};