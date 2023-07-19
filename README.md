[![GitHub - release](https://img.shields.io/github/v/release/FiniteLooper/LyricConverter?style=flat)](https://github.com/FiniteLooper/LyricConverter/releases/latest)
[![GitHub - build](https://img.shields.io/github/actions/workflow/status/FiniteLooper/LyricConverter/publish-to-gh-pages.yml?logo=github&style=flat)](https://github.com/FiniteLooper/LyricConverter/actions/workflows/publish-to-gh-pages.yml)

# LyricConverter
Parses the song info & lyrics from various lyric presentation software file formats. You can convert between different formats and download the converted files.

### Use it here: https://LyricConverter.net

![Lyric Converter Screen Recording](https://github.com/FiniteLooper/LyricConverter/blob/master/lyric-converter-demo.gif?raw=true)

## Formats
|                                                                    | Input  | Output |
|:-------------------------------------------------------------------|:------:|:------:|
| **[ChordPro](https://chordpro.org/)**                              |   ✅   |   ✅  |
| **[EasyWorship](https://easyworship.com/)** - [Issue #3][1]        |   ⭕   |   ⭕  |
| **JSON**                                                           |   ✅   |   ✅  |
| **[MediaShout](https://mediashout.com/)**                          |   ⭕   |   ⭕  |
| **[OpenSong](https://opensong.org/)** - [Issue #5][2]              |   ⭕   |   ⭕  |
| **[OpenLyrics](https://docs.openlyrics.org)**                      |   ✅   |   ✅  |
| **Plain Text**                                                     |   ✅   |   ✅  |
| **[ProPresenter](https://renewedvision.com/propresenter/) v4**     |   ✅   |   ⭕  |
| **[ProPresenter](https://renewedvision.com/propresenter/) v5**     |   ✅   |   ✅  |
| **[ProPresenter](https://renewedvision.com/propresenter/) v6**     |   ✅    |  ✅  |
| **[ProPresenter](https://renewedvision.com/propresenter/) v7**💾  |   ⭕    |  ⭕  |
| **[SongPro](https://songpro.org/)**                                |   ✅   |   ✅  |
| **[SongShow Plus](https://songshowplus.com/) v7**                  |   ✅   |   ⭕  |
| **[SongShow Plus](https://songshowplus.com/) v8**                  |   ❓   |   ⭕  |
| **[SongShow Plus](https://songshowplus.com/) v9**                  |   ❓   |   ⭕  |

* ✅ = Supported
* ⭕ = Not supported (yet?)
* ❓ = Unknown/Untested
* 💾 = You can import the ProPresenter 6 files made by LyricConverter into ProPresenter 7!

[1]: https://github.com/FiniteLooper/LyricConverter/issues/3
[2]: https://github.com/FiniteLooper/LyricConverter/issues/5


### LyricConverter uses these projects for extracting from and/or creating song files
* [FiniteLooper/ProPresenter-Parser](https://github.com/FiniteLooper/ProPresenter-Parser)
* [FiniteLooper/OpenLyrics-Parser](https://github.com/FiniteLooper/OpenLyrics-Parser)
* [FiniteLooper/SongShowPlus-Parser](https://github.com/FiniteLooper/SongShowPlus-Parser)
* [SongProOrg/songpro-javascript](https://github.com/SongProOrg/songpro-javascript)

### LyricConverter relies heavily on these projects
* [Microsoft/TypeScript](https://github.com/microsoft/typescript)
* [Angular/angular](https://github.com/angular/angular)
* [NaturalIntelligence/fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser/)
* [eligrey/FileSaver.js](https://github.com/eligrey/FileSaver.js)

### TODO Items:
* Deal with possibly duplicated info keys
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
* Run `npm run test-coverage` to generate a test coverage report.  View the generated `/coverage/lyric-converter/index.html` file to see specifics about uncovered areas of code if needed.

## Build
* Run `ng build` to build the project in production mode which is stored in the `dist/` directory.
* Run `npm run prerender` to generate the prerendered HTML pages for each route - this is what is deployed to production


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


> I am not in any way affiliated with R-Technics' [SongShow Plus](https://songshowplus.com/) or Renewed Vision's [ProPresenter](https://www.renewedvision.com/propresenter.php).
