import { Component, OnInit, Input, ViewChildren, HostListener } from '@angular/core';
import { TodoItem } from '../todo-item';
import { TodoDetailComponent } from '../todo-detail/todo-detail.component';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

    @Input() items: Array<TodoItem>;
    @ViewChildren(TodoDetailComponent) griditems;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.packItems();
    }

    constructor() {}

    ngOnInit() {
        this.packItems();
    }

    packItems() {
        console.log(this.griditems);
    }

}
