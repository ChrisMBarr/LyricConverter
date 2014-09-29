//Based on: http://stackoverflow.com/questions/18222665/huge-string-replace-in-javascript/18223111
var TextCleaner = (function() {

    //List out the Windows1252 strings (as unicode) that are representative of UTF-8 strings
    var toReplace = ["\\u00E2\\u201A\\u00AC", "\\u00C3\\u20AC", "\\u00C3", "\\u00E2\\u20AC\\u0161", "\\u00C3\\u201A", "\\u00C6\\u2019", "\\u00C3\\u0192", "\\u00E2\\u20AC\\u017E", "\\u00C3\\u201E", "\\u00E2\\u20AC\\u00A6", "\\u00C3\\u2026", "\\u00E2\\u20AC", "\\u00C3\\u2020", "\\u00E2\\u20AC\\u00A1", "\\u00C3\\u2021", "\\u00CB\\u2020", "\\u00C3\\u02C6", "\\u00E2\\u20AC\\u00B0", "\\u00C3\\u2030", "\\u00C5", "\\u00C3\\u0160", "\\u00E2\\u20AC\\u00B9", "\\u00C3\\u2039", "\\u00C5\\u2019", "\\u00C3\\u0152", "\\u00C3", "\\u00C5\\u00BD", "\\u00C3\\u017D", "\\u00C3", "\\u00C3", "\\u00E2\\u20AC\\u02DC", "\\u00C3\\u2018", "\\u00E2\\u20AC\\u2122", "\\u00C3\\u2019", "\\u00E2\\u20AC\\u0153", "\\u00C3\\u201C", "\\u00E2\\u20AC", "\\u00C3\\u201D", "\\u00E2\\u20AC\\u00A2", "\\u00C3\\u2022", "\\u00E2\\u20AC\\u201C", "\\u00C3\\u2013", "\\u00E2\\u20AC\\u201D", "\\u00C3\\u2014", "\\u00CB\\u0153", "\\u00C3\\u02DC", "\\u00E2\\u201E\\u00A2", "\\u00C3\\u2122", "\\u00C5\\u00A1", "\\u00C3\\u0161", "\\u00E2\\u20AC\\u00BA", "\\u00C3\\u203A", "\\u00C5\\u201C", "\\u00C3\\u0153", "\\u00C3", "\\u00C5\\u00BE", "\\u00C3\\u017E", "\\u00C5\\u00B8", "\\u00C3\\u0178", "\\u00C3", "\\u00C2\\u00A1", "\\u00C3\\u00A1", "\\u00C2\\u00A2", "\\u00C3\\u00A2", "\\u00C2\\u00A3", "\\u00C3\\u00A3", "\\u00C2\\u00A4", "\\u00C3\\u00A4", "\\u00C2\\u00A5", "\\u00C3\\u00A5", "\\u00C2\\u00A6", "\\u00C3\\u00A6", "\\u00C2\\u00A7", "\\u00C3\\u00A7", "\\u00C2\\u00A8", "\\u00C3\\u00A8", "\\u00C2\\u00A9", "\\u00C3\\u00A9", "\\u00C2\\u00AA", "\\u00C3\\u00AA", "\\u00C2\\u00AB", "\\u00C3\\u00AB", "\\u00C2\\u00AC", "\\u00C3\\u00AC", "\\u00C2\\u00AD", "\\u00C3\\u00AD", "\\u00C2\\u00AE", "\\u00C3\\u00AE", "\\u00C2\\u00AF", "\\u00C3\\u00AF", "\\u00C2\\u00B0", "\\u00C3\\u00B0", "\\u00C2\\u00B1", "\\u00C3\\u00B1", "\\u00C2\\u00B2", "\\u00C3\\u00B2", "\\u00C2\\u00B3", "\\u00C3\\u00B3", "\\u00C2\\u00B4", "\\u00C3\\u00B4", "\\u00C2\\u00B5", "\\u00C3\\u00B5", "\\u00C2\\u00B6", "\\u00C3\\u00B6", "\\u00C2\\u00B7", "\\u00C3\\u00B7", "\\u00C2\\u00B8", "\\u00C3\\u00B8", "\\u00C2\\u00B9", "\\u00C3\\u00B9", "\\u00C2\\u00BA", "\\u00C3\\u00BA", "\\u00C2\\u00BB", "\\u00C3\\u00BB", "\\u00C2\\u00BC", "\\u00C3\\u00BC", "\\u00C2\\u00BD", "\\u00C3\\u00BD", "\\u00C2\\u00BE", "\\u00C3\\u00BE", "\\u00C2\\u00BF", "\\u00C3\\u00BF"];

    //List out the UTF-8 string that we want to get back
    var replaceWith = ["€", "À", "Á", "‚", "Â", "ƒ", "Ã", "„", "Ä", "…", "Å", "†", "Æ", "‡", "Ç", "ˆ", "È", "‰", "É", "Š", "Ê", "‹", "Ë", "Œ", "Ì", "Í", "Ž", "Î", "Ï", "Ð", "‘", "Ñ", "’", "Ò", "“", "Ó", "”", "Ô", "•", "Õ", "–", "Ö", "—", "×", "˜", "Ø", "™", "Ù", "š", "Ú", "›", "Û", "œ", "Ü", "Ý", "ž", "Þ", "Ÿ", "ß", "à", "¡", "á", "¢", "â", "£", "ã", "¤", "ä", "¥", "å", "¦", "æ", "§", "ç", "¨", "è", "©", "é", "ª", "ê", "«", "ë", "¬", "ì", "­", "í", "®", "î", "¯", "ï", "°", "ð", "±", "ñ", "²", "ò", "³", "ó", "´", "ô", "µ", "õ", "¶", "ö", "·", "÷", "¸", "ø", "¹", "ù", "º", "ú", "»", "û", "¼", "ü", "½", "ý", "¾", "þ", "¿", "ÿ"];

    //Create an object map to associate the two arrays so we can look up a string and find it's replacement
    var map = {};
    for (var i = 0; i < toReplace.length; i++) {
        map[toReplace[i]] = replaceWith[i];
    }

    //Now that we have a map, let's sort the haystack from longerst to shortest
    toReplace.sort(function(a, b) {
        return b.length - a.length;
    });

    //Build up a regular expression to find the strings to replace
    var expression = new RegExp(toReplace.join("|"), "g");

    //via: http://buildingonmud.blogspot.com/2009/06/convert-string-to-unicode-in-javascript.html
    function _toUnicode(theString) {
        var unicodeString = '';
        for (var i = 0; i < theString.length; i++) {
            var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
            while (theUnicode.length < 4) {
                theUnicode = '0' + theUnicode;
            }
            theUnicode = '\\u' + theUnicode;
            unicodeString += theUnicode;
        }
        return unicodeString;
    }

    //Public function to convert from win1252 to UTF-8
    function convertWin1252ToUtf8(source) {
        //Use teh RegEx to search the string for matches, then replace any of them with the corresponding replacement string
        return source.replace(expression, function(m) {
            var unicodeVal = _toUnicode(m);
            //console.log(m, unicodeVal, map[unicodeVal]);
            return map[unicodeVal] || "";
        });
    }

    return {
        ConvertWin1252ToUtf8: convertWin1252ToUtf8
    };
})();