import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-saved",
  templateUrl: "./saved.page.html",
  styleUrls: ["./saved.page.scss"],
})
export class SavedPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  segmentModel = "venu";
  venuarr = [
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 0,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "BarBQ",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
  ];

  eventarr = [
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
    {
      name: "Event Name",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      like: 1,
    },
  ];

  tab1Click() {
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.router.navigate(["noti"]);
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }
  segmentChanged(event: any) {
    console.log(this.segmentModel);

    console.log(event);
  }
}
