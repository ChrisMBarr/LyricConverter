import { TextCleaner } from './text-cleaner';

describe('TextCleaner', () => {
  it('toUnicode() should convert all characters in a given string to Unicode', () => {
    //NOTE: Slashes must be doubled from what the direct output is,
    //otherwise JS will just convert the string back to standard characters at runtime
    expect(TextCleaner.toUnicode('abcdefghijklmnopqrstuvwxyz')).toEqual(
      `\\u0061\\u0062\\u0063\\u0064\\u0065\\u0066\\u0067\\u0068\\u0069\\u006A\\u006B\\u006C\\u006D\\u006E\\u006F\\u0070\\u0071\\u0072\\u0073\\u0074\\u0075\\u0076\\u0077\\u0078\\u0079\\u007A`
    );
    expect(TextCleaner.toUnicode('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toEqual(
      '\\u0041\\u0042\\u0043\\u0044\\u0045\\u0046\\u0047\\u0048\\u0049\\u004A\\u004B\\u004C\\u004D\\u004E\\u004F\\u0050\\u0051\\u0052\\u0053\\u0054\\u0055\\u0056\\u0057\\u0058\\u0059\\u005A'
    );
    expect(TextCleaner.toUnicode('0123456789')).toEqual(
      '\\u0030\\u0031\\u0032\\u0033\\u0034\\u0035\\u0036\\u0037\\u0038\\u0039'
    );
    expect(TextCleaner.toUnicode('`~!@#$%^&*()_+[]\\{}|;\':",./<>?')).toEqual(
      '\\u0060\\u007E\\u0021\\u0040\\u0023\\u0024\\u0025\\u005E\\u0026\\u002A\\u0028\\u0029\\u005F\\u002B\\u005B\\u005D\\u005C\\u007B\\u007D\\u007C\\u003B\\u0027\\u003A\\u0022\\u002C\\u002E\\u002F\\u003C\\u003E\\u003F'
    );
  });

  it('convertWin1252ToUtf8() should keep standard English characters as they are', () => {
    expect(
      TextCleaner.convertWin1252ToUtf8('The quick brown dog jumped over the lazy fox')
    ).toEqual('The quick brown dog jumped over the lazy fox');
    expect(TextCleaner.convertWin1252ToUtf8('0123456789')).toEqual('0123456789');
    expect(TextCleaner.convertWin1252ToUtf8('`~!@#$%^&*()_+[]\\{}|;\':",./<>?')).toEqual(
      '`~!@#$%^&*()_+[]\\{}|;\':",./<>?'
    );
  });

  it('convertWin1252ToUtf8() should replace all Win1252 encoded characters with Utf8 characters in a given string', () => {
    expect(TextCleaner.convertWin1252ToUtf8('salvaciÃ³n')).toEqual('salvación');
    expect(TextCleaner.convertWin1252ToUtf8('enseÃ±as')).toEqual('enseñas');
    expect(TextCleaner.convertWin1252ToUtf8('perdÃ­ ­')).toEqual('perdí ­');
  });
});
