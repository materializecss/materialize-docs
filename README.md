## Requirements

This project uses pnpm with workspaces. So pnpm [should be installed](https://pnpm.io/installation).

## Project generation

This project has been generated from with a `$ pnpm create vite` command and selecting the vanilla-ts project.

[Materialize](https://github.com/materializecss/materialize) has been added as a git submodule in packages folder and then defined as a [pnpm workspace](https://pnpm.io/workspaces), to use it as a monorepo.

Typescript has been configured to treat all projects in /packages folder as typescript packages.

head, navbar and footer in all html pages has been defined using [vite-plugin-handlebars](https://github.com/alexlafroscia/vite-plugin-handlebars).

## Instructions to develop

```
git clone https://github.com/materializecss/materialize-docs.git
cd materialize-docs
git submodule init
git submodule update
pnpm install
pnpm dev
```

This is a very convenient way to work in materialize or docs because all changes in both projects are inmediately displayed in the browser.

Also browser debugging displays the files exactly as they are in the source.

Note: when a new page is selected it takes some time to render completely the page. This not happens in the build version.

## Instructions to build site

- Pull the newest main branch from the [core repository](https://github.com/materializecss/materialize)

```
pnpm build
pnpm preview
```

### New Release (for Maintainers)

The docs should be kept in the core repo as markdown files for quick editing. This repo should then
collect all the markdown files from the core repo and compile them into a collection of nice html files,
The versions are managed in dist/version/ to keep different versions. The workflow was removed for now.

This has to be done after release process of the core repo and releasing on npm

- Switch to branch **v2-dev** and also pull newest package in [packages/materialize]()
- Update version string in **package.json**, **src/getting-started.html**, **partials/navbar.html**
- Run docs locally and check manually with `pnpm dev`
- Make commit to v2-dev (message: "chore: release 2.X.X")
- Make PR from v2-dev -> main
- Merge the PR (The deploy step to gh-pages should be executed)
- Spread news via social media channels
