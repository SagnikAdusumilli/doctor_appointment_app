import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Message } from './message.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class MessageService {
    public messageIsEdit = new EventEmitter<Message>();
    private messages: Message[] = [];
    // private BE_URL = 'http://localhost:3000/';
    private BE_URL = 'https://message-app-2.herokuapp.com/';

    constructor(private http: Http, private errorService: ErrorService) {
    }

    public addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post(this.BE_URL + 'message' + token, body, {headers})
            .map((response: Response) => {
                const result = response.json();
                const msg = new Message(
                    result.obj.content,
                    result.obj.user.firstName,
                    result.obj._id,
                    result.obj.user._id);
                this.messages.push(msg);
                return msg;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    public getMessages() {
        return this.http.get(this.BE_URL + 'message')
            .map((response: Response) => {
                const messages = response.json().obj;
                const transformedMessages: Message[] = [];
                for (const message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    public editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    public updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch(this.BE_URL + 'message'  + message.messageId + token, body, {headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    public deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete(this.BE_URL + 'message' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}
