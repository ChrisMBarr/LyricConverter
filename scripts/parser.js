/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution - NonCommercial - ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*globals isDev:false*/

var parser = (function() {

    var showDebugErrors = isDev;

    var utilities = {
        decode: function(str) {
            var decoded = window.atob(str);
            try {
                return decodeURIComponent(window.escape(decoded));
            } catch (ex) {
                return decoded;
            }
        },
        encode: function(str) {
            return window.btoa(window.unescape(encodeURIComponent(str)));
        },
        stripRtf: function(str) {
            //var pattern =         /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
            //var basicRtfPattern = /\{\*?\\[^{}]+}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
            var basicRtfPattern = /\{\*?\\[^{}]+;}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
            
            var newLineSlashesPattern = /\\\n/g;

            var stripped = str.replace(basicRtfPattern, "");
            var removeNewlineSlashes = stripped.replace(newLineSlashesPattern, "\n");
            var removeWhitespace = removeNewlineSlashes.trim();

            return removeWhitespace;
        }
    };

    function tryParseFile(i, fileObj) {
        if (showDebugErrors) {
            parseFile(i, fileObj);
        } else {
            try {
                parseFile(i, fileObj);
            } catch (ex) {
                if (window.console) {
                    window.console.error(ex);
                }
                parser.errorList.push("There was an error reading the file <strong>" + fileObj.name + "</strong>");
            }
        }
    }

    function parseFile(i, fileObj) {

        //Find the file extension
        var fileParts = fileObj.name.split('.');
        var fileExt = fileParts.slice(-1)[0].toLowerCase();
        var fileName = fileObj.name.replace('.' + fileExt, '');

        //window.console.log(fileObj);
        
        if(!fileObj.data){
            parser.errorList.push("It looks like <strong>"+fileObj.name+"</strong> might be a folder, which LyricConverter can't read! Be sure to drop the actual files onto LyricConverter, <em>not a folder</em>!");
        }else{

            //Browsers will add some unneeded text to the base64 encoding. Remove it.
            var encodedSongData = fileObj.data.replace(/^data:.*;base64,/, "");
            var decodedSongData = utilities.decode(encodedSongData);
    
    
            //Test the file extension with the test function registered with each format type
            //When one matches, use that formats convert function
            var convertFn;
            $.each(parser.formats, function(format, formatObj) {
                if (formatObj.testFormat(fileExt, decodedSongData)) {
                    convertFn = formatObj.convert;
                    return false;
                }
            });
    
            //Make sure the convert function exists...
            if ($.isFunction(convertFn)) {
                //Pass the decoded song date to the convert function
                //We will get back a normalized version of the song content for the supported file type
                var songData = convertFn(decodedSongData, fileName);
    
                if ($.isArray(songData)) {
                    //If we get an array of song data back, add them all!
                    for (var j = 0; j < songData.length; j++) {
                        parser.songList.push({
                            name: fileName + "(" + songData[j].title + ")",
                            data: songData[j]
                        });
                    }
                } else {
                    //If we just get a single song object back, just add it
                    parser.songList.push({
                        name: fileName,
                        data: songData
                    });
                }
            } else {
                parser.errorList.push("The file <strong>" + fileObj.name + "</strong> cannot be parsed either because <strong>." + fileExt.toUpperCase() + "</strong> files are not supported, or this file is improperly formatted!");
            }
        }
    }

    function complete($outputContainer) {
        if (parser.songList.length) {
            //Pass the final song data to the selected output type
            parser.outputs[parser.outputFormat](parser.songList, $outputContainer);
        }
    }

    return {
        //Expose functions publicly
        utilities: utilities,
        parseFile: tryParseFile,
        complete: complete,
        outputFormat: null,

        //UI properties should be filled in when this is run
        displayError: null,
        displaySuccessHtml: null,
        songList: [],
        errorList: [],

        //These objects will be filled in when formatter & output files are run
        formats: {},
        outputs: {}
    };
})();
