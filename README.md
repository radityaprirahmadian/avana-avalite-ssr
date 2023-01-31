# WA Commerce

> WA Commerce internally called as **avalite** or **avalite-ssr**. It is a webstore that is integrated with WhatsApp. It is a standalone webstore that can be used by any merchants.

Important links:

- [Figma](https://www.figma.com/file/IoIk0EPbOEdHMQwbnYO5JV/WhatsApp-Commerce?t=Y9sKkJp0D7IyA9b9-0)
- [GitHub Repository](https://github.com/avanaone/avalite-ssr/)
- Website:
  - [Production](https://commerce.avana.asia/)
  - [Sandbox](http://avalite-ssr.avana.link/testfe)
- [Detailed Diagram Flow](https://drive.google.com/file/d/1sQ5-GZIaNWdYsQMCUEF1hUitcfeXIe3t/view?usp=sharing)

## Branching

There are 3 main branches:

- **`master`:** act as source branch and production environment ([commerce.avana.asia](https://commerce.avana.asia/))
- **`sandbox`:** used for testing before merge to `master`. Usually QA team will test any features/hotfix in this branch ([avalite-ssr.avana.link](https://avalite-ssr.avana.link/))

Everytime there is a new feature/bugfix/improvement, create a new branch **from the master branch**. There are some rules to make branch naming consistent and easier to track later:

- **`Feature-<name>`:** used for new feature
- **`Bugfix-<name>`:** used for fixing bug
- **`Hotfix-<name>`:** used for fixing bug that need to quick merge
- **`Patch-<number>`:** used when we need multiple branches to merge into the `master` branch. First, merge branches into one patch branch and then merge to `master` branch.

Everytime any `feature`/`improvement`/`bugfix`/`hotfix` branch working was done, merge the branch to the `sandbox` branch first to be tested by the QA team. If the testing result from the QA team passed, merge the working branch to the `beta` branch. If the testing result passed, merge the working branch to `master` branch.

### Error or Conflict

If there are errors or the merged branch doesn't give expected results but it is working fine locally, then ask Devops team to track the building result if it fails or not. Or we can go to the deployment-notification channel on mattermost (at this moment while this documentation updated, 31/01/2023, the channel still not implemented yet).

## Development Setup

This project developed with the following tools/libraries:

- npm (_We use npm in most of our projects. So we really appreciate it if you follow our stack._)
- react v16.13.1
- tailwindcss ^1.4.6
- [@material-ui/icons ^4.9.1](https://v4.mui.com/components/material-icons/) for icons
- [@material-ui/core ^4.9.11](https://v4.mui.com/) for UI components

There are 2 environments for this project:

- **`.env.production` used for production:** Currently, avalite project still on beta staging. NPM script for this environment has the suffix `:production` (e.g. `npm run build:production`).
- **`.env.sandbox` used for sandbox environment:** Sandbox environment is useful when teammates want to review your work. Accessed via [avalite-ssr.avana.link](https://avalite-ssr.avana.link/). NPM script for this environment has the suffix `:sandbox` (e.g. `npm run build:sandbox`).

## Components

### @material-ui/core

```jsx
import { Button } from '@material-ui/core';

```

### Icon Component

```jsx
import { WhatsApp } from '@material-ui/icons'
```

## Project Folder and Structure

### _.github_ Folder

This folder is used to store the github action workflow. The workflow is used to build the project and deploy it to the server.

### _env_ Folder

There are two files in this folder. One is `.env.production` and the other is `.env.sandbox`. The `.env.production` is used for production environment and the `.env.sandbox` is used for sandbox environment.

### _src_ Folder

This folder is used to store all the source code of the project. The folder structure is as follows:

- _components_ folder: used to store all the components (in atomic design, it's a **atoms**) that will be used in the project.

- _configs_ folder: used to store all the configuration files that will be used in the project.

- _constants_ folder: used to store all the constants that will be used in the project.

- _helpers_ folder: used to store all the helper functions that will be used in the project.

- _pages_ folder: used to store all the pages (in atomic design, it's a **organisms**) that will be used in the project.

- _parts_ folder: used to store all the parts (in atomic design, it's a **molecules**) that will be used in the project.

### _tailwindcss_ Folder

This folder is used to store all the tailwindcss configuration files.