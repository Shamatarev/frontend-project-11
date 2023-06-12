### Hexlet tests and linter status:
[![Actions Status](https://github.com/Shamatarev/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/Shamatarev/frontend-project-11/actions)

[![rss-reader-check](https://github.com/Shamatarev/frontend-project-11/actions/workflows/rssreader-check.yml/badge.svg)](https://github.com/Shamatarev/frontend-project-11/actions/workflows/rssreader-check.yml)

[![Maintainability](https://api.codeclimate.com/v1/badges/f8e7ccb8f0e894125f85/maintainability)](https://codeclimate.com/github/Shamatarev/frontend-project-11/maintainability)
# RSS-reader

[RSS-reader](https://frontend-project-11-neon-gamma.vercel.app/) – is a service for aggregating RSS feeds that makes it easy to read a variety of sources, such as blogs. It allows you to add an unlimited number of RSS feeds, updates them and adds new entries to the total stream.

## How to use:

Follow this [link](https://frontend-project-11-neon-gamma.vercel.app/)

Insert a valid RSS link in the input box. Click the Add button. The RSS feed will appear on your screen!
A preview of the post descriptions is displayed through a modal window after you click the "Preview" button.
You can also subscribe to multiple feeds at once by adding links to other sources.
Posts are updated automatically in real time.


## Installation for Developers:

#### Minimum system requirements
  Node.js 13.2.0 or higher

1. Clone the repository with the following command:
```sh 
git clone https://github.com/Shamatarev/frontend-project-11.git
```

2. Set up and run the RSS reader developer mode using the following commands:

```sh
make install
```

```sh
make develop
```
Compile the package with webpack using:

```sh
make build
```