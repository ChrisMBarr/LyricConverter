import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';

const routes: Routes = [
  { path: '', component: ConvertComponent },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'help', component: HelpComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
