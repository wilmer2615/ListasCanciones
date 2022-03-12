import { Component, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { artistaModel } from '../../models/IartistaModel';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent implements OnInit {

  artistaArray:artistaModel[] = [];
  miArtista= <artistaModel>{};
  public page:number = 0;
  


  constructor() {
    this.cargarStorage();
   }

  ngOnInit(): void {
  }

  crearArtista(form:NgForm){

    if (form.invalid) {
     
      Swal.fire({
        title:'error',
        text:'Debe completar los campos del formulario',
        icon:'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.artistaArray.push(      
      {
        id: this.artistaArray.length + 1,
        nombreCompleto: this.miArtista.nombreCompleto,
        edad: this.miArtista.edad,
        nacionalidad: this.miArtista.nacionalidad
      }
    )
    this.guardarStorage();
    this.limpiarArtista();
    console.log(this.artistaArray);
     

  }

  eliminarArtista(index:any){
    
    if(confirm("¿DESEAS BORRAR ESTE ARTISTA?")){
    this.artistaArray.splice(index,1);
    }
    this.guardarStorage();
  }

  editarArtista(form:NgForm){
    
    if (form.invalid) {
     
      Swal.fire({
        title:'error',
        text:'Debe completar los campos del formulario',
        icon:'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    let id = this.artistaArray.find(elemento => elemento.id === this.miArtista.id);
     if(id){
       let index = this.artistaArray.indexOf(id);
       this.artistaArray[index] = this.miArtista;
     }
     this.guardarStorage();
     this.limpiarArtista();
  }

 



  limpiarArtista(){
    this.miArtista = <artistaModel>{};
  }

  guardarStorage(){
    localStorage.setItem('artista', JSON.stringify(this.artistaArray));
  }

  cargarStorage(){  
    this.artistaArray = JSON.parse(localStorage.getItem('artista')|| '[]');
  }

  cargarArtista(artista:artistaModel){
    this.miArtista= artista;
  }




}
