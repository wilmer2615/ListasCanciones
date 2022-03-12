import { Component, Input, OnInit } from '@angular/core';
import { ICancionModel } from '../../models/ICancionModel';
import { artistaModel } from '../../models/IartistaModel';
import { IListaXArtista } from '../../models/IListaXArtista';
import { NgForm } from '@angular/forms';
import { IListaModel } from '../../models/IListaModel';
import Swal from 'sweetalert2';
import { ICancionLista } from '../../models/ICancionLista';
import { Console } from 'console';



@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})


export class ListaComponent implements OnInit {

  public page: number = 0;
  canciones: ICancionModel[] = [];
  artistas: artistaModel[] = [];
  result: IListaXArtista[] = [];
  miLista = <IListaModel>{};
  miListaXCancion = <ICancionLista>{};
  cancionesDetalle: any = [];

  listas: IListaModel[] = this.getListaArrayFromLocalStorage();
  cancionXlista: ICancionLista[] = this.getCancionXListaFromLocalStorage();
  constructor() {
    this.cargarStorage();
  }

  ngOnInit(): void {

  }

  crearLista(form: NgForm) {

    if (form.invalid) {

      Swal.fire({
        title: 'error',
        text: 'Debe completar los campos del formulario',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      return;
    }

    let IdLista = this.generarIdLista();

    let courrentList: IListaModel = {

      Id: IdLista,
      NombreLista: this.miLista.NombreLista
    }

    this.guardarStorageLista(courrentList);
    this.limpiarFormulario();

    this.cancionesSelecionadas(IdLista);
    this.limpiarchecbox();

  }

  cargarStorage() {
    this.canciones = JSON.parse(localStorage.getItem('canciones') || '[]');
    this.artistas = JSON.parse(localStorage.getItem('artista') || '[]');


    for (let i = 0; i < this.canciones.length; i++) {

      let listaXArtista = <IListaXArtista>{

        IdCancion: this.canciones[i].id,
        IdArtista: this.canciones[i].idArtista,
        NombreArtista: this.getNombreArtista(this.canciones[i].idArtista),
        NombreCancion: this.canciones[i].nombreCancion,
        Album: this.canciones[i].album,
        Duracion: this.canciones[i].duracion,
        agregar: false
      }

      this.result.push(listaXArtista);
    };


  }

  generarIdLista(): number {

    let ArregloListas = JSON.parse(localStorage.getItem('listas') || '[]');
    let idMayor = 0;
    for (let i = 0; i < ArregloListas.length; i++) {
      if (ArregloListas[i].Id > idMayor) {
        idMayor = ArregloListas[i].Id
      }
    }

    return idMayor + 1;
  }

  guardarStorageLista(item: IListaModel) {
    let arregloListas = this.getListaArrayFromLocalStorage();
    arregloListas.push(item);
    localStorage.setItem('listas', JSON.stringify(arregloListas));
  }

  getListaArrayFromLocalStorage(): IListaModel[] {
    let listas: IListaModel[] = JSON.parse(localStorage.getItem('listas') || '[]');

    return listas;
  }

  guardarStorageListaActualizado(lista: IListaModel) {
    let arregloListas = this.getListaArrayFromLocalStorage();
    for (let i = 0; i < arregloListas.length; i++)
      if (arregloListas[i].Id == lista.Id) {
        arregloListas[i] = lista;
      }
    localStorage.setItem('listas', JSON.stringify(arregloListas));
  }

  getCancionXListaFromLocalStorage(): ICancionLista[] {
    let cancionXlista: ICancionLista[] = JSON.parse(localStorage.getItem('listasXcancion') || '[]')

    return cancionXlista;
  }


  guardarStorageCancionXListasActualizada(item: ICancionLista[]) {
    let arregloListasXcancion = this.getCancionXListaFromLocalStorage();

  }

  guardarStorageCancionXListas(item: ICancionLista[]) {
    
    let arregloListasXcancion = this.getCancionXListaFromLocalStorage();

    for (let i = 0; i < item.length; i++) {
      let cancionXLista = <ICancionLista>{
        Id: item[i].Id,
        IdCancion: item[i].IdCancion,
        IdLista: item[i].IdLista
      }
      arregloListasXcancion.push(cancionXLista);
    }
    localStorage.setItem('listasXcancion', JSON.stringify(arregloListasXcancion));
  }

  getNombreArtista(idArtista: number): string {

    for (let i = 0; i < this.artistas.length; i++) {

      if (this.artistas[i].id == idArtista)
        return this.artistas[i].nombreCompleto;
    }
    return '';
  }

  limpiarFormulario() {
    this.miLista = <IListaModel>{};
  }


  limpiarCancionXlista() {
    this.miListaXCancion = <ICancionLista>{};
  }

  cancionesSelecionadas(IdLista: number) {
    let IdListaXCancion = this.generarIdListaXCancion();
    let cancionxArtista: ICancionLista = <ICancionLista>{};
    let arregloCancionxLista: ICancionLista[] = [];

    for (let i = 0; i < this.result.length; i++) {

      if (this.result[i].agregar == true) {

        cancionxArtista = <ICancionLista>{
          Id: IdListaXCancion,
          IdCancion: this.result[i].IdCancion,
          IdLista: IdLista
        };

        IdListaXCancion++;
        arregloCancionxLista.push(cancionxArtista);
      }

    }

    this.guardarStorageCancionXListas(arregloCancionxLista);
  }

  generarIdListaXCancion(): number {
    let mayor = 0;
    let arregloListaXcancion = JSON.parse(localStorage.getItem('listasXcancion') || '[]');

    for (let i = 0; i < arregloListaXcancion.length; i++) {
      if (arregloListaXcancion[i].Id > mayor) {
        mayor = arregloListaXcancion[i].Id
      }
    } return mayor + 1;
  }

  limpiarchecbox() {
    for (let i = 0; i < this.result.length; i++) {
      this.result[i].agregar = false
    }
  }

  cargarid(id: number) {
    this.cancionesDetalle = [];
    let cancion;
    let canciones: number[] = [];
    for (let i = 0; i < this.cancionXlista.length; i++) {
      if (this.cancionXlista[i].IdLista == id) {
        cancion = this.cancionXlista[i].IdCancion;
        canciones.push(cancion);
      }
    }

    this.getCancionesDetalle(canciones);


  }

  getCancionesDetalle(items: number[]) {

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < this.result.length; j++) {
        if (items[i] === this.result[j].IdCancion) {

          let cancion = {
            NombreCancion: this.result[j].NombreCancion,
            NombreArtista: this.result[j].NombreArtista
          }

          this.cancionesDetalle.push(cancion);
        }
      }
    }

  }

