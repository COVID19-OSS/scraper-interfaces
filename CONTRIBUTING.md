# How to contribute

COVID19-OSS is GPL-3.0 Licensed and accepts contributions via GitHub pull requests. This document outlines some of the conventions on commit message formatting, contact points for developers, and other resources to help get contributions.

# Email and chat

- Email: contact@covid19.fyi
- Discord: https://discord.gg/WPPXc8

## Getting started

- Fork the repository on GitHub
- Read the README.md for build instructions

## Reporting bugs and creating issues

TODO

## Contribution flow

This is a rough outline of what a contributor's workflow looks like:

- Create a topic branch from where to base the contribution. This is usually master.
- Make commits of logical units.
- Make sure commit messages are in the proper format (see below).
- Push changes in a topic branch to a personal fork of the repository.
- Submit a pull request to COVID19-OSS/scraper-interfaces.
- The PR must receive a LGTM from any maintainers found in the CODEOWNERS file.

Thanks for contributing!

### Code style

TODO

### Format of the commit message

We follow a rough convention for commit messages that is designed to answer two
questions: what changed and why. The subject line should feature the what and
the body of the commit should describe the why. [Reference](https://chris.beams.io/posts/git-commit/)

```
Summarize changes in around 50 characters or less

More detailed explanatory text, if necessary. Wrap it to about 72
characters or so. In some contexts, the first line is treated as the
subject of the commit and the rest of the text as the body. The
blank line separating the summary from the body is critical (unless
you omit the body entirely); various tools like `log`, `shortlog`
and `rebase` can get confused if you run the two together.

Explain the problem that this commit is solving. Focus on why you
are making this change as opposed to how (the code explains that).
Are there side effects or other unintuitive consequences of this
change? Here's the place to explain them.

Further paragraphs come after blank lines.

 - Bullet points are okay, too

 - Typically a hyphen or asterisk is used for the bullet, preceded
   by a single space, with blank lines in between, but conventions
   vary here

If you use an issue tracker, put references to them at the bottom,
like this:

Fixes #123
```

The format can be described more formally as follows:

```
<what changed>
<BLANK LINE>
<why this change was made>
<BLANK LINE>
<footer>
```