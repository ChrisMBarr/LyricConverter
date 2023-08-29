import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockImageFile: IRawDataFile = {
  name: 'foo',
  ext: 'png',
  type: 'image/png',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\b\x04\x00\x00\x00µ\x1C\f\x02\x00\x00\x00\vIDATxÚcdø\x0F\x00\x01\x05\x01\x01'\x18ãf\x00\x00\x00\x00IEND®B`\x82",
};

export const mockEmptyTextFile: IRawDataFile = {
  name: 'foo',
  ext: 'txt',
  type: 'text/plain',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '',
};

export const mockEmptyJsonFile: IRawDataFile = {
  name: 'foo',
  ext: 'json',
  type: 'text/json',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '{}',
};

export const mockEmptyProPresenter4File: IRawDataFile = {
  name: 'foo',
  ext: 'pro4',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>',
};

export const mockEmptyProPresenter5File: IRawDataFile = {
  name: 'foo',
  ext: 'pro5',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
};

export const mockEmptyProPresenter6File: IRawDataFile = {
  name: 'foo',
  ext: 'pro6',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '<RVPresentationDocument height="768" width="1024" versionNumber="600" docType="0"></RVPresentationDocument>',
};

export const mockEmptySongProFile: IRawDataFile = {
  name: 'foo',
  ext: 'md',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '',
};

export const mockEmptySongShowPlusFile: IRawDataFile = {
  name: 'foo',
  ext: 'sbsong',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '',
};

export const mockSimpleChordProFile: IRawDataFile = {
  name: 'foo',
  ext: 'cho',
  type: 'text/plain',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: '{title: This is a title}\n{artist: Hymn}\n{key: E}\n\nVerse1\n[E]I know a p[Bm7]lace\nA w[A]onderful p[E]lace',
};
