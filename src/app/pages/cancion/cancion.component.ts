import { formatCurrency } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ICancionModel } from '../../models/ICancionModel';
import { artistaModel } from '../../models/IartistaModel';
import { ICancionXArtistaModel } from '../../models/ICancionXArtistaModel';



@Component({
  selector: 'app-cancion',
  templateUrl: './cancion.component.html',
  styleUrls: ['./cancion.component.css']
})

export class CancionComponent {

  public page:number= 0;
  result: ICancionXArtistaModel[] = [];
  cancionArray: ICancionModel[] = [];
  miCancion = <ICancionModel>{};
  artistas: artistaModel[] = [];
  miArtista = <artistaModel>{};


  constructor() {
    this.cargarStorage();
    
  }

  crearCancion(form: NgForm) {

    if (form.invalid) {
      Swal.fire({
        title: 'error',
        text: 'Debe completar los campos del formulario',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.cancionArray.push(
      <ICancionModel>
      {
        id: this.cancionArray.length + 1,
        album: this.miCancion.album,
        idArtista: this.miArtista.id,
        nombreArtista: this.miArtista.nombreCompleto,
        duracion: this.miCancion.duracion,
        nombreCancion: this.miCancion.nombreCancion
      }
    );

    this.limpiarFormulario();
    this.guardarStorage();
    this.cargarStorage();
  }

  editarCancion(form: NgForm) {

    if (form.invalid) {

      Swal.fire({
        title: 'error',
        text: 'Debe completar los campos del formulario',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      return;
    }
    let id = this.result.find(elemento => elemento.IdCancion === this.miCancion.id)

    if (id) {
      let index = this.result.indexOf(id);
      this.result[index] = <ICancionXArtistaModel>{

        IdCancion: this.miCancion.id,
        IdArtista: this.miCancion.idArtista,
        NombreArtista: this.miCancion.nombreArtista,
        NombreCancion: this.miCancion.nombreCancion,
        Duracion: this.miCancion.duracion,
        Album: this.miCancion.album
      }
    }

    this.guardarStorage();
    this.limpiarFormulario();




  }
  eliminarCancion(index: any) {

    if (confirm("¿Desea borrar la cancion?")) {
      this.cancionArray.splice(index, 1);      
    }

    this.guardarStorage();
    this.cargarStorage();
  }

  guardarStorage() {
    localStorage.setItem('canciones', JSON.stringify(this.cancionArray));
  }

  cargarStorage() {
    
    this.artistas = JSON.parse(localStorage.getItem('artista') || '[]');
    this.artistas.push(
      {
        id: 0,
        nombreCompleto: 'seleccione',
        edad: '',
        nacionalidad: ''
      }
    )

    try {
      this.cancionArray = JSON.parse(localStorage.getItem('canciones') || '[]');
    }
    catch (ex) {
      this.cancionArray = [];
    }

    //TO DO crear la logica que tome de los dos arreglos anteriores los campos que requiero y ponerlos en el nuevo arreglo
    this.result = [];

    for (let i = 0; i < this.cancionArray.length; i++) {

      let cancionArtista =
        <ICancionXArtistaModel>
        {
          IdCancion: this.cancionArray[i].id,
          IdArtista: this.cancionArray[i].idArtista,
          NombreCancion: this.cancionArray[i].nombreCancion,
          Album: this.cancionArray[i].album,
          Duracion: this.cancionArray[i].duracion,
          NombreArtista: this.getNombreArtista(this.cancionArray[i].idArtista)
        }

      this.result.push(cancionArtista);
      
    }
    
  }

  limpiarFormulario() {

    this.miCancion = <ICancionModel>{
      idArtista: 0,
      nombreArtista: " ",
      nombreCancion: " ",
      duracion: " ",
      album: " "
    };
  }

  cargarCancion(cancion: ICancionXArtistaModel) {

    this.miCancion = <ICancionModel>{

      id: cancion.IdCancion,
      idArtista: cancion.IdArtista,
      nombreArtista: cancion.NombreArtista,
      nombreCancion: cancion.NombreCancion,
      duracion: cancion.Duracion,
      album: cancion.Album
    };

    this.miArtista = <artistaModel>{
      id: cancion.IdArtista
    }

  }


  getNombreArtista(idArtista: number): string {

    for (let i = 0; i < this.artistas.length; i++) {

      if (idArtista == this.artistas[i].id)
        return this.artistas[i].nombreCompleto;
    };

    return "";
  }
}

