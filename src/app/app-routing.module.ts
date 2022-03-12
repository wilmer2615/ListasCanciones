import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancionComponent } from './pages/cancion/cancion.component';
import { ListaComponent } from './pages/lista/lista.component';
import { ArtistaComponent } from './pages/artista/artista.component';

const routes: Routes = [

   
   {path: "cancion", component: CancionComponent},   
   {path: "artista", component: ArtistaComponent},   
   {path: "lista", component: ListaComponent},   
   {path: "**",pathMatch:'full', redirectTo:'cancion'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
