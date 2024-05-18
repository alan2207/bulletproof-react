# 🗄️ Project Structure

Most of the code lives in the `src` folder and looks something like this:

```sh
src
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- providers         # all of the application providers
|
+-- routes            # routes of the application
|
+-- stores            # global state stores
|
+-- test              # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
```

For easy scalability and maintenance, organize most of the code within the features folder. Each feature folder should contain code specific to that feature, keeping things neatly separated. This approach helps prevent mixing feature-related code with shared components, making it simpler to manage and maintain the codebase compared to having many files in a flat folder structure. By adopting this method, you can enhance collaboration, readability, and scalability in the application's architecture.

A feature could have the following structure:

```sh
src/features/awesome-feature
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- assets      # assets folder can contain all the static files for a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- hooks       # hooks scoped to a specific feature
|
+-- stores      # state stores for a specific feature
|
+-- types       # typescript types used within the feature
|
+-- utils       # utility functions for a specific feature
```

NOTE: You don't need all of these folders for every feature. Only include the ones that are necessary for the feature.

Previously, it was recommended to use barrel files to export all the files from a feature. However, it can cause issues for Vite to do tree shaking and can lead to performance issues. Therefore, it is recommended to import the files directly.

It might be a bad idea to import across the features. Instead, compose different features at the application level. This way, you can ensure that each feature is independent and can be easily moved or removed without affecting other parts of the application and also makes the codebase less convoluted.

To forbid cross-feature imports, you can use ESLint:

```js
'import/no-restricted-paths': [
    'error',
    {
        zones: [
            // disables cross-feature imports:
            // eg. src/features/auth should not import from src/features/comments, etc.
            {
                target: './src/features/auth',
                from: './src/features',
                except: ['./auth'],
            },
            {
                target: './src/features/comments',
                from: './src/features',
                except: ['./comments'],
            },
            {
                target: './src/features/discussions',
                from: './src/features',
                except: ['./discussions'],
            },
            {
                target: './src/features/teams',
                from: './src/features',
                except: ['./teams'],
            },
            {
                target: './src/features/users',
                from: './src/features',
                except: ['./users'],
            },

            // More restrictions...
        ],
    },
],
```

You might also want to enforce unidirectional codebase architecture. This means that the code should flow in one direction, from the top to the bottom of the application. This is a good practice to follow as it makes the codebase more predictable and easier to understand. To enforce this, you can use ESLint:

```js
'import/no-restricted-paths': [
    'error',
    {
    zones: [
        // Previous restrictions...

        // enforce unidirectional codebase:
        // e.g. src/app can import from src/features but not the other way around
        {
            target: './src/features',
            from: './src/app',
        },

        // e.g src/features and src/app can import from these shared modules but not the other way around
        {
            target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
            ],
            from: ['./src/features', './src/app'],
        },
    ],
    },
],
```
