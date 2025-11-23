import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket!: WebSocket;
  constructor() { }

  openWebSocket(dataArr : string[]) : Observable<any>
  {
    this.webSocket = new WebSocket("wss://localhost:5001/ws");

    return new Observable (
      observer => {
        this.webSocket.onerror = (event) => {swal.fire({
            icon: 'error',
            text: "the server is shut down"
          })
        };
        this.webSocket.onmessage = (event) => {
          const text = event.data;
          observer.next(text);
        };
        this.webSocket.onclose = (event) => {
          observer.next("close");
          // console.log('close: ', event);
        };
        this.webSocket.onopen = () => {
          for (let i = 0; i < dataArr.length; i++)
            this.sendMessage(dataArr[i]);
        };
        
      }
    )
  }

  sendMessage(data : string) 
  {
    if (this.webSocket != null)
      this.webSocket.send(data);
  }

  closeWebSocket() 
  {
    if (this.webSocket != null)
      this.webSocket.close();
  }

}
