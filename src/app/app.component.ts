import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'social-media';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  userDocument: userDocument = { publicName: '', description: '' };

  constructor(private loginSheet: MatBottomSheet, private router: Router){ 
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
          whenSignedIn: user => {
            
          },
          whenSignedOut: user => {
           
          },
          whenSignedInAndEmailNotVerified: user => {
            this.router.navigate(["email-verification"]);
          },
          whenSignedInAndEmailVerified: user => {
            this.getUserProfile();
          },
          whenChanged: user => {

          }
        }
      );
     }
    );
  }

  getUserProfile(){
    this.firestore.listenToDocument(
      {
        name: "getting user profile",
        path: ["Users", this.auth.getAuth().currentUser?.uid || ""],
        onUpdate:  (result) => {
          this.userDocument = <userDocument>result.data();          
          this.userHasProfile = result.exists;
          if(this.userHasProfile){
            this.router.navigate(["postfeed"]);
          }
        }
      }
    )
  }

   onLogoutClick(){
    this.auth.signOut();
   }

   LoggedIn(){
    return this.auth.isSignedIn();
   }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface userDocument {
  publicName: string;
  description: string;
}