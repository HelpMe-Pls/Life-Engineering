# Monorepo
- Addresses the drawbacks of polyrepo:
	- **Cumbersome code sharing**: reconciling incompatible versions of third party libraries across repositories
	- **Code/logic duplication**: teams just write their own implementations of *common services* and components in each repo
	- **Inconsistent tooling**: inconsistency creates mental overhead of remembering which commands to use from project to project.
	- **Costly cross-repo changes**: apply the changes across multiple repositories with disconnected revision histories.
- Benefits:
	- **No overhead** to create new projects: no need to publish versioned packages because all consumers are in the same repo.
	- **Atomic commits** across projects: no such thing as a breaking change when you fix everything in the same commit.
	- **One version** of everything: no need to worry about incompatibilities because of projects depending on conflicting versions of third party libraries.
	- **Developer mobility**: confidently contribute to other teams’ applications and verify that their changes are safe.

## Workspace
- Workspaces (managed by your [package manager](https://pnpm.io/workspaces)) are the building blocks of your monorepo. Each app and package you add to your monorepo will be **inside its own workspace**.
- This means that whenever you add/remove workspaces, or change their locations (or configuration) on the filesystem, you'll need to re-run your `install` command from root to set up your workspaces again.
	- If you run into issues, you may have to delete each `node_modules` folder in your repository and re-run `install` to correct it.
## Turborepo
- Turborepo is an intelligent build system optimized for JS and TS codebases. It uses caching to turbocharge your local setup and speed up your CI.