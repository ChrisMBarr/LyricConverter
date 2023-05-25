import { Component, OnInit } from '@angular/core';
import { ParserService } from '../convert/parser/parser.service';
import { Utils } from '../convert/shared/utils';

interface ICombinedFormatItem {
  name: string;
  canImport: boolean;
  canExport: boolean;
  hasNote: boolean;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  combinedFormatsList: ICombinedFormatItem[] = [];

  unsupportedFormatsList: ICombinedFormatItem[] = [
    { name: 'ProPresenter 6', canImport: false, canExport: false, hasNote: true },
    { name: 'ProPresenter 7', canImport: false, canExport: false, hasNote: true },
    { name: 'MediaShout', canImport: false, canExport: false, hasNote: false },
    { name: 'EasyWorship', canImport: false, canExport: false, hasNote: false },
    { name: 'OpenSong', canImport: false, canExport: false, hasNote: false },
  ];

  constructor(private readonly parserSvc: ParserService) {}

  ngOnInit(): void {
    //Add all input/import types to the list
    this.parserSvc.inputConverters
      .map((t) => t.name)
      .forEach((t) => {
        this.combinedFormatsList.push({
          name: t,
          canImport: true,
          canExport: false,
          hasNote: false,
        });
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
          this.combinedFormatsList.push({
            name: t,
            canImport: false,
            canExport: true,
            hasNote: false,
          });
        }
      });

    //Now append the list of all the unsupported formats that might one day be added
    this.combinedFormatsList = Utils.mergeArraysByProp(
      this.combinedFormatsList,
      this.unsupportedFormatsList,
      'name'
    ).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      /* istanbul ignore next */ return 0;
    });
  }
}
