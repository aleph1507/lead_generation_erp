import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {Lead} from '../models/Lead';
import {LeadService} from '../services/lead.service';
import {Observable, Subscription} from 'rxjs';
// import {consoleTestResultHandler} from 'tslint/lib/test';
import {ChatService} from '../services/chat.service';
import {Chat} from '../models/Chat';
// import {Response} from '../models/Response';
// import {Message} from '../models/Message';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../services/snackbar.service';
import {ApprovalRequestsComponent} from '../dialogs/approval-requests/approval-requests.component';
import {AuthService} from '../services/auth.service';
import {User} from '../models/User';
// import {ChatsPerClient} from '../models/ChatsPerClient';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.less']
})
export class ChatsComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:variable-name
  client_id = new FormControl(null, {
    validators: [Validators.required]
  });
  clients: any;
  leadClients = '';
  selectedClient: Client = null;
  selectedLead: Lead = null;
  clientOTP = false;
  leadOTP = false;
  selectedViaLead = false;
  chatItems: Chat[] = [];
  private dialogSub: Subscription = null;
  chatsWithPending: Chat[];
  approvedChatItems: Chat[];
  rejectedChatItems: Chat[];
  showChatItemsAccordion = false;
  user: User;
  userAuthSubscription: Subscription;

  // tslint:disable-next-line:variable-name
  lead_id = new FormControl(null, {
    validators: [Validators.required]
  });
  leads: any;

  isLoading = false;

  isAdmin = false;

  textMsgCtrl = new FormControl(null, {
    validators: [Validators.required]
  });

  textMsg: string;


  constructor(
    private clientsService: ClientService,
    private leadsService: LeadService,
    private chatsService: ChatService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.client_id.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.clientOTP ? this.clientOTP = false : this.selectedClient = null;
          // this.selectedClient = null;
          this.clients = [];
          this.isLoading = true;
          this.leads = [];
          this.textMsgCtrl.setValue('');
        }),
        switchMap(value => {
          if (this.clientOTP) {
            return new Observable<boolean>();
          }
          return this.clientsService.searchClients(value, this.selectedLead).pipe(
            finalize(() => {
              this.isLoading = false;
              if (Array.isArray(this.clients) && this.clients.length > 0) {
                this.clientOTP = true;
              }
              // this.leadOTP = true;
              console.log('selectedClient: ', this.selectedClient);
              console.log('selectedLead: ', this.selectedLead);
              if (this.selectedLead && !this.selectedClient) {
                this.selectedClient = this.selectedLead.client[0];
              }
            })
          );
        })
      ).subscribe(data => {
      data && typeof data !== 'boolean' ? this.clients = data.data : this.clientOTP = false;
      this.clients.forEach((c) => {
        let userString = '';
        if (c && c.user) {
          userString = '(' + c.user.name + ')';
        }
        c.userTag = userString;
      });
    });

    this.lead_id.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.leadOTP ? this.leadOTP = false : this.selectedLead = null;
          // this.selectedLead = null;
          this.leads = [];
          this.isLoading = true;
          this.textMsgCtrl.setValue('');
        }),
        switchMap(value => {
          if (this.leadOTP) {
            return new Observable<boolean>();
          }
          return this.leadsService.searchLeads(value, this.selectedClient).pipe(
            finalize(() => {
              this.isLoading = false;
              this.leadOTP = true;
            })
          );
        })
      ).subscribe(data => {
        // if (!this.clientOTP) {
        //   this.leads = [];
        //   return this.leadOTP = false;
        // }
        if (data && typeof data !== 'boolean') {
          this.leads = data.data;
          this.leads.forEach((lead: Lead) => {
            let clientString = '';
            if (lead && lead.client && Array.isArray(lead.client) && lead.client.length > 0) {
              clientString = '(';
              lead.client.forEach((c: Client) => {
                if (clientString.length > 3) {
                  clientString += ', ';
                }
                clientString += c.name;
              });
              clientString += ')';
            }
            if (clientString === '') {
              clientString = '(no clients)';
            }

            lead.myTags = clientString;
          });
        } else {
          this.leadOTP = false;
        }

    });

    if (!this.userAuthSubscription) {
      this.userAuthSubscription = this.authService.userSubject.asObservable().subscribe(user => {
        this.user = user;
        this.isAdmin = this.user && this.user.admin;
        if (this.isAdmin) {
          this.getChatsWithPending();
        }
      });
    }
  }

  getChatsWithPending() {
    this.chatsService.getChatsWithAR().subscribe(data => {
      // for (let i = 0; i < data.data.length; i++) {
      //   for (let j = 0; j < data.data.length; j++) {
      //     if (j === i) { continue; }
      //     if (data.data[i].client_id === data.data[j].client_id &&
      //         data.data[i].lead_id === data.data[j].lead_id) {
      //
      //         // data.data[i].message
      //     }
      //   }
      // }
      this.chatsWithPending = data.data;
      console.log('this.chatsWithPending', this.chatsWithPending);
      // todo:
      // chatsWithPending to display
      // console.log('chatsWithPending: ', this.chatsWithPending);
    });
  }

  // groupChatsByParticipants(chats: Chat[]): ChatsPerClient[] {
  //   const cpc: ChatsPerClient[] = [];
  //   const chat: ChatsPerClient = null;
  //   for (const c of chats) {
  //     let cpcNew = cpc.find(cpcChat => (cpcChat.clientId === c.client_id && cpcChat.leadId === c.lead_id));
  //     if (!cpcNew) {
  //       cpcNew = new ChatsPerClient();
  //       cpcNew.clientId = c.client_id;
  //       cpcNew.leadId = c.lead_id;
  //       cpc.push(cpcNew);
  //     }
  //     cpcNew.chats.push(c.message ? c.message : c.response);
  //   }
  //
  //   return cpc;
  // }

  // filterChatsWithPending(): Chat[] {
  //   return this.chatsWithPending
  //     .filter(cwp => (cwp.client_id === this.selectedClient.id && cwp.lead_id === this.selectedLead.id));
  // }

  displayClientFn(client ?: Client): string | undefined {
    return client ? client.name : undefined;
  }

  displayLeadFn(lead ?: Lead): string | undefined {
    return lead ? lead.firstName + ' ' + lead.lastName + ' ' + lead.myTags : undefined;
  }

  getLeads(client: Client) {
    this.selectedClient = client;
    this.clientOTP = true;
    // console.log('selectedClient: ', this.selectedClient);
    // console.log('selectedLead: ', this.selectedLead);

    if (this.selectedLead && this.selectedLead.client && !this.selectedLead.client.includes(this.selectedClient)) {; } {
      this.selectedLead = null;
      this.lead_id.setValue('');
      this.textMsgCtrl.setValue('');
    }

    this.fetchChat();

    // if (this.selectedLead instanceof Lead) {
    //   for (const c of this.selectedLead.client) {
    //     if (c.id === this.selectedClient.id) {
    //       console.log('GET CHAT, lead.id: ', this.selectedLead.id, ' client.id: ', this.selectedClient.id);
    //       break;
    //     }
    //   }
    //   // if (this.selectedLead.client.includes(this.selectedClient)) {
    //   //   console.log('GET CHAT, lead.id: ', this.selectedLead.id, ' client.id: ', this.selectedClient.id);
    //   // }
    // }
    // console.log('option selected: ', this.selectedClient);
  }

  // getChatItemRole(chatItem: Chat) {
  //   return chatItem.message ? 'message' : 'response';
  // }
  //
  // getChatItemText(chatItem: Chat) {
  //   return chatItem.message ? chatItem.message.text : chatItem.response.text;
  // }
  //
  // getMessageApproved(msg: Message) {
  //   // 'PENDING' |'APPROVED' | 'REJECTED' | 'ALTERED' | null;
  //   switch (msg.approval_request) {
  //     case 'APPROVED':
  //     case 'ALTERED':
  //     case null:
  //       return true;
  //     default:
  //       return false;
  //   }
  // }

