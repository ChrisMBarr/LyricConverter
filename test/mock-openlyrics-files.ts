import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockOpenLyricsFileSimpleFile: IRawDataFile = {
  name: 'simple',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.8"
      createdIn="OpenLP 1.9.0"
      modifiedIn="MyApp 0.0.1"
      modifiedDate="2012-04-10T22:00:00+10:00"><!-- date format: ISO 8601 -->
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>Amazing grace how sweet the sound<br/>that saved a wretch like me;</lines>
    </verse>
  </lyrics>
</song>`,
};

export const mockOpenLyricsFileComplexFile: IRawDataFile = {
  name: 'complex',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.8"
      createdIn="OpenLP 1.9.0"
      modifiedIn="ChangingSong 0.0.1"
      modifiedDate="2012-04-10T22:00:00+10:00"><!-- date format: ISO 8601 -->
  <properties>
    <titles>
      <title original="true" lang="en-US">Amazing Grace</title>
      <title lang="en">Amazing Grace</title>
      <title>Amazing</title>
      <title lang="de-DE">Erstaunliche Anmut</title>
    </titles>
    <!--
      -->
    <!--
      -->
    <authors>
      <author>John Newton</author>
      <author type="words">Chris Rice</author>
      <author type="music">Richard Wagner</author>
      <author type="translation" lang="cs">František Foo</author>
    </authors>
    <copyright>public domain</copyright>
    <ccliNo>4639462</ccliNo>
    <released>1779</released>
    <!-- move chords pitch up/down by a fixed number of semitones,
          values: positive or negative integer -->
    <transposition>2</transposition>
    <!-- bpm (beats per minute, maybe 30-250) or some words like
          Very Fast, Fast, Moderate, Slow, Very Slow -->
    <tempo type="bpm">90</tempo>
    <key>C#</key>
    <variant>Newsboys</variant>
    <publisher>Sparrow Records</publisher>
    <version>0.99</version>
    <keywords>something to help with more accurate results</keywords>
    <!--
      -->
    <verseOrder>v1 v2  v3 c v4 c1 c2 b b1 b2</verseOrder>
    <songbooks>
      <songbook name="Songbook without Number"/>
      <songbook name="Songbook with Number" entry="48"/>
      <songbook name="Songbook with Letters in Entry Name" entry="153c"/>
    </songbooks>
    <themes>
      <theme>Adoration</theme>
      <theme lang="en-US">Grace</theme>
      <theme lang="en-US">Praise</theme>
      <theme lang="en-US">Salvation</theme>
      <theme lang="pt-BR">Graça</theme>
      <theme lang="pt-BR">Adoração</theme>
      <theme lang="pt-BR">Salvação</theme>
    </themes>

    <comments>
      <comment>This is one of the most popular songs in our congregation.</comment>
    </comments>
  </properties>

  <lyrics>
    <verse name="v1" lang="en">
      <lines>Amazing grace how sweet the sound that saved a wretch like me;</lines>
      <lines part="women">A b c<br/>D e f</lines>
    </verse>

    <verse name="v1" lang="de">
      <lines><chord name="B"/>Erstaunliche Ahmut, wie</lines>
    </verse>

    <verse name="c">
      <lines><comment>any comment</comment><br/>Line content.</lines>
    </verse>

    <verse name="v2" lang="en-US">
      <lines part="men"><comment>any text</comment><br/>Amazing grace how sweet the sound that saved a wretch like me;<br/><comment>any text</comment><br/><chord name="D"/>Amazing grace how sweet <chord name="D"/>the sound that saved a wretch like me;<chord name="B7"/><br/>Amazing grace<chord name="G7"/> how sweet the sound that saved a wretch like me;</lines>
      <lines part="women">A b c<br/><br/>D e f</lines>
    </verse>

    <verse name="emptyline" lang="de">
      <lines><br/></lines>
      <lines><br/><br/><br/><br></br></lines>
    </verse>

    <verse name="e" lang="de">
      <lines>This is text of ending.</lines>
    </verse>

  </lyrics>
</song>`,
};

