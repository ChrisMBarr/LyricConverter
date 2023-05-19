
# LyricConverter
Parses the song info & lyrics from various lyric presentation software file formats. You can convert between different formats and download the converted files.

### See it here: http://FiniteLooper.github.io/LyricConverter/
(previously on LyricConverter.com but no more)


## Formats
|                                                                    | Input  | Output |
| ------------------------------------------------------------------ |:------:| ------:|
| **[Pro Presenter](https://renewedvision.com/propresenter/) v4**    |   ✔️   |        |
| **[Pro Presenter](https://renewedvision.com/propresenter/) v5**    |   ✔️   |   ✔️  |
| **[Pro Presenter](https://renewedvision.com/propresenter/) v6***   |         |       |
| **[Pro Presenter](https://renewedvision.com/propresenter/) v7***   |         |       |
| **[SongShow Plus](https://songshowplus.com/) v7**                  |         |       |
| **[MediaShout](https://mediashout.com/)**                          |         |       |
| **[EasyWorship](https://easyworship.com/)** - [Issue #3][1]        |         |       |
| **[OpenLyrics](https://docs.openlyrics.org)** - [Issue #4][2]      |         |       |
| **[OpenSong](https://opensong.org/)** - [Issue #5][3]              |         |       |
| **[ChordPro](https://chordpro.org/)**                              |   ✔️   |   ✔️  |
| **[SongPro](https://songpro.org/)**                                |         |       |
| **Plain Text**                                                     |   ✔️   |   ✔️  |
| **LyricConverter JSON**                                            |   ✔️   |   ✔️  |

  *Note: You can import the ProPresenter v5 files made by LyricConverter into ProPresenter v6 & v7!

[1]: https://github.com/FiniteLooper/LyricConverter/issues/3
[2]: https://github.com/FiniteLooper/LyricConverter/issues/4
[3]: https://github.com/FiniteLooper/LyricConverter/issues/5


### TODO Items:
* Drag & drop over entire document
* Click to allow file selection
* Deal with possibly duplicated info keys
* Drop area message should be dynamic
* folder drop?
* Count how may files processes
* Error message displays
* Fix design for wide screens
* Multiple header images
* Redesign with TailWinds
* Allow user-configurable options for output file (resolution, text size, etc)


# Contributing
Want to help out and improve LyricConverter? Thanks!
You'll need to be familiar with Angular and TypeScript, which are needed to run this project.  Run `npm install @angular/cli typescript -g` to install the global tools you'll need.

Clone this project and run `npm install`. Afterwards run `ng serve` to start the development server, you can see it running at `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Tooling
I recommend you use [VSCode](https://code.visualstudio.com/) and install the recommended extensions when you open this project in it.

## Clean Code & Testing
* In VSCode press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> to run the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) code formatter.
* Run `ng lint` to report on any potential code issues
* Run `ng test` to run the unit tests. Please add tests for any new features or changes you make.
* Run `ng test --code-coverage --no-watch` to generate a code coverage report.  View the generated `/coverage/lyric-converter/index.html` file to see specifics about uncovered areas of code if needed.

## Build
* Run `ng build` to build the project in production mode which is stored in the `dist/` directory.


## Overview on how LyricConverter works
Anything added to this project will most likely be a new format for LyricConverter to either be able to read or write. So all you need to worry about is dealing with the inputs and outputs which are generalized TypeScript classes and not specific to the Angular framework at all.
* Arrays of all available **input types** and **output types** are kept in the `ParserService` at `/app/convert/parser/parser.service.ts` for the Angular app to manage.
* Lyric converter will take any files passed to it and run them each through all of the **input types** available to it.
  - All input types are classes in the `/app/convert/inputs/*` folder that implement the `IInputConverter` interface.
  - Files are passed to the `doesInputFileMatchThisType()` method which returns a `boolean`. Typically this only needs to check the file extension for most file types.
  - Once each incoming file type is known, it will use the `extractSongData()` method to get the song information and lyrics converted to a generic `ISong` format.
* Once all songs are in `ISong` format, all of these objects are passed to the **output type** that the user has selected
  - All output types are classes in the `/app/convert/outputs/*` folder that implement the `IOutputConverter` interface.
  - The `ISong` representation of the song is passed to `convertToType()` which manipulates it into a `string` representation of the file content for whatever the desired format is
  - That `string` is then put into an `IOutputFile` object and passed along to the UI for conversion to a real file to be downloaded

## Creating A New Input Type
* Open the `/app/convert/inputs/` directory in your command line _(in VSCode right click the folder > "Open in integrated terminal")_ and run `ng generate class input-type-whatever` and Angular will generate a new class file named `input-type-whatever.ts` and a test file `input-type-whatever.spec.ts`
* Open the newly generated TS file and make the class `export class InputTypeWhatever implements IInputConverter` and add the required properties and methods
* Open the `ParserService` at `/app/convert/parser/parser.service.ts` and add this new input type to the `inputConverters` array
* Look at other existing input types to get an idea of how these work. Basically you will need to manipulate the incoming data to extract the song info and the lyrics into the `ISong` format.
* Add tests to verify that this new input type can convert all kinds of variations of songs in whatever format this is into an `ISong` object

## Creating A New Output Type
* Open the `/app/convert/outputs/` directory in your command line _(in VSCode right click the folder > "Open in integrated terminal")_ and run `ng generate class output-type-whatever` and Angular will generate a new class file named `output-type-whatever.ts` and a test file `output-type-whatever.spec.ts`
* Open the newly generated TS file and make the class `export class OutputTypeWhatever implements IOutputConverter` and add the required properties and methods
* Open the `ParserService` at `/app/convert/parser/parser.service.ts` and add this new input type to the `outputConverters` array
* Look at other existing output types to get an idea of how these work. Basically you will need to take the incoming `ISong` object and create a `string` representation of whatever the file content of this format looks like and pass that off as an `IOutputFile` object.
   Add tests to verify that this new output type can take all kinds of `ISong` objects and convert them to the expected output `string`


> I am not in any way affiliated with R-Technics' [SongShow Plus](http://songshowplus.com/) or Renewed Vision's [ProPresenter](http://www.renewedvision.com/propresenter.php).
