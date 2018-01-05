import { Component, Input } from '@angular/core';

import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})
export class MessageComponent {
    @Input() public message: Message;

    constructor(private messageService: MessageService) {}

    public onEdit() {
        this.messageService.editMessage(this.message);
    }

    public onDelete() {
        this.messageService.deleteMessage(this.message)
            .subscribe(
                // tslint:disable-next-line:no-console
                (result) => console.log(result)
            );
    }

    public belongsToUser() {
        return localStorage.getItem('userId') === this.message.userId;
    }
}
