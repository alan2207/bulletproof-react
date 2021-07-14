# Project Structure

Most of the code lives in the `src` folder and looks like this:

```
src
|
+-- assets            # assets folder can contain all the static data such as images, fonts, etc.
|
+-- components        # shared components used throughout the entire application
|
+-- config            # all global configuration, env variables etc. get exported from here and used in the app
|
+-- context           # all of the context
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used throughout the entire application
|
+-- lib               # reexporting different libraries preconfigured for the application
|
+-- routes            # routes configuration
|
+-- test              # test utilities and mock server
|
+-- utils             # shared utility functions
```

In order to scale the application in the easiest and most maintainable way, keep most of the code in the `features` folder, that should contain different feature-based modules. Every `feature` folder should contain domain specific code for a specific feature. This will allow you to keep functionalities scoped to a feature and not mix it with the shared things. This is much easier to maintain than a flat folder structure with many files.

A feature could have the following structure:

```
src/features/awesome-feature
|
+-- api         # exported functions that call different api endpoints related to the feature
|
+-- components  # components scoped to the feature, not used anywhere else
|
+-- hooks       # hooks scoped to the feature, not used anywhere else
|
+-- routes      # route components for the given feature
|
+-- types       # typescript types for the given feature
|
+-- utils       # utility functions used only by the feature
|
+-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```

The features could also contain other features(if used only within the parent feature) or kept separated, it's the matter of preference.

Everything from a feature should be exported from the `index.ts` file which behaves as the public API of the feature.

You should import stuff from other features only by using:

`import {AwesomeComponent} from "@/features/awesome-feature" `js

and not

`import {AwesomeComponent} from "@/features/awesome-feature/components/AwesomeComponent`

This can also been configured in the ESLint configuration to disallow the later import by the following rule:

```
{
    rules: {
        'no-restricted-imports': [
            'error',
            {
            patterns: ['@/features/*/*'],
            },
        ],

    ...rest of the configuration
}
```

This was inspired by how [NX](https://nx.dev/) handles libraries and applications. Think of a feature as a library or a module that is self-contained but can expose different part to other features via it's entry point.
