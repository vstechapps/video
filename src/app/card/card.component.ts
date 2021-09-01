import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit {

  @Input()
  background:string;

  @Input()
  color:string;

  themes:Theme[]=[];

  constructor() {
    this.themes.push({background:"BlanchedAlmond",color:"black"});
    this.themes.push({background:"Aqua",color:"black"});
    this.themes.push({background:"HoneyDew",color:"black"});
    this.themes.push({background:"Ivory",color:"black"});
    this.themes.push({background:"LightBlue",color:"black"});
    this.themes.push({background:"LightGreen",color:"black"});
    this.themes.push({background:"LightSeaGreen",color:"white"});
    this.themes.push({background:"SteelBlue",color:"white"});
    this.themes.push({background:"Tomato",color:"white"});
    this.themes.push({background:"SeaGreen",color:"white"});
    this.themes.push({background:"MediumVioletRed",color:"white"});
    this.themes.push({background:"SlateGrey",color:"white"});
    let theme:Theme=this.themes[Math.floor(Math.random()*this.themes.length)];
    if(this.background==null)this.background=theme.background;
    if(this.color==null)this.color=theme.color;
   }

  ngOnInit(): void {
  }

}

export class Theme{
  background:string;
  color:string;
}
