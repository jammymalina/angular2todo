import { Component, OnInit } from '@angular/core';
import { TodoItem } from './todo-item';
import { ItemService } from './item.service';

import './rxjs-operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    items: Array<TodoItem>;
    errorMessage: string;

    constructor(private itemService: ItemService) {}

    ngOnInit() {
        this.items = [];
        this.itemService.getItems().subscribe(items => this.items = items, error =>  this.errorMessage = error as any);
    }
}
