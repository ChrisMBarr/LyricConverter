export class MockDataTransfer {
  items = new Set<File>();
  files = this.items as unknown as FileList;
}
