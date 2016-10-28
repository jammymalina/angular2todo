import { Component, OnInit, AfterViewInit, Input, ViewChildren, HostListener, HostBinding, QueryList } from '@angular/core';
import { TodoItem } from '../todo-item';
import { TodoDetailComponent } from '../todo-detail/todo-detail.component';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, AfterViewInit {

    @Input() items: Array<TodoItem>;
    @ViewChildren(TodoDetailComponent) griditems: QueryList<TodoDetailComponent>;
    @HostBinding('style.width.px') width: number;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.packItems();
    }

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.packItems();
    }

    packItems() {
        
    }

}
