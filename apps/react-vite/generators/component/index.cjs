const path = require('path');
const fs = require('fs');

const featuresDir = path.join(process.cwd(), 'src/features');
const features = fs.readdirSync(featuresDir);

/**
 *
 * @type {import('plop').PlopGenerator}
 */
module.exports = {
  description: 'Component Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name',
    },
    {
      type: 'list',
      name: 'feature',
      message: 'Which feature does this component belong to?',
      choices: ['components', ...features],
      when: () => features.length > 0,
    },
    {
      type: 'input',
      name: 'folder',
      message: 'folder in components',
      when: ({ feature }) => !feature || feature === 'components',
    },
  ],
  actions: (answers) => {
    const componentGeneratePath =
      !answers.feature || answers.feature === 'components'
        ? 'src/components/{{folder}}'
        : 'src/features/{{feature}}/components';
    return [
      {
        type: 'add',
        path: componentGeneratePath + '/{{kebabCase name}}/index.ts',
        templateFile: 'generators/component/index.ts.hbs',
      },
      {
        type: 'add',
        path:
          componentGeneratePath + '/{{kebabCase name}}/{{kebabCase name}}.tsx',
        templateFile: 'generators/component/component.tsx.hbs',
      },
      {
        type: 'add',
        path:
          componentGeneratePath +
          '/{{kebabCase name}}/{{kebabCase name}}.stories.tsx',
        templateFile: 'generators/component/component.stories.tsx.hbs',
      },
    ];
  },
};
