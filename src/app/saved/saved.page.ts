import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-saved",
  templateUrl: "./saved.page.html",
  styleUrls: ["./saved.page.scss"],
})
export class SavedPage implements OnInit {
  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}

  segmentModel = "venu";
  venuarr = [
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
  ];

  eventarr = [
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
    },
    {
      name: "BarBQ",
      name2: "venue Name",
      opentime: "1 PM",
      location: "Pancreae Rd, London N1C 4TB",
      lat: "12123.3",
      long: "12122.1",
      web: "www.google.com",
      phone: "020221212",
      checkedinpeople: "",
      googleRating: "",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.",
      distance: "1.2",
      off: "30%",
      img: "https://images.ctfassets.net/86mn0qn5b7d0/featured-img-of-post-152543/436cf88c49f85eb46d1ab04748cbf8e6/featured-img-of-post-152543.jpg",
      detailimg: [
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
        {
          img: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=170667a&w=0&k=20&c=fx-caeGfzahlZarBeZ_3Jl43xO85t2cs3dmIS4b4FL0=",
        },
      ],
      like: 0,
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

  goToDetail(opt: any) {
    console.log(opt);
    this.rest.detail = opt;
    this.router.navigate(["venuedetail"]);
  }

  goToDetailevent(opt: any) {
    console.log(opt);
    this.rest.detail = opt;
    this.router.navigate(["eventdetail"]);
  }
}
