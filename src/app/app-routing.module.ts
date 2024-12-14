import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    // redirectTo: "start",
    redirectTo: "splashvideo",
    pathMatch: "full",
  },
  {
    path: "start",
    loadChildren: () =>
      import("./start/start.module").then((m) => m.StartPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then((m) => m.SignupPageModule),
  },
  {
    path: "newpass",
    loadChildren: () =>
      import("./newpass/newpass.module").then((m) => m.NewpassPageModule),
  },
  {
    path: "forgetpass",
    loadChildren: () =>
      import("./forgetpass/forgetpass.module").then(
        (m) => m.ForgetpassPageModule
      ),
  },
  {
    path: "getstart",
    loadChildren: () =>
      import("./getstart/getstart.module").then((m) => m.GetstartPageModule),
  },
  {
    path: "otp",
    loadChildren: () => import("./otp/otp.module").then((m) => m.OtpPageModule),
  },
  {
    path: "locationmap",
    loadChildren: () =>
      import("./locationmap/locationmap.module").then(
        (m) => m.LocationmapPageModule
      ),
  },
  {
    path: "saved",
    loadChildren: () =>
      import("./saved/saved.module").then((m) => m.SavedPageModule),
  },
  {
    path: "noti",
    loadChildren: () =>
      import("./noti/noti.module").then((m) => m.NotiPageModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    path: "changepass",
    loadChildren: () =>
      import("./changepass/changepass.module").then(
        (m) => m.ChangepassPageModule
      ),
  },
  {
    path: "eventdetail",
    loadChildren: () =>
      import("./eventdetail/eventdetail.module").then(
        (m) => m.EventdetailPageModule
      ),
  },
  {
    path: "venuedetail",
    loadChildren: () =>
      import("./venuedetail/venuedetail.module").then(
        (m) => m.VenuedetailPageModule
      ),
  },
  {
    path: "deletact",
    loadChildren: () =>
      import("./deletact/deletact.module").then((m) => m.DeletactPageModule),
  },
  {
    path: "splashvideo",
    loadChildren: () =>
      import("./splashvideo/splashvideo.module").then(
        (m) => m.SplashvideoPageModule
      ),
  },
  {
    path: 'pininfo',
    loadChildren: () => import('./pininfo/pininfo.module').then( m => m.PininfoPageModule)
  },
  {
    path: 'select-venue-popup',
    loadChildren: () => import('./select-venue-popup/select-venue-popup.module').then( m => m.SelectVenuePopupPageModule)
  },
  {
    path: 'beseen',
    loadChildren: () => import('./beseen/beseen.module').then( m => m.BeseenPageModule)
  },
  {
    path: 'seepeople',
    loadChildren: () => import('./seepeople/seepeople.module').then( m => m.SeepeoplePageModule)
  },
  {
    path: 'booking1',
    loadChildren: () => import('./booking1/booking1.module').then( m => m.Booking1PageModule)
  },
  {
    path: 'booking2',
    loadChildren: () => import('./booking2/booking2.module').then( m => m.Booking2PageModule)
  },
  {
    path: 'cancelbook',
    loadChildren: () => import('./cancelbook/cancelbook.module').then( m => m.CancelbookPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'myreservations',
    loadChildren: () => import('./myreservations/myreservations.module').then( m => m.MyreservationsPageModule)
  },
  {
    path: 'seepeopleevent',
    loadChildren: () => import('./seepeopleevent/seepeopleevent.module').then( m => m.SeepeopleeventPageModule)
  },
  {
    path: 'loginevent',
    loadChildren: () => import('./loginevent/loginevent.module').then( m => m.LogineventPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
  },
  {
    path: 'booking1event',
    loadChildren: () => import('./booking1event/booking1event.module').then( m => m.Booking1eventPageModule)
  },
  {
    path: 'booking2event',
    loadChildren: () => import('./booking2event/booking2event.module').then( m => m.Booking2eventPageModule)
  },
  {
    path: 'booking3event',
    loadChildren: () => import('./booking3event/booking3event.module').then( m => m.Booking3eventPageModule)
  },
  {
    path: 'paymentmethod',
    loadChildren: () => import('./paymentmethod/paymentmethod.module').then( m => m.PaymentmethodPageModule)
  },
  {
    path: 'addcard',
    loadChildren: () => import('./addcard/addcard.module').then( m => m.AddcardPageModule)
  },
  {
    path: 'paymentsuccess',
    loadChildren: () => import('./paymentsuccess/paymentsuccess.module').then( m => m.PaymentsuccessPageModule)
  },
  {
    path: 'cancel-reservation',
    loadChildren: () => import('./cancel-reservation/cancel-reservation.module').then( m => m.CancelReservationPageModule)
  },
  {
    path: 'editbooking',
    loadChildren: () => import('./editbooking/editbooking.module').then( m => m.EditbookingPageModule)
  },
  {
    path: 'scan-tickets',
    loadChildren: () => import('./scan-tickets/scan-tickets.module').then( m => m.ScanTicketsPageModule)
  },
  {
    path: 'ticket-detail',
    loadChildren: () => import('./ticket-detail/ticket-detail.module').then( m => m.TicketDetailPageModule)
  },
  {
    path: 'scanned-tickets',
    loadChildren: () => import('./scanned-tickets/scanned-tickets.module').then( m => m.ScannedTicketsPageModule)
  },
  {
    path: 'organizer-events',
    loadChildren: () => import('./organizer-events/organizer-events.module').then( m => m.OrganizerEventsPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then( m => m.TicketPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then( m => m.PaymentMethodsPageModule)
  },
  {
    path: 'event-detail',
    loadChildren: () => import('./event-detail/event-detail.module').then( m => m.EventDetailPageModule)
  },
  {
    path: 'my-events',
    loadChildren: () => import('./my-events/my-events.module').then( m => m.MyEventsPageModule)
  },
  {
    path: 'my-refunds',
    loadChildren: () => import('./my-refunds/my-refunds.module').then( m => m.MyRefundsPageModule)
  },
  {
    path: 'test-nearby-search',
    loadChildren: () => import('./test-nearby-search/test-nearby-search.module').then( m => m.TestNearbySearchPageModule)
  },
  {
    path: 'eventchat',
    loadChildren: () => import('./eventchat/eventchat.module').then( m => m.EventchatPageModule)
  },
  {
    path: 'request-refund',
    loadChildren: () => import('./request-refund/request-refund.module').then( m => m.RequestRefundPageModule)
  },
  {
    path: 'show-tickets',
    loadChildren: () => import('./show-tickets/show-tickets.module').then( m => m.ShowTicketsPageModule)
  },
  {
    path: 'see-path',
    loadChildren: () => import('./see-path/see-path.module').then( m => m.SeePathPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'discounts',
    loadChildren: () => import('./discounts/discounts.module').then( m => m.DiscountsPageModule)
  },
  {
    path: 'add-review',
    loadChildren: () => import('./add-review/add-review.module').then( m => m.AddReviewPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'ai-model',
    loadChildren: () => import('./ai-model/ai-model.module').then( m => m.AiModelPageModule)
  },
  {
    path: 'booking-detail',
    loadChildren: () => import('./booking-detail/booking-detail.module').then( m => m.BookingDetailPageModule)
  },
  {
    path: 'weather-detail',
    loadChildren: () => import('./weather-detail/weather-detail.module').then( m => m.WeatherDetailPageModule)
  },
  {
    path: 'my-reviews',
    loadChildren: () => import('./my-reviews/my-reviews.module').then( m => m.MyReviewsPageModule)
  },
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
