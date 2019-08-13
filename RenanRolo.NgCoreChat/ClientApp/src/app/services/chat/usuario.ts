import { Mensagem } from "./mensagem";

export class Usuario {
    constructor(id: number, nome: string, avatarId: number, online: boolean) {
        this.Id = id;
        this.Nome = nome;
        this.AvatarId = avatarId;
        this.Online = online;
    }
    Id: number;
    Nome: string;
    AvatarId: number;
    Online: boolean;
    Mensagens: Mensagem[] = [];
    EscreverMensagem: string;
    UltimaMensagemRecebidaDate: Date;
    UltimaMensagemRecebidaLida: boolean;
    UltimaMensagemRecebidaTexto: string;

    AdicionarMensagem(mensagem: Mensagem) {
        this.UltimaMensagemRecebidaDate = new Date();
        this.UltimaMensagemRecebidaLida = false;
        this.Mensagens.push(mensagem);
    }

    ObterUltimaMensagem(): Mensagem {
        return this.Mensagens.length > 0 ? this.Mensagens[this.Mensagens.length - 1] : null;
    }
}