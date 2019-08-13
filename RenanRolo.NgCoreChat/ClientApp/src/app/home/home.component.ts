import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  entrarChatForm: FormGroup;

  avatares: string[] = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  
  constructor(private formBuilder: FormBuilder,
    private chatService: ChatService,
    private router: Router) { }

  ngOnInit() {
    this.entrarChatForm = this.formBuilder.group({
      Nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
      AvatarId: this.formBuilder.control('', [Validators.required])
    });
  }

  entrarNoChat(formulario: any) {
    this.chatService.logIn(formulario.Nome, formulario.AvatarId, '/chat');
  }

}
