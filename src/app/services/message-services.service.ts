import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageServicesService {
  private subject = new Subject<any>()


  sendMessage(message: string) {
      this.subject.next({ text: message }); 
  }

  clearMessages() { 
      this.subject.next();
      this.subject.complete();
  }
  

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
