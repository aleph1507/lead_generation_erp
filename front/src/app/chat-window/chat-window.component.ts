import {AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chat} from '../models/Chat';
import {Client} from '../models/Client';
import {Lead} from '../models/Lead';
import {ChatService} from '../services/chat.service';
import {Message} from '../models/Message';
import {ChatsPerClient} from '../models/ChatsPerClient';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.less']
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {

  @Input() selectedClient: Client = null;
  @Input() selectedLead: Lead = null;
  @Input() chatItems: Chat[];
  @Input() getARs: boolean;
  @Input() chatsWithPending: Chat[];
  @Input() chatPending: Chat;
  @Input() chatsByParticipants: ChatsPerClient[];
  @Input() loadControls: boolean;
  private requests: Message[] = [];
  private approvedChatItems: Chat[];
  private rejectedChatItems: Chat[];
  private showChatItemsAccordion = false;
  // private requests: Chat[] = [];
  // private requests: ChatsPerClient[] = [];

  textMsgCtrl = new FormControl(null, {
    validators: [Validators.required]
  });

  @ViewChild('cc', {static: true}) private chatContainer: ElementRef;
  @ViewChild('textMessageBox', {static: true}) private txtMsg: ElementRef;

  constructor(private chatsService: ChatService) { }

  ngOnInit() {
    if (!this.chatItems || this.chatItems.length === 0) {
      this.chatsService.getChatsByParticipants(this.selectedClient.id, this.selectedLead.id)
        .subscribe(chats => {
          this.chatItems = chats.data;
          if (this.chatsWithPending && this.getARs) {
            this.requests = this.filterPendingRequests();
          }
          if (!this.chatsWithPending) {
            this.chatsWithPending = [];
            this.chatsService.getChatsWithAR().subscribe(data => {
              this.chatsWithPending = data.data;
            });
          }
          // console.log('this.requests', this.requests);
          this.scrollToBottom();
          this.chatsByApproval();
        });
    } else {
      if (this.chatsWithPending && this.getARs) {
        this.requests = this.filterPendingRequests();
        // console.log('this.requests', this.requests);
      }
      this.chatsByApproval();
    }
  }

  chatsByApproval() {
    this.approvedChatItems = this.chatItems
      .filter(chat => chat.message && chat.message.approval_request === 'APPROVED')
      .reverse();
    this.rejectedChatItems = this.chatItems
      .filter(chat => chat.message && chat.message.approval_request === 'REJECTED')
      .reverse();

    this.showChatItemsAccordion = (this.approvedChatItems.length > 0 || this.rejectedChatItems.length > 0);
  }

  setMessageValue(text: string) {
    this.textMsgCtrl.setValue(text);
    // if (!this.txtMsg) {
    //   this.txtMsg = @ViewChild('textMessageBox', {static: true});
    // }
    document.getElementById('text-msg').focus();
    // if (this.txtMsg) {
      // this.txtMsg.nativeElement.focus();
    // }
  }



  filterPendingRequests(): Message[] {
    // return this.chatPending;
    // return this.chatsWithPending;
    // return this.chatsByParticipants;
    // return this.chatsWithPending;
    // return this.chatItems
    //   .filter(chatItem => chatItem.message && chatItem.message.approval_request === 'PENDING')
    //   .map(chatItem => chatItem.message);
    // for (let i = displayChats.length - 1; i >= 0; i--) {
    //   for (let j = i - 1; j >= 0; j--) {
    //     if (displayChats[j].client_id === displayChats[i].client_id &&
    //         displayChats[j].lead_id === displayChats[j].lead_id) {
    //       displayChats.splice(j, 1);
    //     }
    //   }
    // }
    //
    // return displayChats;

    // return this.chatItems
    //   .filter(chatItem => chatItem.message && chatItem.message.approval_request === 'PENDING')
    //   .map(chatItem => chatItem.message);
    return this.chatItems
      .filter(chatItem => chatItem.message)
      .map(chatItem => chatItem.message)
      .filter(msg => msg.approval_request === 'PENDING');
  }

  ngAfterViewChecked(): void {
    // console.log('this.chatContainer', this.chatContainer);
    // console.log('this.chatContainer.nativeElement', this.chatContainer.nativeElement);

    this.scrollToBottom();
  }

  getChatItemRole(chatItem: Chat) {
    return chatItem.message ? 'message' : 'response';
  }

  getChatItemText(chatItem: Chat) {
    return chatItem.message ? chatItem.message.text : chatItem.response.text;
  }

  getMessageApproved(msg: Message) {
    // 'PENDING' |'APPROVED' | 'REJECTED' | 'ALTERED' | null;
    switch (msg.approval_request) {
      case null:
        return true;
      case 'APPROVED':
      case 'ALTERED':
      default:
        return false;
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      // console.log('this.chatContainer.nativeElement.scrollHeight', this.chatContainer.nativeElement.scrollHeight);
    } catch (err) {
      console.log('Error scrolling chatContainer: ', err);
    }
  }

  approveRequest(event, message: Message) {

    this.chatsService.changeMessageStatus(message, 'APPROVED')
      .subscribe(res => {
        if (res) {
          event.target.style.disabled = true;
          // console.log('event.target.parentNode', event.target.closest('.request'));
          // event.target.closest('.request').disabled = true;
          const requestDiv = event.target.closest('.request');
          const controlsDiv = requestDiv.childNodes.forEach(child => {
            if (child.classList.contains('request-pending-controls')) {
              child.childNodes.forEach(c => c.disabled = true);
            }
          });
          requestDiv.childNodes.forEach(child => child.disabled = true);
          message.approval_request = 'APPROVED';
          // requestDiv.classList.add('request-approved');
          // event.target.closest('.request').childNodes.forEach(child => {
          //   child.disabled = true;
          // });
        }
        console.log('res.data', res);
        console.log('message', message);
        console.log('res.data == message', res.data === message);
      });
  }

  declineRequest(event, message: Message) {
    this.chatsService.changeMessageStatus(message, 'REJECTED')
      .subscribe(res => {
        const requestDiv = event.target.closest('.request');
        requestDiv.childNodes.forEach(child => child.disabled = true);
        message.approval_request = 'REJECTED';
        // requestDiv.classList.add('request-declined');
      });
  }

  saveTextMsg(role: string, submitForApproval: boolean = false) {
    // ['client_id', 'lead_id', 'message_id', 'response_id', 'text']
    this.chatsService.storeChat(new Chat({
      client_id: this.selectedClient.id,
      lead_id: this.selectedLead.id,
      text: this.textMsgCtrl.value
    }), role).subscribe(data => {
      // this.textMsgCtrl.setValue('');
      this.textMsgCtrl.reset();
      console.log('saveTextMsg res: ', data);
      // if (role !== 'approvalRequest') {
      // if (data.data.response || data.data.message.approval_request !== 'PENDING') {
      //   this.chatItems.push(data.data);
      // }

      if (data.data.response || data.data.message.approval_request == null) {
        this.chatItems.push(data.data);
      }

      if (data.data && data.data.message) {
        if (data.data.message.approval_request === 'PENDING') {
          if (!this.chatsWithPending) {
            this.chatsService.getChatsWithAR().subscribe(cwp => {
              this.chatsWithPending = cwp.data;
              for (let i = 0; i < this.chatsWithPending.length; i++) {
                if (this.chatsWithPending[i].client_id === data.data.client_id &&
                  this.chatsWithPending[i].lead_id === data.data.lead_id) {
                  this.chatsWithPending.splice(i, 1);
                }
              }
              this.chatsWithPending.push(data.data);
            });
          } else {
            for (let i = 0; i < this.chatsWithPending.length; i++) {
              if (this.chatsWithPending[i].client_id === data.data.client_id &&
                this.chatsWithPending[i].lead_id === data.data.lead_id) {
                this.chatsWithPending.splice(i, 1);
              }
            }
            this.chatsWithPending.push(data.data);
          }
        }
      }
      // }
    });
  }

}
