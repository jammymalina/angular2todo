import { Component, OnInit, Input } from '@angular/core';
import { TodoItem } from '../todo-item';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent implements OnInit {

    @Input() item: TodoItem;

    constructor() {}

    ngOnInit() {}

}