// {
// "data":{
//  "id":2,
//  "message":{
//     "id":2,
//     "text":"ar1 kurt",
//     "approved":null,
//     "approval_request":"PENDING",
//     "deleted_at":null,
//     "created_at":"2020-02-14 17:25:58",
//     "updated_at":"2020-02-14 17:25:58",
//     "chat_id":2
//     },
//  "response":null,
//  "client_id":1,
//  "lead_id":1,
//  "created_at":"2020-02-14",
//  "updated_at":"2020-02-14"}
//  }


  fetchChat() {
    if (this.selectedLead && this.selectedClient) {
      for (const c of this.selectedLead.client) {
        if (c.id === this.selectedClient.id) {
          this.chatsService.getChatsByParticipants(this.selectedClient.id, this.selectedLead.id).subscribe(data => {
            this.chatItems = data.data;
            this.approvedChatItems = this.chatItems
              .filter(chat => chat.message && chat.message.approval_request === 'APPROVED')
              .reverse();
            this.rejectedChatItems = this.chatItems
              .filter(chat => chat.message && chat.message.approval_request === 'REJECTED')
              .reverse();
            this.showChatItemsAccordion = (this.approvedChatItems.length > 0 || this.rejectedChatItems.length > 0);
          });
        }
      }
    }
  }

  setMessageValue(text: string) {
    this.textMsgCtrl.setValue(text);
  }

  // getARMessages(ARStatus: string): Chat[] {
  //   return this.chatItems.filter(chat => chat.message && chat.message.approval_request === ARStatus);
  // }

  getClients(lead: Lead) {
    this.selectedLead = lead;
    // this.leadOTP = true;
    if (!this.selectedClient) {
      this.selectedClient = this.selectedLead.client[0];
      this.client_id.setValue(this.selectedLead.client[0]);
    }
    // console.log('lead selected: ', this.selectedLead);
    // console.log('selectedClient: ', this.selectedClient);


    this.fetchChat();

    // if (this.selectedClient) {
    //   if (this.selectedLead.client.includes(this.selectedClient)) {
    //     console.log('GET CHAT, lead.id: ', this.selectedLead.id, ' client.id: ', this.selectedClient.id);
    //   }
    // }
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
      // console.log('saveTextMsg res: ', data);
      // if (role !== 'approvalRequest') {
      if (data.data.response || data.data.message.approval_request !== 'PENDING') {
        this.chatItems.push(data.data);
      }

      if (data.data && data.data.message) {
        if (data.data.message.approval_request === 'PENDING') {
          for (let i = 0; i < this.chatsWithPending.length; i++) {
            if (this.chatsWithPending[i].client_id === data.data.client_id &&
                this.chatsWithPending[i].lead_id === data.data.lead_id) {
              this.chatsWithPending.splice(i, 1);
            }
          }
          this.chatsWithPending.push(data.data);
        }
      }
      // }
    });
  }

  openARDialog(client, lead, chats, getAR, loadControls) {
    // const messages: Message[] = this.chatItems
    //   .filter(chatItem => chatItem.message instanceof Message)
    //   .map(chatItem => chatItem.message);
    const dialogRef = this.dialog.open(ApprovalRequestsComponent, {
      data: {
        client,
        lead,
        chats,
        getAR,
        loadControls
        // client: this.selectedClient,
        // lead: this.selectedLead,
        // chats: this.chatItems
          // .filter(chatItem => chatItem.message)
          // .map(chatItem => chatItem.message)
          // .filter(msg => msg.approval_request === 'PENDING')
        // requests: this.chatItems.filter(chatItem => (chatItem && chatItem.message && chatItem.approval_request))
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      // if (result && result.data) {
      //   console.log('result:', result);
      // }
    });
  }

  ngOnDestroy(): void {
    if (this.userAuthSubscription) {
      this.userAuthSubscription.unsubscribe();
    }
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

}