export const mockOpenLyricsSongFile1: IRawDataFile = {
  name: 'Amazing Grace',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.9" createdIn="opensong2openlyrics.py 0.3" modifiedIn="convert-schema.py" modifiedDate="2012-04-10T21:31:48.137828">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
    <authors>
      <author>John Newton</author>
    </authors>
    <copyright>1982 Jubilate Hymns Limited</copyright>
    <ccliNo>1037882</ccliNo>
    <themes>
      <theme>God's Attributes</theme>
    </themes>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
        A<chord root="D"/>mazing <chord root="D" structure="dom7"/>grace how <chord root="G"/>sweet the <chord root="D"/>sound that <chord root="B" structure="min"/>saved a <chord root="E"/>wretch like <chord root="A"/>me;<br/>
        I <chord root="D"/>once was <chord root="D" structure="dom7"/>lost but <chord root="G"/>now I'm <chord root="D"/>found, was <chord root="B" structure="min"/>blind but <chord root="A"/>now I <chord root="G"/>see.
      </lines>
    </verse>
    <verse name="v2">
      <lines>
        Twas <chord root="D"/>grace that <chord root="D" structure="dom7"/>taught my <chord root="G"/>heart to <chord root="D"/>fear, and <chord root="B" structure="min"/>grace my <chord root="E"/>fears re<chord root="A"/>lieved;<br/>
        How <chord root="D"/>precious <chord root="D" structure="dom7"/>did that <chord root="G"/>grace ap<chord root="D"/>pear the <chord root="B" structure="min"/>hour I <chord root="A"/>first be<chord root="G"/>lieved!
      </lines>
    </verse>
    <verse name="v3">
      <lines>
        Through <chord root="D"/>many <chord root="D" structure="dom7"/>dangers, <chord root="G"/>toils, and <chord root="D"/>snares I <chord root="B" structure="min"/>have al<chord root="E"/>ready <chord root="A"/>come;<br/>
        'Tis <chord root="D"/>grace that <chord root="D" structure="dom7"/>brought me <chord root="G"/>safe thus <chord root="D"/>far and <chord root="B" structure="min"/>grace will <chord root="A"/>lead me <chord root="G"/>home.
      </lines>
    </verse>
    <verse name="v4">
      <lines>
        When <chord root="D"/>we've been <chord root="D" structure="dom7"/>there ten <chord root="G"/>thousand <chord root="D"/>years bright <chord root="B" structure="min"/>shining <chord root="E"/>as the <chord root="A"/>sun;<br/>
        We've <chord root="D"/>no less <chord root="D" structure="dom7"/>days to <chord root="G"/>sing God's <chord root="D"/>praise than <chord root="B" structure="min"/>when we'd <chord root="A"/>first be<chord root="G"/>gun!
      </lines>
    </verse>
  </lyrics>
</song>
  `,
};

export const mockOpenLyricsSongFile2: IRawDataFile = {
  name: 'It Is Well With My Soul',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.9" createdIn="opensong2openlyrics.py 0.3" modifiedIn="convert-schema.py" modifiedDate="2012-04-10T21:31:49.643833">
  <properties>
    <titles>
      <title>It Is Well With My Soul</title>
    </titles>
    <authors>
      <author>Horatio Spafford</author>
      <author>Philip Bliss</author>
    </authors>
    <copyright>Public Domain</copyright>
    <ccliNo>25376</ccliNo>
    <verseOrder>v1 c v2 c v3 c v4 c</verseOrder>
    <tempo type="text">Moderate</tempo>
    <themes>
      <theme>Peace</theme>
      <theme>Assurance</theme>
      <theme>Trust</theme>
    </themes>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
        When <chord root="C"/>peace like a river at<chord root="F"/>tendeth my <chord root="C"/>way,<br/>
        When <chord root="A" structure="min"/>sorrows like <chord root="D"/>sea billows <chord root="G"/>roll;<br/>
        What<chord root="C"/>ever my <chord root="F"/>lot, Thou hast <chord root="D"/>taught me to <chord root="G"/>say,<br/>
        “It is <chord root="C"/>well, it is <chord root="F"/>well <chord root="G"/>with <chord root="C"/>my soul.”
      </lines>
    </verse>
    <verse name="c">
      <lines>
        It is <chord root="C"/>well, (it is <chord root="G"/>well,)<br/>
        With my <chord root="G"/>soul, (with my <chord root="C"/>soul,)<br/>
        It is <chord root="F"/>well, it is <chord root="C"/>well <chord root="G"/>with my <chord root="C"/>soul.
      </lines>
    </verse>
    <verse name="v2">
      <lines>
        Though <chord root="C"/>Satan should buffet, though <chord root="F"/>trials should <chord root="C"/>come,<br/>
        Let <chord root="A" structure="min"/>this blest as<chord root="D"/>surance con<chord root="G"/>trol,<br/>
        That <chord root="C"/>Christ has re<chord root="F"/>garded my <chord root="D"/>helpless e<chord root="G"/>state,<br/>
        And hath <chord root="C"/>shed his own <chord root="F"/>blood <chord root="G"/>for my <chord root="C"/>soul.
      </lines>
    </verse>
    <verse name="v3">
      <lines>
        My <chord root="C"/>sin, oh the bliss of this <chord root="F"/>glorious <chord root="C"/>thought!<br/>
        My <chord root="A" structure="min"/>sin, not in <chord root="D"/>part but the <chord root="G"/>whole<br/>
        Is <chord root="C"/>nailed to the <chord root="F"/>cross, and I <chord root="D"/>bear it no <chord root="G"/>more,<br/>
        Praise the <chord root="C"/>Lord, praise the <chord root="F"/>Lord, <chord root="G"/>O my <chord root="C"/>soul!
      </lines>
    </verse>
    <verse name="v4">
      <lines>
        And, <chord root="C"/>Lord, haste the day when my <chord root="F"/>faith shall be <chord root="C"/>sight,<br/>
        The <chord root="A" structure="min"/>clouds be rolled <chord root="D"/>back as a <chord root="G"/>scroll;<br/>
        The <chord root="C"/>trump shall re<chord root="F"/>sound, and the <chord root="D"/>Lord shall de<chord root="G"/>scend,<br/>
        Even <chord root="C"/>so, it is <chord root="F"/>well <chord root="G"/>with my <chord root="C"/>soul.
      </lines>
    </verse>
  </lyrics>
</song>`,
};

