import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Client} from '../../models/Client';
import {Lead} from '../../models/Lead';
import {Message} from '../../models/Message';
import {Chat} from '../../models/Chat';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-approval-requests',
  templateUrl: './approval-requests.component.html',
  styleUrls: ['./approval-requests.component.less']
})
export class ApprovalRequestsComponent implements OnInit {

  private dialogSub: Subscription = null;
  private selectedClient: Client;
  private selectedLead: Lead;
  private chatItems: Chat[] = [];
  private chatsWithPending: Chat[] = [];
  private getAR: boolean;
  private loadControls = false;
  // private requests: Message[] = [];

  constructor(
    public dialogRef: MatDialogRef<ApprovalRequestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {client?: Client, lead?: Lead, chats?: Chat[], getAR?: boolean, loadControls?: boolean},
    private dialog: MatDialog,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    // if (!this.data.chats) {
    //   this.chatService.getChatsByParticipants(this.data.client.id, this.data.lead.id)
    //     .subscribe(data => {
    //       // this.chatItems = data.data;
    //       console.log('chat by participants: ', data.data);
    //       this.loadDataSingle(this.data.client, this.data.lead, data.data, this.data.getAR);
    //     });
    // } else {
      this.loadDataSingle(this.data.client, this.data.lead, this.data.chats, this.data.getAR, this.data.loadControls);
    //   console.log('(chats) data', this.data);
    // }
  }

  loadDataSingle(client: Client, lead: Lead, chats: Chat[] = [], getAR: boolean = false, loadControls: boolean = false) {
    if (!client || !lead) {
      return false;
    }
    this.selectedClient = client;
    this.selectedLead = lead;
    this.chatItems = chats;
    this.getAR = getAR;
    this.loadControls = loadControls;
    this.chatService.getChatsWithAR().subscribe(data => {
      this.chatsWithPending = data.data;
    });
    // this.requests = this.filterPendingRequests();
    return true;
  }

  // filterPendingRequests(): Message[] {
  //   return this.chatItems
  //     .filter(chatItem => chatItem.message)
  //     .map(chatItem => chatItem.message)
  //     .filter(msg => msg.approval_request === 'PENDING');
  // }

  approveRequest(event, message: Message) {
    this.chatService.changeMessageStatus(message, 'APPROVED')
      .subscribe(res => {
        if (res) {
          event.target.style.disabled = true;
          // console.log('event.target.parentNode', event.target.closest('.request'));
          // event.target.closest('.request').disabled = true;
          const requestDiv = event.target.closest('.request');
          requestDiv.childNodes.forEach(child => child.disabled = true);
          requestDiv.classList.add('request-approved');
          // event.target.closest('.request').childNodes.forEach(child => {
          //   child.disabled = true;
          // });
        }
        console.log('res.data', res);
        console.log('message', message);
        console.log('res.data == message', res.data === message);
      });
  }

  declineRequest(message: Message) {
    this.chatService.changeMessageStatus(message, 'REJECTED')
      .subscribe(res => {
        console.log(res);
      });
  }

}
