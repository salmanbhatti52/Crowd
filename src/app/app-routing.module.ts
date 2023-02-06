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
  },  {
    path: 'select-venue-popup',
    loadChildren: () => import('./select-venue-popup/select-venue-popup.module').then( m => m.SelectVenuePopupPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
