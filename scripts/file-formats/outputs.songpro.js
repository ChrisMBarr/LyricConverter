/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*global parser:false, console:false*/
/*exported console*/

/*=====================================================
 * OUTPUT for converting to SongPro format
=======================================================*/

(function() {
    var THIS_OUTPUT = 'songpro';
    var FILE_EXTENSION = ".txt";

    //Extend the outputs object on the parser to allow for HTML output
    parser.outputs[THIS_OUTPUT] = function(songList) {

        //Loop through and convert each file and add the 
        var convertedFileContents = [];
        var errorFiles = [];
        $.each(songList, function(i, song) {
            //try {
            convertedFileContents.push({
                name: song.name,
                data: _makeSongProFile(song.data)
            });
            //} catch (ex) {
            //    errorFiles.push(song.name);
            //}
        });

        //Display any errors if we have them
        if (errorFiles.length) {
            parser.displayError(errorFiles.join(", "), "Error converting the following " + errorFiles.length + " songs!");
        }

        //Complete! Show the success HTML
        parser.displaySuccessHtml(convertedFileContents, THIS_OUTPUT, FILE_EXTENSION);
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================

    function _makeSongProFile(songData) {
        var content = "#T\r\n";
        content += songData.title;

        window.console.log(content);

        return content;
    }

})();


//TEMP TEST STUFF
$(function() {
    parser.outputs.songpro([{
        name: "Your Grace Is Enough",
        data: {
            "title": "Great is your faithfulness O God",
            "info": [{
                "name": "Order",
                "value": "1C2CBC"
            }],
            "slides": [{
                "title": "Chorus",
                "lyrics": "Your grace is enough\r\nYour grace is enough\r\nYour grace is enough for me"
            }, {
                "title": "Verse 1",
                "lyrics": "Great is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart"
            }, {
                "title": "Verse 2",
                "lyrics": "Great is your love and justice God\r\nYou use the weak to lead the strong\r\nYou lead us in the song of your salvation\r\nAnd all your people sing along"
            }, {
                "title": "Verse 3",
                "lyrics": ""
            }, {
                "title": "Verse 4",
                "lyrics": ""
            }, {
                "title": "Verse 5",
                "lyrics": ""
            }, {
                "title": "Verse 6",
                "lyrics": ""
            }, {
                "title": "Verse 7",
                "lyrics": ""
            }, {
                "title": "Coda",
                "lyrics": "(Chorus 2.)\r\n\r\nYour grace is enough\r\nHeaven reaching down to us\r\nYour grace is enough for me\r\nGod, I see your grace is enough\r\nI'm covered in your love\r\nYour grace is enough for me\r\nFor me"
            }, {
                "title": "Bridge",
                "lyrics": "So remember you people\r\nRemember your children\r\nRemember your promise\r\nOh God"
            }]
        }
    }], $("#output"));
});