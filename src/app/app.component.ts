import { Component, OnInit } from '@angular/core';
import { TodoList } from './todo-item';
import { ItemService } from './item.service';

import './rxjs-operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    todoList: TodoList;
    errorMessage: string;

    constructor(private itemService: ItemService) {}

    ngOnInit() {
        this.todoList = new TodoList();
        this.itemService.getItems().subscribe(items => this.todoList.addItems(items), error =>  this.errorMessage = error as any);
        console.log(this.todoList.isEmpty());
    }
}
