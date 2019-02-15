# Airtable-as-CMS

Airtable-as-CMS is a nifty tool that lets you create a static website from an Airtable table and style it with custom CSS.

## Quick Start

This readme goes pretty in depth with how to set up this project on your computer. Here are the basics in case you want to jump right in. You'll likely want to skim through other parts of this document as you go, but this will get you started!

1. Create an [Airtable](https://www.airtable.com) base if you haven't already
2. `git clone` this repo
3. `yarn install` to install dependencies
4. `yarn setup` for a walkthrough on setting environment variables
5. `yarn run start:dev` to start up the webpack dev server
6. [Make changes to your Airtable base](#setting-up-your-airtable-base)
7. [Style your site](#styling)
8. [Deploy your site](#deploying-your-site)

## Table of Contents

1. [Getting Started](#getting-started)
   - [Cloning this Repo](#cloning-this-repo)
   - [Installing Yarn](#installing-yarn)
   - [Environment setup](#environment-setup)
   - [Setting up your environment variables](#setting-up-your-environment-variables)
2. [Setting up your Airtable base](#setting-up-your-airtable-base)
   - [Supported field types](#supported-field-types)
   - [Markdown](#markdown)
3. [Development](#development)
4. [Build](#build)
5. [Styling](#styling)
   - [Default classes](#default-classes)
   - [Favicon](#favicon)
6. [Custom renderers](#custom-renderers)
7. [Deploying your site](#deploying-your-site)

## Getting Started

### Cloning/downloading this repo

You can download a Zip file of this repo by clicking on the button shown here near the top of this page:

![Downloading this repo](/readme-assets/git-clone.png)

If you're familiar with git, you can also clone it in the normal way.

### Installing Yarn

This project uses [Yarn](https://yarnpkg.com) to download and manage copies of the third party code we used to build it. If you already have Yarn installed, you can skip to the next section. Otherwise, you can follow the instructions [here](https://yarnpkg.com/lang/en/docs/install/#mac-stable) to install it for macOS or [here](https://yarnpkg.com/lang/en/docs/install/#windows-stable) to install it for Windows.

If you're a Mac user, you may want to install Homebrew if you haven't already. Homebrew is a package manager that will allow you to easily download, install, and manage software such as Yarn. You can follow the instructions on [the Homebrew website]((https://brew.sh/) or you can install it from the command line by:

1. Opening up a terminal window via the "Terminal" application
2. Copy and pasting the following into the terminal window and hitting Enter/Return

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

After the installation completes, you can then open a new terminal window (Cmd+T works) and run `brew install yarn` to install Yarn.

When that's done, open up another terminal window and run `yarn install`. This will download the 3rd party code this project needs in order to work.

### Environment setup

This project uses environment variables to store credentials such as your Airtable API key, so we'll need to set those up before we can move onto more exciting things. Luckily this is pretty simple: all you have to do is create a file called `.env` in the root directory of this project and populate it with your values. Head to the [.env.example](./.env.example) file to get an idea of what your `.env` file should look like (feel free to copy and paste!). Make sure to replace the values after each equal sign `=` with your own value (we'll cover how to find your values next).

#### Setting up your environment variables

Here, we'll talk about how to set up the environment variables this project needs to run. All of them can be found by going to the right place on the Airtable website.

First, go to your terminal window and run the command `yarn setup`. This runs a script that will walk you through each step of the process. Simply follow the instructions, enter the value the prompts ask you for, and press enter to move on to the next step. If you want to change an environment variable after the fact, you can either go to the `.env` file in the root directory of this project, or you can run `yarn setup` again.

**AIRTABLE_API_KEY**:

For this one, head to [your Airtable account page](https://www.airtable.com/account). From there, find the `API` section and click the `Generate API key` button if you haven't previously generated a key. Copy and paste the key as-is into your `.env` file so that it looks something like `AIRTABLE_API_KEY=keyBKHVUZpvdE25DY`, with your own key replacing that fake one.

If you don't know what an API key is, it's basically a way to let Airtable know that _you_ know this project is going to use data from your Airtable base to create a website. This is a way to keep your data safe from being accessed by unauthorized users.

## Setting up your Airtable base

### Supported field types

This project currently supports most but not all Airtable field types. The only field types it doesn't currently support are "Link to another record", "Barcode", and "Collaborator". For "Attachment" types, it currently only supports image files.

### Publishing rows

You can mark rows as "published" if you include a Checkbox-type field in your table named "Published". Any row that doesn't have a checkmark in that field will not be displayed on your site. This makes it easy to make drafts of your rows before allowing them to be seen on the Internet. If you don't include this field, every row will be displayed by default.

## Development

Entering `yarn run start:dev` into a terminal window will fire up a server that will allow you to view your site and style it in real time. By default, it will run at `localhost:8080`—just put that in your browser's URL bar and you'll be able to see your site. Each time you save after editing CSS or custom renderers, your work will be automatically reflected in the browser.

## Build

Running `yarn build` in a terminal window will execute a build script that will generate your site. The generated site will live in the `/dist` folder.

## Styling

Any CSS put in the `styles.css` file at `/custom/styles.css` will be injected into your site for styling purposes.

Your field names will always be added as classes in the corresponding HTML. So for example, a field called "Title" will generate an HTML element with the class `.Title`. There are other classes that are put in by default, detailed below. You can make use of these classes to style the site to your liking.

### Default classes

- `.attachments`: placed on attachment-type fields
- `.field-name`: placed on the element containing the name of each field
- `.field-value`: placed on the element containing the value of each field
- `.row-link`: placed on each row on the homepage
- `.row`: placed on each row
- `.header`: placed on the header
- `.index-page` placed on an element that wraps the homepage
- `.nav-button` placed on back/next navigation buttons

### Favicon

You can include a [favicon](https://wikipedia.org/Favicon) for your website by putting a `favicon.ico` image file in the `/custom` directory. It must conform to favicon specifications, meaning it should be a `.ico` file and should be 16x16 or 32x32 pixels in size.

## Custom renderers

To add a custom renderer for one of your fields, create a React component that accepts `name` and `value` as props in the `/custom/renderers` folder, then import and export it in `custom/renderers/index.js`. The name of the file and component must match the name of the column you would like it to serve as renderer for. If the name of your column includes spaces, do not include the spaces in the name of the corresponding file and component. So a custom renderer for a column called "Body Text" should be a React component called `BodyText` in a file called `custom/renderers/BodyText.js` and exported from `custom/renderers/index.js` as such.

## Deploying your site

There are many ways you can deploy your site. One service we often use at Postlight is [Netlify](https://netlify.com). You can follow instructions on their site to get your site up and running—the main things you need to remember for this process are that the folder you want to deploy is `/dist` and the command you need to run to build the site is `yarn build`.
