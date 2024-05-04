import { Component, inject, OnInit } from '@angular/core';

import { ParserService } from '../convert/parser/parser.service';
import { Utils } from '../convert/shared/utils';

interface ICombinedFormatItem {
  name: string;
  canImport: boolean;
  canExport: boolean;
  hasNote: boolean;
  url?: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit {
  private readonly parserSvc = inject(ParserService);

  combinedFormatsList: Array<ICombinedFormatItem> = [];

  unsupportedFormatsList: Array<ICombinedFormatItem> = [
    {
      name: 'ProPresenter 7',
      canImport: false,
      canExport: false,
      hasNote: true,
      url: 'https://renewedvision.com/propresenter/',
    },
    {
      name: 'MediaShout',
      canImport: false,
      canExport: false,
      hasNote: false,
      url: 'https://mediashout.com/',
    },
    {
      name: 'EasyWorship',
      canImport: false,
      canExport: false,
      hasNote: false,
      url: 'https://easyworship.com/',
    },
    {
      name: 'OpenSong',
      canImport: false,
      canExport: false,
      hasNote: false,
      url: 'http://opensong.org/',
    },
  ];

  ngOnInit(): void {
    //Add all input/import types to the list
    this.parserSvc.inputConverters.forEach((t) => {
      this.combinedFormatsList.push({
        name: t.name,
        canImport: true,
        canExport: false,
        hasNote: false,
        url: t.url,
      });
    });

    //Add all output/export types to the list, but exclude 'Display Slides'
    //If the name matches one that's already in the list from the inputs/imports
    //being added then just change a value to flag it as also allowing output/export
    this.parserSvc.outputConverters
      .filter((t) => t.name !== 'Display Slides')
      .forEach((t) => {
        const matchedToInput = this.combinedFormatsList.find(
          (inputType) => inputType.name === t.name,
        );
        if (matchedToInput) {
          matchedToInput.canExport = true;
        } else {
          this.combinedFormatsList.push({
            name: t.name,
            canImport: false,
            canExport: true,
            hasNote: false,
            url: t.url,
          });
        }
      });

    //Now append the list of all the unsupported formats that might one day be added
    this.combinedFormatsList = Utils.mergeArraysByProp(
      this.combinedFormatsList,
      this.unsupportedFormatsList,
      'name',
    ).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      /* istanbul ignore next */ return 0;
    });
  }
}
