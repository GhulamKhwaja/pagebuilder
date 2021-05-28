import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RouterModule,
  Routes,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { DndModule } from 'ngx-drag-drop';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ShowPageComponent } from './show-page/show-page.component';
import { ServiceService } from './service.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PlanningModule } from './planning/planning.module';
import { PlanningLayoutComponent } from './layouts/planning-layout/planning-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationLayoutComponent } from './layouts/configuration-layout/configuration-layout.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 60,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};
// const appRoutes: Routes = [
//   { path: '', component: AppComponent },
//   { path: 'createPage', component: EditAppComponent },
//   { path: 'showPage', component: ShowPageComponent },
// ];

@NgModule({
  declarations: [
    AppComponent,
    EditAppComponent,
    ShowPageComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    PlanningLayoutComponent,
    ConfigurationLayoutComponent,
  ],
  imports: [
    AppRoutingModule,
    PlanningModule,
    SweetAlert2Module.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DndModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  providers: [ServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
