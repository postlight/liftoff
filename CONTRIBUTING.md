# Contributing to Liftoff

Thank you for your interest in contributing to Liftoff!
It's people like you that make it a fun tool. The below guidelines will help
answer any questions you may have about the contribution process. We look
forward to receiving contributions from you — our community!

_Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating._

## Contents

- [Contributing to Liftoff](#contributing-to-liftoff)
  - [Contents](#contents)
  - [Ways to Contribute](#ways-to-contribute)
  - [Reporting a Bug](#reporting-a-bug)
    - [Security](#security)
  - [Requesting a Feature](#requesting-a-feature)
  - [Writing Documentation](#writing-documentation)
  - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Commit Style](#commit-style)
    - [Code Reviews](#code-reviews)
  - [Helpful Links and Information](#helpful-links-and-information)

## Ways to Contribute

There are many ways you can contribute to Liftoff. We
value each type of contribution and appreciate your help.

Here are a few examples of what we consider a contribution:

- Updates to source code, including bug fixes and improvements.
- Filing, organizing, and commenting on issues in the [issue tracker](https://github.com/postlight/liftoff/issues)
- Teaching others how to use Liftoff
- Community building and outreach

## Reporting a Bug

While bugs are unfortunate, they're a reality in software. We can't fix what we
don't know about, so please report liberally. If you're not sure if something is
a bug or not, feel free to file a bug anyway.

If you have the chance, before reporting a bug, please search existing issues,
as it's possible that someone else has already reported the error. This doesn't
always work, and sometimes it's hard to know what to search for, so consider
this extra credit. We won't mind if you accidentally file a duplicate report.

Opening an issue is as easy as following [this link](https://github.com/postlight/liftoff/issues/new)
and filling out the template.

### Security

If you find a security bug in Liftoff, send an email with a descriptive subject line
to [hello+labs@postlight.com](mailto:hello+labs@postlight.com). If you think
you’ve found a serious vulnerability, please do not file a public issue.

Your report will go to Postlight's core development team. You will receive
acknowledgement of the report in 24-48 hours, and our next steps should be to
release a fix.

A working list of public, known security-related issues can be found in the
[issue tracker](https://github.com/postlight/liftoff/issues?q=is%3Aopen+is%3Aissue+label%3Asecurity).

## Requesting a Feature

To request a change to the way that Liftoff works,
please open an issue in this repository named, "Feature Request: [Your Feature
Idea]," followed by your suggestion.

## Writing Documentation

Improvements to documentation are a great way to start contributing to Liftoff. The source for the official documentation are
Markdown files that live in this repository.

## Submitting a Pull Request

Want to make a change to Liftoff? Submit a pull
request! We use the "fork and pull" model [described
here](https://help.github.com/articles/creating-a-pull-request-from-a-fork).

**Before submitting a pull request**, please make sure you have updated any
documentation in the source code comments for APIs that you may have changed.

### Commit Style

Commit messages should follow the format outlined below:

`prefix: message in present tense`

|   Prefix | Description                                                              |
| -------: | :----------------------------------------------------------------------- |
|    chore | does not effect the production version of the app in any way.            |
|     deps | add, update, or remove a dependency.                                     |
|      doc | add, update, or remove documentation. no code changes.                   |
|       dx | improve the development experience of mercury core.                      |
|     feat | a feature or enhancement. can be incredibly small.                       |
|      fix | a bug fix for something that was broken.                                 |
|     perf | add, update, or fix a test.                                              |
| refactor | change code, but not functionality.                                      |
|    style | change code style, like removing whitespace. no functional code changes. |
|     test | add, update, or fix a test.                                              |

### Code Reviews

Once you have submitted a pull request, a member of the core team must review it
before it is merged. We try to review pull requests within 3 days but sometimes
fall behind. Feel free to reach out to the core team if you have not received a review after 3 days.

## Helpful Links and Information

Some useful places to look for information are:

- The main [README](./README.md) for this repository.

_Adapted from [Contributing to Node.js](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md)
and [ThinkUp Security and Data Privacy](http://thinkup.readthedocs.io/en/latest/install/security.html#thinkup-security-and-data-privacy)._
