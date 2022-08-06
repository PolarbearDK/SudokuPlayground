# Sample repository setting up new Angular application with ESLint + Prettier - PolarbearDK style

### Install [Angular CLI](https://angular.io/cli)

`npm install -g @angular/cli`

### Create Angular project

`ng new <applicationName> <options>`

Example:
`ng new SudokuPlayground --strict --style=scss --routing`

### Install [Angular ESLint](https://github.com/angular-eslint/angular-eslint) (must be run from Angular application folder)

`ng add @angular-eslint/schematics`

### Install [prettier](https://github.com/prettier/prettier), [prettier-eslint](https://github.com/prettier/prettier-eslint), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) and [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)

`npm install prettier prettier-eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-simple-import-sort --save-dev`

### ESLint configuration

Filename: `.eslintrc.json`

```json
// https://github.com/angular-eslint/angular-eslint#notes-for-eslint-plugin-prettier-users
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["tsconfig.json", "e2e/tsconfig.json"],
        "createDefaultProgram": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:prettier/recommended"
      ],
      "plugins": ["simple-import-sort"],
      "rules": {
        "@typescript-eslint/member-ordering": 0,
        "@typescript-eslint/naming-convention": 0,
        "prettier/prettier": [
          "error",
          {
            "endOfLine": "auto"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "arrow-parens": ["warn", "as-needed"],
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": [
          "error",
          {
            "groups": [
              // Side effect imports.
              ["^\\u0000"],
              // Packages.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              ["^@?\\w"],
              // Absolute imports and other imports such as Vue-style `@/foo`.
              // Anything not matched in another group.
              ["^"],
              // Relative imports.
              // Anything that starts with a dot.
              ["^\\.", "^src/"]
            ]
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {}
    }
  ]
}
```

### Prettier Configuration

Filename: `.prettierrc`

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "es5",
  "bracketSameLine": true,
  "printWidth": 160
}
```

Filename: `.prettierignore`

```
.angular
build
coverage
e2e
node_modules
```

### VSCode <applicationname>.code-workspace

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "[html]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },
      "editor.formatOnSave": false
    },
    "[typescript]": {
      "editor.defaultFormatter": "dbaeumer.vscode-eslint",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },
      "editor.formatOnSave": false
    }
  },
  "extensions": {
    "recommendations": [
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "Angular.ng-template",
      // Optional extensions
      "cyrilletuzi.angular-schematics",
      "adrianwilczynski.switcher",
      "ChakrounAnas.turbo-console-log",
      "ghaschel.vscode-angular-html"
    ]
  }
}
```

### Add Fix Lint and Prettier errors command in package.json

`"lint": "ng lint --fix"`
