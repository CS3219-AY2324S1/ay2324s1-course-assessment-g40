import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent {
  @Input() items : any;
  pressed = false;
  selected: string[] = [];
  
  ngOnInit(): void {
    this.selected = [];
  }

  press() {
    this.pressed = !this.pressed;
    for(const select of this.selected) {
      document.getElementById(select)?.style.setProperty('background', 'rgba(82, 109, 130, 1)');
      document.getElementById(select)?.style.setProperty('color', 'white');
    }
  }

  remove(id:string) {
    const index = this.selected.indexOf(id);
    this.selected.splice(index, 1);
  }

  select(id: string) {
    if (!this.selected.includes(id)) {
      this.selected.push(id);
    }
    for(const i of this.items) {
      document.getElementById(i)?.style.setProperty('background', 'white');
      document.getElementById(i)?.style.setProperty('color', 'rgba(82, 109, 130, 1)');
    }
    for (const s of this.selected) {
      document.getElementById(s)?.style.setProperty('background', 'rgba(82, 109, 130, 1)');
      document.getElementById(s)?.style.setProperty('color', 'white');
    }
  }
}
