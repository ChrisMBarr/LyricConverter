import { IRawDataFile } from "src/app/convert/models/file.model";

export const mockImageFile: IRawDataFile = {
  name: 'foo',
  ext: 'png',
  type: 'image/png',
  data: "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\b\x04\x00\x00\x00µ\x1C\f\x02\x00\x00\x00\vIDATxÚcdø\x0F\x00\x01\x05\x01\x01'\x18ãf\x00\x00\x00\x00IEND®B`\x82",
};

export const mockSimpleTextFile: IRawDataFile = {
  name: 'foo',
  ext: 'txt',
  type: 'text/plain',
  data: 'this is some plain text',
};

export const mockEmptyJsonFile: IRawDataFile = {
  name: 'foo',
  ext: 'json',
  type: 'text/json',
  data: '{}',
};
