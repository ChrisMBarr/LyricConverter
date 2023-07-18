import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';

const routes: Routes = [
  { path: '', component: ConvertComponent, title: 'Lyric Converter' },
  { path: 'about', component: AboutComponent, pathMatch: 'full', title: 'Lyric Converter: About' },
  { path: 'help', component: HelpComponent, pathMatch: 'full', title: 'Lyric Converter: Help' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
