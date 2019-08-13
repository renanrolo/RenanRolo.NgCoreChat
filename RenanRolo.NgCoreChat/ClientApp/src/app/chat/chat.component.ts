import { Component } from '@angular/core';
import { Usuario } from '../services/chat/usuario';
import { ChatService } from '../services/chat/chat.service';
import { Mensagem } from '../services/chat/mensagem';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  ConversarCom: Usuario;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
  }

  public UsuariosOnline(): Usuario[] {
    let _usuariosOnline = this.chatService
      .UsuariosOnline
      .filter((usuario: Usuario) => usuario.Id !== this.Eu().Id);

    return _usuariosOnline;
  }

  public Eu(): Usuario {
    return this.chatService.Eu;
  }


  public CliqueConversarCom(usuario: Usuario) {
    this.ConversarCom = usuario;
  }

  public ClasseMensagem(mensagem: Mensagem): string {
    return this.chatService.Eu.Id == mensagem.De.Id ? 'replies' : 'sent';
  }

  public MensagemValida(): boolean {
    return this.ConversarCom.EscreverMensagem && this.ConversarCom.EscreverMensagem.length > 0;
  }

  public EnviarMensagem() {
    this.chatService.EnviarMensagem(this.ConversarCom.EscreverMensagem, this.ConversarCom);
    this.ConversarCom.EscreverMensagem = "";
  }
}