  cargarLista(lista: IListaModel) {
    this.limpiarchecbox();
    this.miLista = {
      Id: lista.Id,
      NombreLista: lista.NombreLista
    }
    this.cargarCheckbox(lista);
  }

  editarLista() {
    let lista: IListaModel = <IListaModel>{};
    let id: any = this.listas.find(elemento => elemento.Id == this.miLista.Id)
    if (id) {
      let index = this.listas.indexOf(id);
      lista = this.listas[index] = <IListaModel>{
        Id: this.miLista.Id,
        NombreLista: this.miLista.NombreLista
      }
    }
    this.guardarStorageListaActualizado(lista);
    this.Nuevascanciones(this.miLista.Id);

    this.limpiarFormulario();
    this.limpiarchecbox();
  }

  Nuevascanciones(IdLista: number) {
    
    //this.borrarItemListaxCancion(IdLista, this.getCancionXListaFromLocalStorage());
    
    this.borrarCancionListaXCancion(IdLista, this.getCancionXListaFromLocalStorage());
    this.updateNewItemsListBySongs(this.result, IdLista);
    



  }

  updateNewItemsListBySongs(result: IListaXArtista[], idLista: number) {
    
    let arregloListasXcancion = this.getCancionXListaFromLocalStorage();
    
    result.forEach(song => {

      if(song.agregar)
      {
        arregloListasXcancion.push(
          {
            Id: this.generarIdListaXCancion(),
            IdCancion: song.IdCancion,
            IdLista:idLista
          }
       );
      }
    });


    localStorage.setItem('listasXcancion', JSON.stringify(arregloListasXcancion));
    
    this.limpiarFormulario();
    this.limpiarchecbox();
  }


  borrarItemListaxCancion(idLista: number, arg1: ICancionLista[]) {

    var newListWithOutSelectedSong = arg1.filter(item => item.IdLista != idLista);
    localStorage.setItem('listasXcancion', JSON.stringify(newListWithOutSelectedSong));

  }

  borrarCancionListaXCancion(idLista:number, listaXcancion: ICancionLista[]){
    console.log(listaXcancion);
    let listaSinCancionesSeleccionadas:any = [];
    let cancion:any; 
    for(let i =0;i < listaXcancion.length; i++){
      if(listaXcancion[i].IdLista != idLista){
        cancion = listaXcancion[i];

        listaSinCancionesSeleccionadas.push(cancion);
      }
    }
    localStorage.setItem('listasXcancion', JSON.stringify(listaSinCancionesSeleccionadas));

  }

  cargarCheckbox(lista: IListaModel) {

    let Idcanciones = [];

    for (let i = 0; i < this.cancionXlista.length; i++) {
      if (lista.Id == this.cancionXlista[i].IdLista) {
        let cancion = this.cancionXlista[i].IdCancion
        Idcanciones.push(cancion);
      }
    }

    for (let i = 0; i < this.result.length; i++) {
      for (let j = 0; j < Idcanciones.length; j++) {
        if (this.result[i].IdCancion == Idcanciones[j]) {
          this.result[i].agregar = true;

        }
      }

    }
  }
}









