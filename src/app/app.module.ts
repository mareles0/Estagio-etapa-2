import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { environment } from 'src/environments/environment';

import {MatButtonModule} from '@angular/material/button';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatIconModule} from '@angular/material/icon';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './page/home/home.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { ProfileComponent } from './tools/profile/profile.component';
import { MatDialogModule} from '@angular/material/dialog';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { CreatePostComponent } from './tools/create-post/create-post.component';

 
@NgModule({
  declarations: [
    AppComponent,
    AuthenticatorComponent,
    HomeComponent,
    EmailVerificationComponent,
    ProfileComponent,
    PostFeedComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    FirebaseTSApp.init(environment.firebaseConfig);
  }
 }
