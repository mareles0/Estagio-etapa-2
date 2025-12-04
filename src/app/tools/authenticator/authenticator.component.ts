import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  State= AuthenticatorCompState.LOGIN;
  auth = new FirebaseTSAuth();
  constructor(private bottomSheet: MatBottomSheet, private router: Router){
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onResetClick( resetEmail: HTMLInputElement ){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.auth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (err) =>{
            this.bottomSheet.dismiss();
          },
        }
      );
    }
  }




  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ){
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) && this.isNotEmpty(password)){
      this.auth.signInWith({
        email: email,
        password: password,
        onComplete: (uc) =>{
          this.bottomSheet.dismiss();
          
          if(this.auth.isSignedIn() && !this.auth.getAuth().currentUser?.emailVerified){
            this.router.navigate(["email-verification"]);
          }
        },
        onFail: (err) =>{
          alert(err);
        }
  }
);
    }
  }


  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;


      if(
        this.isNotEmpty(email) &&
        this.isNotEmpty(password) &&
        this.isNotEmpty(confirmPassword) &&
        this.isAMatch(password, confirmPassword)
      ){

    this.auth.createAccountWith({
      email: email,
      password: password,
      onComplete: (uc) => {
        alert("Account created!");
        this.bottomSheet.dismiss();
    },
      onFail: (err) => {
        alert("failed to create account: " );
      }
    }
  );
  }
}

  isNotEmpty(text: string){
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string){
    return text == comparedWith;
  }


  onForgotPasswordClick(){
      this.State = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick(){
      this.State = AuthenticatorCompState.CREATE_ACCOUNT;
  }

  onLoginClick(){
      this.State = AuthenticatorCompState.LOGIN;
  }

  isLoginState(){
      return this.State == AuthenticatorCompState.LOGIN;
  }

  isCreateAccountState(){
      return this.State == AuthenticatorCompState.CREATE_ACCOUNT;
  }
  
  isForgotPasswordState(){
      return this.State == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText(){
    switch(this.State){
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.CREATE_ACCOUNT:
        return "Create Account";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Reset Password";
    }
  }
}

  export enum AuthenticatorCompState{
    LOGIN,
    FORGOT_PASSWORD,
    CREATE_ACCOUNT
  }


