import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserFile } from '../models/models';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements OnInit {

  @Input('file')
  file:UserFile;

  @Output()
  close= new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