export const mockOpenLyricsSongFile3: IRawDataFile = {
  name: 'It Is Well With My Soul',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.9" createdIn="opensong2openlyrics.py 0.3" modifiedIn="convert-schema.py" modifiedDate="2012-04-10T21:31:49.643833">
  <properties>
    <titles>
      <title>It Is Well With My Soul</title>
    </titles>
    <songbooks>
      <songbook name="Single" entry="48"/>
    </songbooks>
    <comments>
      <comment>First</comment>
      <comment>Second</comment>
    </comments>
  </properties>
  <lyrics></lyrics>
</song>`,
};

export const mockOpenLyricsSongFileHebrew: IRawDataFile = {
  name: 'Hava Nagila',
  ext: 'xml',
  type: 'application/xml',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.9" createdIn="Trac 0.11.2" modifiedIn="convert-schema.py" modifiedDate="2012-04-10T21:31:49.006882">
  <properties>
    <titles>
      <title lang="he">הבה נגילה</title>
      <title lang="he" translit="en">Hava Nagila</title>
      <title lang="he" translit="fr">Hava naguila</title>
      <title lang="en">Let Us Rejoice</title>
      <title lang="fr">Réjouissons-nous</title>
    </titles>
    <copyright>public domain</copyright>
    <variant>Hebrew folk song</variant>
    <themes>
      <theme lang="he">הבה נגילה</theme>
      <theme lang="he" translit="en">Hava Nagila</theme>
      <theme lang="en">Rejoice</theme>
    </themes>
  </properties>
  <lyrics>
    <verse name="v1" lang="he">
      <lines>
        הבה נגילה<br/>
        הבה נגילה<br/>
        הבה נגילה ונשמחה
      </lines>
    </verse>
    <verse name="v1" lang="he" translit="en">
      <lines>
        Hava nagila<br/>
        Hava nagila<br/>
        Hava nagila vi nis'mecha
      </lines>
    </verse>
    <verse name="v1" lang="en">
      <lines>
        Let's rejoice<br/>
        Let's rejoice<br/>
        Let's rejoice and be happy
      </lines>
    </verse>
    <verse name="c" lang="he">
      <lines>
        הבה נרננה<br/>
        הבה נרננה<br/>
        הבה נרננה ונשמחה
      </lines>
    </verse>
    <verse name="c" lang="he" translit="en">
      <lines>
        Hava neranenah<br/>
        Hava neranenah<br/>
        Hava neranenah vi nis'mecha
      </lines>
    </verse>
    <verse name="c" lang="en">
      <lines>
        Let's sing<br/>
        Let's sing<br/>
        Let's sing and be happy
      </lines>
    </verse>
    <verse name="b" lang="he">
      <lines>
        !עורו, עורו אחים<br/>
        עורו אחים בלב שמח<br/>
        !עורו אחים, עורו אחים<br/>
        בלב שמח
      </lines>
    </verse>
    <verse name="b" lang="he" translit="en">
      <lines>
        Uru, uru achim!<br/>
        Uru achim b'lev sameach<br/><br/>
        Uru achim, uru achim!<br/>
        B'lev sameach
      </lines>
    </verse>
    <verse name="b" lang="en">
      <lines>
        Awake, awake, brothers!<br/>
        Awake brothers with a happy heart<br/>
        Awake, brothers, awake, brothers!<br/>
        With a happy heart
      </lines>
    </verse>
  </lyrics>
</song>`,
};
