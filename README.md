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

```
pnpm build
pnpm preview
```

### New Release (for Maintainers)

- Execute the release process in the core package incl. releasing on npm
- Update versions in **getting-started.html**, **partials/navbar.html**
- Run docs locally and check manually
- Make commit to dev (message: "chore: release 2.X.X")
- Make PR in GitHub from dev -> main
- Merge the PR
- Party and spread the news via social media channels 🎉
