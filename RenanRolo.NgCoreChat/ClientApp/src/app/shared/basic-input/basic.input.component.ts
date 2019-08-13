import { Component, OnInit, Input, ContentChild, AfterContentInit } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';

@Component({
  selector: 'basic-input-container',
  templateUrl: './basic.input.component.html'
})
export class BasicInputComponent implements OnInit, AfterContentInit {
  @Input() label: string;
  @Input() errorMessage: string;
  @Input() smalltext: string;
  @Input() showTip: true;

  input: any;

  @ContentChild(NgModel) model: NgModel;
  @ContentChild(FormControlName) control: FormControlName;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.input = this.model || this.control;
    if (this.input === undefined) {
      throw new Error('Esse componente precisa ser usado com uma diretiva ngModel');
    }
  }

  hasSuccess(): boolean {
    return this.input.valid && (this.input.dirty || this.input.touched);
  }


  hasError(): Boolean {
    return this.input.invalid && (this.input.dirty || this.input.touched);
  }

}
