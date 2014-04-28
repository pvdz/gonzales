> ¡Arriba! ¡Arriba! ¡Ándale! ¡Ándale!

The Gonzales project. About parsing JS as fast as possible. Anything is allowed as long as your parser does all the work and does it in JS.

Check the `bin/details.html` page for, well... details :)

To run the project in node simply run `bin/cli.js` from the project root. Adjust `data/parsers.js` and `data/sources.js` and toggle `defaultOn` for the entries you want enabled/disabled. `cli.js` does not take any parameters.

To add your own parser, add an entry to `/data/parsers.js` (you can copy-paste and modify an existing entry) and add the necessary files to `/data/parser/<yourparsername>/`. Gonzales will create a fresh `exports` object when loading each parser. In the `parsers.js` entry you can setup the `getParser` function to do the parser. This function will is called with that `exports` object, and `window` and expects a function back which it can call with one parameter (the input source) and which will start parsing. The result is not important (you should probably make it `throw` if it wasn't able to parse the input though). Return value for the `parse` function is not used. Please make sure it works before making a PR :)

Most existing parsers have been updated in August 2013. Of the projects that are still alive, I only couldn't update MentalJs because it's just a big mess at this point.
