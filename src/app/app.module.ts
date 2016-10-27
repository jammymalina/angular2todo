import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { StorageService } from './storage.service';
import { ItemService } from './item.service';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  providers: [StorageService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
