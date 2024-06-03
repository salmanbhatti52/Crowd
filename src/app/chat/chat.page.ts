import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { Component, OnInit, ViewChild } from "@angular/core";
import { IonContent, Platform, PopoverController } from "@ionic/angular";
import { RestService } from "../rest.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  matchpopupHidden = true;
  popupSelectedVal: any;

  @ViewChild("IonContent", { static: true })
  content!: IonContent;
  checkType = "chatList";
  authToken: any;
  senderUserName: any;

  showSkeleton = true;
  noChatlistFlag = false;
  allMessages: any = [];
  currentUser: any;
  currentTime: string = "";
  user_input: string = "";
  // chatImagesArray = [];
  private autoSaveInterval: any;
  userIMG: any;

  remainingSMS = 0;

  uu: any = "";
  user: any = "";
  detailObj: any = "";

  userdata: any = "";
  userID: any = "";
  previousMsgsCount: any;
  NewMsgsCount: any;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public restService: RestService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private location: Location,
    public platform: Platform
  ) {
    this.userdata = localStorage.getItem("userdata");
    this.currentUser = JSON.parse(this.userdata).users_customers_id;

  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.detailObj = this.restService.detail;
    console.log("Detail Object: ",this.detailObj);
    
    if(this.restService.comingFrom == 'event-detail'){
      if(this.detailObj.events){
        this.detailObj.name = this.detailObj.events?.name;
      }else{
        this.detailObj.name = this.detailObj.name;
      }

    }
    if(this.restService.comingFrom == 'startChatWithAdmin'){
      this.detailObj = {}
      this.detailObj.name = 'Chat With Admin';
    }
    // Get all  messages....
    this.getMessages();
    this.autoSaveInterval = setInterval(() => {
      this.updateMessages();
    }, 3000);
  }
  ionViewWillLeave() {
    clearInterval(this.autoSaveInterval);
    console.log("clear");
    this.restService.comingFrom = ''
  }
  userTyping(event: any) {
    this.scrollDown();
  }

  changeFunction(ev: any) {}

  updateMessages() {

    let userBusinessId;
    let action;
    if(this.restService.comingFrom == 'event-detail'){
      if(this.detailObj.events){
        userBusinessId = this.detailObj.events?.users_business_id;
      }else{
        userBusinessId = this.detailObj.users_business_id;
      }
      // userBusinessId = this.detailObj.user_business_id;
      action = 'users_chat';
    }else if(this.restService.comingFrom == 'startChatWithAdmin'){
      userBusinessId = this.restService.adminId;
      action = 'user_chat_live';
    }else{
      userBusinessId = this.detailObj.users_business_id;
      action = 'user_chat';
    }

    // geting all chats Messages
    var data ={
      requestType: "updateMessages",
      users_customers_id: this.userID,
      other_users_customers_id: userBusinessId,
    };
    
    console.log("data-----", data);
    this.restService.sendRequest(action,data).subscribe(
      async (res: any) => {
        this.showSkeleton = false;
        console.log("updateMessage res", res);
        
        if (res.status == "success") {

          let unread_messages = res.data.unread_messages;

          if (unread_messages.length > 0) {
              for (let msg of unread_messages) {
                this.allMessages.push({
                  message: msg.message,
                  msgType: msg.msgType,
                  sender_type: msg.sender_type,
                });
              }
              this.scrollDown();
          }
          this.noChatlistFlag = false;
        } else {
          this.noChatlistFlag = true;
        }
      },
      (err) => {
        this.restService.presentToast("Network error occured");
      }
    );
  }

  getMessages() {
    console.log("logged in user", this.currentUser);
    // geting all chats Messages
    if(this.restService.comingFrom == 'event-detail'){ 
      let userBusinessId, eventsId;
      if(this.detailObj.events){
        userBusinessId = this.detailObj.events.users_business_id;
        eventsId = this.detailObj.events.events_id;
      }else{
        userBusinessId = this.detailObj.users_business_id;
        eventsId = this.detailObj.events_id;
      }

      var data = JSON.stringify({
        requestType: "getMessages",
        users_customers_id: this.userID,
        other_users_customers_id: userBusinessId,
        events_id: eventsId
      });
      console.log("payload get event msgs", data);
      this.restService.presentLoader();
      this.restService.event_chat(data).subscribe(
        
        async (res: any) => {
          this.restService.dismissLoader();
          this.showSkeleton = false;
          console.log("response", res);
  
          if (res.status == "success") {
            this.allMessages = res.data;
            this.scrollDown();
            // this.previousMsgsCount = res.data.length
            // console.log("receving All chats messages", this.allMessages);
            // this.allMessages.map((messages, index) => {
            //   if (messages.msgType == "attachment") {
            //     this.chatImagesArray.push({
            //       image: messages.message,
            //     });
            //   }
            // });
            // console.log("allMsg array ", this.chatImagesArray);
  
            this.noChatlistFlag = false;
          } else {
            this.noChatlistFlag = true;
          }
        },
        (err) => {
          this.restService.dismissLoader();
          this.restService.presentToast("Network error occured");
        }
      );
    }
    else if(this.restService.comingFrom == 'startChatWithAdmin'){
      var data = JSON.stringify({
        requestType:"getMessages",
        users_customers_id: this.userID,
        other_users_customers_id:this.restService.adminId
      });
      console.log("payload get admin msgs", data);
      this.restService.presentLoader();
      this.restService.admin_chat(data).subscribe(
        async (res: any) => {
          this.restService.dismissLoader();
          this.showSkeleton = false;
          console.log("response", res);
  
          if (res.status == "success") {
            this.allMessages = res.data;
            this.scrollDown();
            // this.previousMsgsCount = res.data.length
            // console.log("receving All chats messages", this.allMessages);
            // this.allMessages.map((messages, index) => {
            //   if (messages.msgType == "attachment") {
            //     this.chatImagesArray.push({
            //       image: messages.message,
            //     });
            //   }
            // });
            // console.log("allMsg array ", this.chatImagesArray);
  
            this.noChatlistFlag = false;
          } else {
            this.noChatlistFlag = true;
          }
        },
        (err) => {
          this.restService.dismissLoader();
          this.restService.presentToast("Network error occured");
        }
      );
    }
    else{
      var data = JSON.stringify({
        requestType: "getMessages",
        users_customers_id: this.userID,
        other_users_customers_id: this.detailObj.users_business_id,
        venues_id: this.detailObj.venues_id
      });
      console.log("payload get venue msgs-------", data);
      this.restService.presentLoader();
      this.restService.user_chat(data).subscribe(
        async (res: any) => {
          this.restService.dismissLoader();
          this.showSkeleton = false;
          console.log("response", res);
  
          if (res.status == "success") {
            this.allMessages = res.data;
            this.scrollDown();
            // this.previousMsgsCount = res.data.length
            // console.log("receving All chats messages", this.allMessages);
            // this.allMessages.map((messages, index) => {
            //   if (messages.msgType == "attachment") {
            //     this.chatImagesArray.push({
            //       image: messages.message,
            //     });
            //   }
            // });
            // console.log("allMsg array ", this.chatImagesArray);
  
            this.noChatlistFlag = false;
          } else {
            this.noChatlistFlag = true;
          }
        },
        (err) => {
          this.restService.dismissLoader();
          this.restService.presentToast("Network error occured");
        }
      );
    }
    


   
  }

  back() {
    this.location.back();
    clearInterval(this.autoSaveInterval);
  }

  sendMsg() {
    // console.log("remainong smssss---", this.remainingSMS);

      let msgToSend = this.user_input;
      this.user_input = "";
      if(msgToSend != ''){
        this.sendMessage( msgToSend );
      }
      
    // }
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  sendMessage( msg: any) {
   
    let userMessage = {
      message: msg,
      msgType: 'text',
      sender_type: 'Users',
    }
    this.allMessages.push(userMessage);
    this.scrollDown();

    if(this.restService.comingFrom == 'event-detail'){
      let userBusinessId;
      let eventsId;
      if(this.detailObj.events){
        userBusinessId = this.detailObj.events?.users_business_id;
        eventsId = this.detailObj.events?.events_id
      }else{
        userBusinessId = this.detailObj.users_business_id;
        eventsId = this.detailObj.events_id
      }
      var data = JSON.stringify({
        requestType:"sendMessage",
        events_id:eventsId,
        sender_type:"Users",
        messageType:"text",
        users_customers_id:this.userID,
        other_users_customers_id:userBusinessId,
        content:msg
      });
      console.log("my msg in events", data);
      this.restService.event_chat(data).subscribe(
        async (res: any) => {
          console.log("response", res);
        },
        (err) => {
          this.restService.presentToast("Network error occured");
        }
      );
    }
    else if(this.restService.comingFrom == 'startChatWithAdmin'){
      var data = JSON.stringify({
        requestType:"sendMessage",
        sender_type:"Users",
        messageType:"1",
        users_customers_id:this.userID,
        other_users_customers_id:this.restService.adminId,
        content:msg
      });
      console.log("my msg in admin chat", data);
      this.restService.admin_chat(data).subscribe(
        async (res: any) => {
          console.log("response", res);
          
        },
        (err) => {
          this.restService.presentToast("Network error occured");
        }
      );
    }
    else{
      var data = JSON.stringify({
        requestType: "sendMessage",
        venues_id: this.detailObj.venues_id,
        sender_type: "Users",
        messageType: "1",
        users_customers_id: this.userID,
        other_users_customers_id: this.detailObj.users_business_id,
        content: msg,
      });
      console.log("my msg", data);
      this.restService.user_chat(data).subscribe(
        async (res: any) => {
          console.log("response", res);
          
        },
        (err) => {
          this.restService.presentToast("Network error occured");
        }
      );
    }

    

    
  }

  handleImgError(ev: any, item: any, url: any) {
    let source = ev.srcElement;
    // let imgSrc = `assets/imgs/placeholder.jpg`;

    let imgSrc = `assets/imgs/placeholder.jpg`;

    source.src = imgSrc;
  }
}
