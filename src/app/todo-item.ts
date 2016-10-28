import * as _ from 'lodash';
import { ColorGenerator } from './color';

export class TodoItem {
    id: number;
    title: string;
    description: string;
    done: boolean;
    priority: number;
    color: string;
}

export class TodoList {
    private items: Array<TodoItem>;

    constructor(items?: Array<TodoItem>) {
        this.items = [];
        if (items && items.length) {
            this.addItem(...items);
        }
    }

    getItems(): Array<TodoItem> {
        return this.items;
    }

    addItem(...args: Array<TodoItem>) {
        let id: number = this.items.length ? _.maxBy(this.items, function(item) { return item.id; }).id + 1 : 1;
        let gen = new ColorGenerator({luminosity: 'light'});
        let colors = gen.randomColor(args.length);
        colors = typeof colors === 'string' ? [colors as string] : colors as Array<string>;
        for (let i = 0; i < args.length; i++) {
            args[i].id = args[i].id === 0 ? id : args[i].id;
            args[i].color = !args[i].color ? colors.shift() : args[i].color;
            this.items.push(args[i]);
            id++;
        }
    }

    addItems(items: Array<TodoItem>) {
        this.addItem(...items);
    }

    deleteItem(id: number) {
        _.remove(this.items, function(todo) {
            return todo.id !== id;
        });
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}
