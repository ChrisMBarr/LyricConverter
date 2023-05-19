import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockImageFile: IRawDataFile = {
  name: 'foo',
  ext: 'png',
  type: 'image/png',
  data: "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\b\x04\x00\x00\x00µ\x1C\f\x02\x00\x00\x00\vIDATxÚcdø\x0F\x00\x01\x05\x01\x01'\x18ãf\x00\x00\x00\x00IEND®B`\x82",
};

export const mockEmptyTextFile: IRawDataFile = {
  name: 'foo',
  ext: 'txt',
  type: 'text/plain',
  data: '',
};

export const mockEmptyJsonFile: IRawDataFile = {
  name: 'foo',
  ext: 'json',
  type: 'text/json',
  data: '{}',
};

export const mockEmptyProPresenter4File: IRawDataFile = {
  name: 'foo',
  ext: 'pro4',
  type: '',
  data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>',
};

export const mockEmptyProPresenter5File: IRawDataFile = {
  name: 'foo',
  ext: 'pro5',
  type: '',
  data: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
};

export const mockEmptySongProFile: IRawDataFile = {
  name: 'foo',
  ext: 'md',
  type: '',
  data: '',
};

export const mockSimpleChordProFile: IRawDataFile = {
  name: 'foo',
  ext: 'cho',
  type: 'text/plain',
  data: '{title: This is a title}\n{artist: Hymn}\n{key: E}\n\nVerse1\n[E]I know a p[Bm7]lace\nA w[A]onderful p[E]lace',
};
