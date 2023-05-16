import { Component, OnInit } from '@angular/core';
import { ParserService } from '../convert/parser/parser.service';

interface ICombinedFormatItem {
  name: string;
  canImport: boolean;
  canExport: boolean;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  combinedFormatsList: ICombinedFormatItem[] = [];

  constructor(private parserSvc: ParserService) {}

  ngOnInit(): void {
    //Add all input/import types to the list
    this.parserSvc.inputConverters
      .map((t) => t.name)
      .forEach((t) => {
        this.combinedFormatsList.push({ name: t, canImport: true, canExport: false });
      });

    //Add all output/export types to the list, but exclude 'Display Slides'
    //If the name matches one that's already in the list from the inputs/imports
    //being added then just change a value to flag it as also allowing output/export
    this.parserSvc.outputConverters
      .filter((t) => t.name !== 'Display Slides')
      .map((t) => t.name)
      .forEach((t) => {
        const matchedToInput = this.combinedFormatsList.find((inputType) => inputType.name === t);
        if (matchedToInput) {
          matchedToInput.canExport = true;
        } else {
          this.combinedFormatsList.push({ name: t, canImport: false, canExport: true });
        }
      });
  }
}
