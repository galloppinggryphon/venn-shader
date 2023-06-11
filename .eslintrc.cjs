const indentSpaces = 3

module.exports = {
   env: { browser: true, es2020: true, node: true },
   extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
   ],
   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
   settings: { react: { version: '18.2' } },
   plugins: [ 'react-refresh' ],
   rules: {
      // === React ===
      'react-refresh/only-export-components': 'warn',

      // Disallow unnecessary JSX expressions when literals alone are sufficient
      'react/jsx-curly-brace-presence': [ 'warn', {
         props: 'ignore', children: 'never',
      } ],
      'react/jsx-curly-spacing': [ 'warn', {
         when: 'always',
         children: true,
         objectLiterals: 'never',
      } ],
      'react/jsx-indent': [ 'warn',
         indentSpaces,
         {
            indentLogicalExpressions: true,
         },
      ],
      'react/jsx-indent-props': [ 'warn',
         {
            indentMode: indentSpaces,
            first: true,
         },
      ],
      'react/prop-types': 'off',
      'react/jsx-props-no-multi-spaces': 'warn',
      'react/jsx-tag-spacing': [ 'warn', {
         beforeSelfClosing: 'always',
      } ],

      // === Off ===
      'arrow-spacing': 'off',
      camelcase: 'off',
      'consistent-return': 'off',
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-nested-ternary': 'off',

      'no-var': 'off',

      // === Eslint ===
      'array-bracket-spacing': [ 'warn', 'always' ],
      'arrow-parens': [ 'warn', 'always' ],
      'brace-style': [ 'warn', 'stroustrup' ],
      // camelcase: [ 'warn', { properties: 'never' } ],
      'comma-dangle': [ 'warn', 'always-multiline' ],
      'comma-spacing': [ 'warn', { before: false, after: true } ],
      'comma-style': 'warn',
      'computed-property-spacing': [ 'warn', 'always' ],
      'constructor-super': 'error',
      curly: [ 'warn', 'all' ],
      'dot-notation': 'error',
      'eol-last': 'warn',
      eqeqeq: [ 'error', 'smart' ],
      'func-call-spacing': [ 'warn', 'never' ],
      indent: [
         'warn',
         indentSpaces,
         {
            SwitchCase: 1,
         },
      ],
      'key-spacing': [
         'warn',
         {
            beforeColon: false,
            afterColon: true,
         },
      ],
      'keyword-spacing': [
         'warn',
         {
            before: true,
            after: true,
         },
      ],
      'linebreak-style': [ 'error', 'unix' ],
      'lines-around-comment': 'off',
      'no-alert': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-const-assign': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-eval': 'error',
      'no-extra-semi': 'error',
      'no-fallthrough': 'warn',
      'no-lonely-if': 'warn',
      'no-mixed-operators': 'error',
      'no-mixed-spaces-and-tabs': 'warn',
      'no-multi-spaces': [ 'warn', {
         ignoreEOLComments: true,
      } ],
      'no-multi-str': 'off',
      'no-multiple-empty-lines': [ 'warn', { max: 1 } ],
      // 'no-negated-in-lhs': 'error', //deprecated
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-trailing-spaces': 'warn',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unreachable': 'warn',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-return': 'warn',
      'no-whitespace-before-property': 'warn',

      'object-curly-spacing': [ 'warn', 'always' ],
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'padded-blocks': [ 'warn', 'never' ],
      'quote-props': [ 'warn', 'as-needed' ],
      quotes: [
         'warn',
         'single',
         {
            avoidEscape: true,
            allowTemplateLiterals: true,
         },
      ],
      semi: [
         'warn',
         'never',
         {
            beforeStatementContinuationChars: 'always',
         },
      ],
      'semi-spacing': [ 'warn', {
         before: false,
         after: true,
      } ],
      'space-before-blocks': 'warn',
      'space-before-function-paren': [ 'warn', 'never' ],

      'space-in-parens': [ 'warn', 'always' ],
      'space-infix-ops': [ 'warn' ],
      'space-unary-ops': [
         'warn',
         {
            words: true,
            nonwords: false,
            overrides: {
               '!': true,
               '!!': true,
            },
         },
      ],
      'spaced-comment': [ 'warn', 'always' ],
      'switch-colon-spacing': [ 'warn' ],
      // 'template-curly-spacing': [ 'warn', 'always' ],
      'template-tag-spacing': [ 'warn', 'always' ],
      'valid-typeof': 'warn',
      yoda: 'off',
   },
}
