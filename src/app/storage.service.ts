import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  read<T>(key: string): T {
      let value: string = localStorage.getItem(key);
      if (value && value != "undefined" && value != "null") {
          return JSON.parse(value) as T;
      }
      return null;
  }

  write(key: string, value: any) {
      if (value) {
          value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
  }

}
