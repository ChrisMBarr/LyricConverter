export interface ISongProSong {
    attrs: ISongProAttrs;
    sections: ISongProSection[];
    custom: Record<string, string>;
}
export interface ISongProAttrs {
    [key: string]: string | undefined;
    title?: string;
    artist?: string;
    capo?: string;
    key?: string;
    tempo?: string;
    year?: string;
    album?: string;
    tuning?: string;
}
export interface ISongProSection {
    lines: ISongProLine[];
    name: string;
}
export interface ISongProLine {
    parts: ISongProPart[];
    measures?: ISongProMeasure[];
    tablature?: string;
    comment?: string;
    hasTablature: () => this is {
        tablature: string;
    };
    hasMeasures: () => this is {
        measures: ISongProMeasure[];
    };
    hasComment: () => this is {
        comment: string;
    };
}
export interface ISongProMeasure {
    chords: (string | undefined)[];
}
export interface ISongProPart {
    chord: string;
    lyric: string;
}
export declare class SongPro {
    private static readonly SECTION_REGEX;
    private static readonly ATTRIBUTE_REGEX;
    private static readonly CUSTOM_ATTRIBUTE_REGEX;
    private static readonly CHORDS_AND_LYRICS_REGEX;
    private static readonly MEASURES_REGEX;
    private static readonly CHORDS_REGEX;
    private static readonly COMMENT_REGEX;
    static parse(text: string): ISongProSong;
    private static processAttribute;
    private static processCustomAttribute;
    private static processSection;
    private static processLyricsAndChords;
    private static buildLine;
    private static getMeasures;
    private static getComment;
    private static getPart;
    private static chunk;
    private static scan;
}
