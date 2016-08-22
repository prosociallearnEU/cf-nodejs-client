# Contribution Guidelines

1. [Linting](#linting)
2. [git](#git)

## Linting

We enforce some style rules for code in this repository using [eslint](http://eslint.org/). You can install a linting addon to a lot of editors and IDEs that will follow our linting rules.

We use [Strongloop's](https://github.com/strongloop/eslint-config-strongloop) eslint configuration module, which is installed via `npm`.  If you are using a linting addon and are seeing weird error messages, they can likely be fixed by running `npm i`.

If you decide to not install a linter addon, or cannot, you can run `npm run lint` to get a report of any style issues. Any issues not fixed will be caught during CI, and may prevent merging.

## git

This repository will be using a forking model.

After you've made changes to your fork, committed them, and pushed them, open a pull request against `master`.

Travis CI will run regression checks on your branch and post the results on the PR.

When merging into `master`, choose to squash commits when it makes sense.

### Useful Links for working with `git`

- [Tutorial](https://try.github.io/levels/1/challenges/1)
- [The simple stuff - workflow commands](http://rogerdudler.github.io/git-guide/)
