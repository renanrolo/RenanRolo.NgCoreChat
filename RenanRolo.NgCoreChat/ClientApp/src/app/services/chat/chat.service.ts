import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import * as signalR from "@aspnet/signalr";
import { Constants } from "../../constants";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { Mensagem } from "./mensagem";
import { Usuario } from "./usuario";

@Injectable()
export class ChatService {

    private hubConnection: signalR.HubConnection;

    public Eu: Usuario;

    public UsuariosOnline: Usuario[];

    public Mensagens: Mensagem[];

    constructor(private http: HttpClient, private route: Router) {
        this.ngOnInit();
    }

    ngOnInit(): void {
        //this.checkUser();
        this.startConnection();
    }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(Constants.ApiChatEndpoint)
            .build();

        this.hubConnection.start().then(
            () => {
                console.log("Conectado ao chat...")
            }
        );

        this.hubConnection.on("Usuarios", (response) => {
            this.UsuariosOnline = response.map(x => new Usuario(x.usuarioId, x.nome, x.avatarId, x.conectado));
        });

        this.hubConnection.on("EntrarNoChat", (response) => {
            this.Eu = new Usuario(response.usuarioId, response.nome, response.avatarId, true);
            this.route.navigate(['/chat']);
        });

        this.hubConnection.on("ReceberMensagem", (response) => {

            let de = this.UsuariosOnline.find((el) => el.Id === response.usuarioId);

            let para = this.UsuariosOnline.find((el) => el.Id === this.Eu.Id);

            let mensagem = new Mensagem();
            mensagem.De = de;
            mensagem.Para = para;
            mensagem.DataHora = new Date();
            mensagem.Texto = response.mensagem;

            de.AdicionarMensagem(mensagem);
        });

        this.hubConnection.on("UsuarioEntrou", (response) => {
            if (this.isLoged()) {
                let usuario = new Usuario(response.usuarioId, response.nome, response.avatarId, true);
                this.UsuariosOnline.push(usuario);
            }
        });

        this.hubConnection.on("UsuarioDesconectou", (response) => {
            if (this.isLoged()) {

                console.log("UsuarioDesconectou", response);
                let usuario = this.UsuariosOnline.find(x => x.Id == response);
                usuario.Online = false;
            }
        });


    }

    public EnviarMensagem(mensagem: string, para: Usuario) {

        let msg = new Mensagem();

        msg.De = this.Eu;
        msg.Para = para;
        msg.Texto = mensagem;
        msg.DataHora = new Date();

        para.AdicionarMensagem(msg);

        this.hubConnection.send('EnviarMensagem', mensagem, para.Id);
    }



    public isLoged(): boolean {
        return this.Eu !== undefined;
    }

    public logIn(nome: string, avatarId: number, redirectTo: string) {
        this.hubConnection.send('Entrar', nome, avatarId);
    }

    public logOut() {
    }

    public handdleLogin() {
        this.route.navigate(['/']);
    }

}