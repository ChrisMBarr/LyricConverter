//A representation of a ProPresenter document as a JSON object parsed by fast-xml-parser
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
//NOTE: Not all properties are listed here, a lot of junk is left off.  See console output if something more is needed
export interface IProPresenter4Document {
  RVPresentationDocument: {
    [index: string]: string | number | Object| undefined;
    CCLIArtistCredits: string;
    CCLICopyrightInfo?: number;
    CCLIDisplay: number;
    CCLILicenseNumber?: string;
    CCLIPublisher: string;
    CCLISongTitle: string;
    album: string;
    artist: string;
    author: string;
    backgroundColor: string;
    category: string;
    creatorCode: number;
    docType: number;
    drawingBackgroundColor: number;
    height: number;
    lastDateUsed: string;
    notes: string;
    resourcesDirectory: string;
    slides: {
      RVDisplaySlide: IProPresenter4DisplaySlide[];
    };
    usedCount: number;
    versionNumber: number;
    width: number;
  };
}

export interface IProPresenter4DisplaySlide {
  displayElements: {
    RVTextElement: {
      UUID: string;
      backgroundColor: string;
      displayElements: {
        RVTextElement: {
          RTFData: string;
          adjustsHeightToFit: number;
          bezelRadius: number;
          displayDelay: number;
          displayName: string;
          drawingFill: number;
          drawingShadow: number;
          drawingStroke: number;
          fillColor: string;
          fromTemplate: string;
          locked: string;
          persistent: string;
          rotation: number;
          source: string;
          typeID: string;
          verticalAlignment: number;
          '_-RVRect3D-_position': ProPresenterTextElementPosition;
        };
      };
      drawingBackgroundColor: number;
      enabled: number;
      highlightColor: string;
      hotKey: string;
      label: string;
      notes: string;
      slideType: number;
      sort_index: number;
    };
  };
}

export interface ProPresenterTextElementPosition {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

//----------------------------------------------------------------------------------

export interface IProPresenter5Document {
  RVPresentationDocument: {
    [index: string]: string | number | Object | undefined;
    CCLIArtistCredits: string;
    CCLICopyrightInfo: number;
    CCLIDisplay: number;
    CCLILicenseNumber?: string;
    CCLIPublisher: string;
    CCLISongTitle: string;
    album: string;
    artist: string;
    arrangements: {
      RVSongArrangement: {
        color: string;
        groupIDs: {
          NSMutableString: IProPresenter5ArrangementGroupItem[];
        };
        name: string;
        uuid: string;
      };
    };
    author: string;
    backgroundColor: string;
    category: string;
    chordChartPath: string;
    creatorCode: number;
    docType: number;
    drawingBackgroundColor: number;
    groups: {
      RVSlideGrouping: IProPresenter5SlideGrouping[];
    };
    height: number;
    lastDateUsed: string;
    notes: string;
    resourcesDirectory: string;
    usedCount: number;
    versionNumber: number;
    width: number;
  };
}

export interface IProPresenter5SlideGrouping {
  slides: IProPresenter5DisplaySlide | IProPresenter5DisplaySlide[];
  name: string;
  uuid: string;
  color: string;
}

export interface IProPresenter5DisplaySlide {
  RVDisplaySlide: {
    UUID: string;
    backgroundColor: string;
    chordChartPath: string;
    displayElements: {
      RVTextElement?: {
        RTFData: string;
        adjustsHeightToFit: number;
        bezelRadius: number;
        displayDelay: number;
        displayName: string;
        drawingFill: number;
        drawingShadow: number;
        drawingStroke: number;
        fillColor: string;
        fromTemplate: number;
        locked: number;
        persistent: number;
        revealType: number;
        rotation: number;
        source: string;
        typeID: number;
        verticalAlignment: number;
        '_-RVRect3D-_position': ProPresenterTextElementPosition;
      };
    };
    drawingBackgroundColor: number;
    enabled: number;
    highlightColor: string;
    hotKey: string;
    label: string;
    notes: string;
    slideType: number;
    sort_index: number;
  };
}

export interface IProPresenter5ArrangementGroupItem {
  'serialization-native-value': string;
  'serialization-array-index': number;
}
