import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  USER_KEY = USER_KEY;
  private cookieStore: Map<string, string> = new Map<string, string>();

  constructor(){
    this.parseCookies(document.cookie);
  }

  parseCookies(cookies = document.cookie) {
    this.cookieStore = new Map<string, string>()
    if(!!cookies === false) {
      return
    }
    const cookiesArr = cookies.split(';')
    for (const cookie of cookiesArr) {
      const cookieArr = cookie.split("=")
      this.cookieStore.set(cookieArr[0].trim(), cookieArr[1])
    }
  }

  clean(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.remove()
  }

  public saveUser(user: any): void {
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.remove()
    this.set(JSON.stringify(user));
  }

  remove() {
    document.cookie = `${USER_KEY} = ; expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;
  }

  set(value: string) {
      document.cookie = USER_KEY + '=' + (value || '');
  }  

  public getUser(): any {
    // const user = window.sessionStorage.getItem(USER_KEY);
    // if (user) {
    //   return JSON.parse(user);
    // }
    // return {};
    this.parseCookies()
    const currToken = this.cookieStore.get(USER_KEY);
    return !!currToken ? JSON.parse(currToken) : {};
  }

  public isLoggedin(): boolean {
    const user = this.cookieStore.get(USER_KEY);
    if (user) {
      return true;
    } 
    return false;
  }

}
