# Salat [![npm version](https://badge.fury.io/js/salat.svg)](https://badge.fury.io/js/salat)

## Description

> Daily prayer time in all the cities in [Morocco](https://www.google.com/search?q=morocco) :morocco:, directly in your terminal, at the tip of your fingers


**A stupid simple Command line utility to get the daily prayers time for all the citiy in Morocco**

The source of the data is [the Moroccan Ministery Website](http://www.habous.gov.ma)

## Getting started

```bash
# Install

$ npm i -g salat

# Run with default city

$ salat

# Run with custom city

$ salat [cityName]
```

Alternatively, if you don't want to install it globally, you can just use:

```bash
npx salat
```

`City name should be provided the same way it's written in the cities.json`

## Output

```bash
# The programs prints to the console the prayers' time for the current day in the default city as shown bellow:
```
![screen 1](images/screenShot1.png)
![screen 2](images/screenShot2.png)
![screen 3](images/screenShot3.png)


## Dependecies

The code behind depends on :

- [axios](https://github.com/axios/axios) to make an http request ( fetch the data).
- [jsdom](https://github.com/jsdom/jsdom) to parse the html result.
- [chalk](https://github.com/chalk/chalk) to avoid boring styles and colors.
- [node-localstorage](https://github.com/lmaccherone/node-localstorage) to read and write from localstorage.

## Change the default city

- The default city is :heart: [Marrakech](https://www.google.com/search?q=marrakech) :heart:, set as a value for the `DEFAULT_CITY` variable in `./constants.js`

- You can change it by replacing `Marrakech` by your city name according to the values from `./data/cities.json`

## Help

- Please keep in mind that this is a work in progress in a very early stages, any help is appreciated and more than welcome.

- If you think this piece of code is anyhow useful, please feel free to `contribute`, `star` :star::star: and `share` 🙏 🙏

## Todo

- [x] Use a default city
- [x] Use localstorage-like api for caching purposes
- [x] Display execution time
- [ ] Improve performance
- [ ] Add unit tests
- [ ] Add a documentation site
- [ ] Command to set the default city
- [ ] Command to display the list of available cities
- [ ] Command to display the time table for the whole month

## License

This project is under the MIT license.

### Built With :heart: in Ramadan
