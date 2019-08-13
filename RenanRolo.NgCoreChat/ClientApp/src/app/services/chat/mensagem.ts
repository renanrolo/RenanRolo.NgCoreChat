import { Usuario } from "./usuario";

export class Mensagem
{
    De: Usuario;
    Para: Usuario;
    Texto: String;
    DataHora: Date;
}