import { IOutputFile } from '../models/file.model';
import { ISong, ISongInfo } from '../models/song.model';
import { Utils } from '../utils/utils';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeProPresenter5 implements IOutputConverter {
  readonly name = 'Pro Presenter 5';
  readonly fileExt = 'pro5';

  convertToType(song: ISong): IOutputFile {
    const fileContent = this.generateProPresenterDocument(song);

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private readonly slideWidth = 1920;
  private readonly slideHeight = 1080;
  private readonly slideTextPadding = 20;

  private generateProPresenterDocument(song: ISong): string {
    let slides = '';
    let slideIdx = 1;
    for (const slide of song.slides) {
      slides += this.makeSlide(slideIdx, slide.title, slide.lyrics);
      slideIdx++;
    }

    return `<RVPresentationDocument ${this.getPPDocAttributes(song)}>
  <_-RVProTransitionObject-_transitionObject transitionType="-1" transitionDuration="1" motionEnabled="0" motionDuration="20" motionSpeed="100" />
  <groups containerClass="NSMutableArray">
    ${this.makeGroupWithSingleBlankSlide(0)}
    <RVSlideGrouping name="Song" uuid="${this.generateUniqueID()}" color="0 0 1 1" serialization-array-index="1">
      <slides containerClass="NSMutableArray">
        ${slides}
      </slides>
    </RVSlideGrouping>
    ${this.makeGroupWithSingleBlankSlide(2)}
  </groups>
  <timeline timeOffSet="0" selectedMediaTrackIndex="0" unitOfMeasure="60" duration="0" loop="0">
    <timeCues containerClass="NSMutableArray" />
    <mediaTracks containerClass="NSMutableArray" />
  </timeline>
  <bibleReference containerClass="NSMutableDictionary" />
  <arrangements containerClass="NSMutableArray" />
</RVPresentationDocument>`;
  }

  private getPPDocAttributes(song: ISong): string {
    const defaultAttributes: ISongInfo[] = [
      { name: 'height', value: this.slideHeight },
      { name: 'width', value: this.slideWidth },
      { name: 'versionNumber', value: '500' },
      { name: 'docType', value: '0' },
      { name: 'creatorCode', value: '1349676880' },
      {
        name: 'lastDateUsed',
        //Remove the ending milliseconds: '2023-05-17T16:02:23.245Z' --> '2023-05-17T16:02:23'
        value: new Date().toISOString().replace(/\.\d{3}Z$/, ''),
      },
      { name: 'usedCount', value: '0' },
      { name: 'category', value: 'Song' },
      { name: 'resourcesDirectory', value: '' },
      { name: 'backgroundColor', value: '0 0 0 1' },
      { name: 'drawingBackgroundColor', value: '0' },
      { name: 'notes', value: '' },
      { name: 'artist', value: '' },
      { name: 'author', value: '' },
      { name: 'album', value: '' },
      { name: 'CCLIDisplay', value: '0' },
      { name: 'CCLIArtistCredits', value: '' },
      { name: 'CCLISongTitle', value: song.title },
      { name: 'CCLIPublisher', value: '' },
      { name: 'CCLICopyrightInfo', value: '' },
      { name: 'CCLILicenseNumber', value: '' },
      { name: 'chordChartPath', value: '' },
    ];

    //Overwrite any default attributes with ones tht came from the song
    const mergedAttributes = Utils.mergeArraysByProp<ISongInfo>(defaultAttributes, song.info, 'name');

    //Convert all pieces of song info into a string of XML attributes
    const documentAttributes = mergedAttributes.reduce((accumulator: string, obj: ISongInfo) => {
      //Remove spaces from the name to make a valid XML attribute name
      return (accumulator += `${obj.name.replace(/\s/g, '')}="${obj.value}" `);
    }, '');
    return documentAttributes;
  }

  private generateUniqueID(): string {
    //Native PP ID Example: 26AAF905-8F45-4252-BFAB-4C10CCFE1476
    function s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
  }

  private makeGroupWithSingleBlankSlide(order: number): string {
    return `
    <RVSlideGrouping name="Blank" uuid="${this.generateUniqueID()}" color="1 0 0 1" serialization-array-index="${order}">
      <slides containerClass="NSMutableArray">
        <RVDisplaySlide backgroundColor="0 0 0 0" enabled="1" highlightColor="" hotKey="" label="" notes="" slideType="1" sort_index="0" UUID="${this.generateUniqueID()}" drawingBackgroundColor="0" chordChartPath="" serialization-array-index="0">',
          <cues containerClass="NSMutableArray" />
          <displayElements containerClass="NSMutableArray" />
          <_-RVProTransitionObject-_transitionObject transitionType="-1" transitionDuration="1" motionEnabled="0" motionDuration="20" motionSpeed="100" />
        </RVDisplaySlide>
      </slides>
    </RVSlideGrouping>`;
  }

  private makeSlide(order: number, label: string, text: string): string {
    const encodedRtf = Utils.encodeBase64(Utils.formatRtf(text));
    const txtElWidth = this.slideWidth - this.slideTextPadding*2;
    const txtElHeight = this.slideHeight - this.slideTextPadding*2;
    return  `
        <RVDisplaySlide backgroundColor="0 0 0 0" enabled="1" highlightColor="" hotKey="" label="${label}" notes="" slideType="1" sort_index="${order}" UUID="${this.generateUniqueID()}" drawingBackgroundColor="0" chordChartPath="" serialization-array-index="${order}">
          <cues containerClass="NSMutableArray" />
          <displayElements containerClass="NSMutableArray">
            <RVTextElement displayDelay="0" displayName="Default" locked="0" persistent="0" typeID="0" fromTemplate="0" bezelRadius="0" drawingFill="0" drawingShadow="0" drawingStroke="0" fillColor="1 1 1 1" rotation="0" source="" adjustsHeightToFit="0" verticalAlignment="0" RTFData="${encodedRtf}" revealType="0" serialization-array-index="0">
              <_-RVRect3D-_position x="${this.slideTextPadding}" y="${this.slideTextPadding}" z="0" width="${txtElWidth}" height="${txtElHeight}" />
              <_-D-_serializedShadow containerClass="NSMutableDictionary">
                <NSMutableString serialization-native-value="{3.5355301, -3.5355301}" serialization-dictionary-key="shadowOffset" />
                <NSNumber serialization-native-value="5" serialization-dictionary-key="shadowBlurRadius" />
                <NSColor serialization-native-value="0 0 0 0.5" serialization-dictionary-key="shadowColor" />
              </_-D-_serializedShadow>
              <stroke containerClass="NSMutableDictionary">
                <NSColor serialization-native-value="0 0 0 1" serialization-dictionary-key="RVShapeElementStrokeColorKey" />
                <NSNumber serialization-native-value="1" serialization-dictionary-key="RVShapeElementStrokeWidthKey" />
              </stroke>
            </RVTextElement>
          </displayElements>
          <_-RVProTransitionObject-_transitionObject transitionType="-1" transitionDuration="1" motionEnabled="0" motionDuration="20" motionSpeed="100" />
        </RVDisplaySlide>`;
  }
}
