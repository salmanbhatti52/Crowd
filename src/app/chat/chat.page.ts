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
  senderUserID: any;
  showSkeleton = true;
  noChatlistFlag = false;
  allMessages: any = [];
  currentUser: any;
  currentTime: string = "";
  user_input: string = "";
  chatImagesArray = [];
  private autoSaveInterval: any;
  userIMG: any;

  remainingSMS = 0;

  uu: any = "";
  user: any = "";
  selectedVenue: any = "";

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
    this.currentUser = localStorage.getItem("loggedinUserID");
    // this.currentUser = 15

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("Handler was called!");
    });
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  showPopup(val: any) {
    this.matchpopupHidden = false;
    console.log(val);
    this.popupSelectedVal = val;
  }

  hidePopup() {
    this.matchpopupHidden = true;
  }

  goToMemberShip() {
    this.hidePopup();
    this.router.navigate(["smspkg"]);
  }

  ionViewWillEnter() {
    this.selectedVenue = this.restService.detail;
    this.uu = localStorage.getItem("loggedinUserData");
    this.user = JSON.parse(this.uu);

    console.log("user daata -------", this.user);

    this.senderUserName = this.user.full_name;
    this.senderUserID = parseInt(this.user.users_customers_id);

    console.log("user daata -------", this.userIMG);

    // Get all  messages....
    this.getMessages(this.senderUserID);
    this.autoSaveInterval = setInterval(() => {
      this.updateMessages();
    }, 3000);
  }
  ionViewWillLeave() {
    clearInterval(this.autoSaveInterval);
    console.log("clear");
  }
  userTyping(event: any) {
    this.scrollDown();
  }

  changeFunction(ev: any) {}
  updateMessages() {
    // geting all chats Messages

    var data = JSON.stringify({
      // request_type: "getMessages",
      request_type: "getUnreadMessages",
      users_customers_id: localStorage.getItem("loggedinUserID"),
      // users_customers_id: 15,
      reciever_users_customers_id: "admin",
    });

    console.log("datttttttaaaaaaaaaaaa-----", data);

    this.restService.login(data).subscribe(
      async (res: any) => {
        this.showSkeleton = false;
        if (res.status == "success") {
          let unread_messages = res.data.chat_messages;
          // this.allMessages = res.data.chat_messages;
          let chatLength = res.data.chat_messages;
          console.log("receving All chats unread messages", unread_messages);
          if (unread_messages.length > 0) {
            if (chatLength != unread_messages.length) {
              for (var i = 0; i < unread_messages.length; i++) {
                this.allMessages.push({
                  userId: unread_messages[i].userId,
                  time: unread_messages[i].time,
                  message: unread_messages[i].message,
                  msgType: unread_messages[i].msgType,
                });
              }
              this.scrollDown();
            }
          }
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
  getMessages(senderUserID: any) {
    console.log("logged in user", this.currentUser);
    // geting all chats Messages

    var data = JSON.stringify({
      request_type: "getMessages",
      users_customers_id: localStorage.getItem("loggedinUserID"),
      // users_customers_id: 15,
      reciever_users_customers_id: "admin",
    });

    console.log("getAll Msg data-------", data);

    this.restService.login(data).subscribe(
      async (res: any) => {
        this.showSkeleton = false;
        console.log("response", res);

        if (res.status == "success") {
          this.allMessages = res.data.chat_messages;

          console.log("receving All chats messages", this.allMessages);
          // this.allMessages.map((messages, index) => {
          //   if (messages.msgType == "attachment") {
          //     this.chatImagesArray.push({
          //       image: messages.message,
          //     });
          //   }
          // });
          console.log("allMsg array ", this.chatImagesArray);
          this.scrollDown();

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

  back() {
    this.location.back();
    clearInterval(this.autoSaveInterval);
  }
  sendMsg() {
    console.log("remainong smssss---", this.remainingSMS);

    var time = new Date();
    this.currentTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    console.log(this.currentTime, "curent");
    if (this.user_input !== "") {
      this.allMessages.push({
        userId: this.currentUser,
        time: this.currentTime,
        message: this.user_input,
        msgType: "text",
      });

      let msgToSend = this.user_input;
      this.user_input = "";
      this.scrollDown();
      this.sendMessage(parseInt(this.senderUserID), msgToSend, "text");
    }
  }
  scrollDown() {
    this.content.scrollToBottom();
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
  sendMessage(senderUserID: any, msg: any, type: any) {
    // this.remainingSMS = this.remainingSMS - 1
    // localStorage.setItem('remainingSMS', this.remainingSMS.toString())

    var data = JSON.stringify({
      request_type: "sendMessage",
      sender_users_customers_id: localStorage.getItem("loggedinUserID"),
      // sender_users_customers_id: 15,
      reciever_users_customers_id: "admin",
      msgType: type,
      chatMsg: msg,
    });

    console.log("my msg", data);

    this.restService.login(data).subscribe(
      async (res: any) => {
        console.log("response", res);
        this.scrollDown();
      },
      (err) => {
        this.restService.dismissLoader();
        this.restService.presentToast("Network error occured");
      }
    );
  }

  handleImgError(ev: any, item: any, url: any) {
    let source = ev.srcElement;
    // let imgSrc = `assets/imgs/placeholder.jpg`;

    let imgSrc = `assets/imgs/placeholder.jpg`;

    source.src = imgSrc;
  }
}
