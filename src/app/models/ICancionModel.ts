
import { artistaModel } from "./IartistaModel";

export interface ICancionModel{
    
    id:number,
    idArtista:number,  
    nombreArtista:string, 
    nombreCancion:string,
    duracion:string,
    album:string
}