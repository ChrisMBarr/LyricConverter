import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';

const routes: Routes = [
  { path: '', redirectTo: 'convert', pathMatch: 'full' },
  { path: 'convert', component: ConvertComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
