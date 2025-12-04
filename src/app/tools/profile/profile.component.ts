import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean = false;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
   }

  ngOnInit(): void {
  }

  onContinueClick(nameInput: HTMLInputElement, descriptionInput: HTMLTextAreaElement) {
    let name = nameInput.value;
    let description = descriptionInput.value;
    const currentUser = this.auth.getAuth().currentUser;
    if (!currentUser) {
      alert("User is not authenticated");
      return;
    }
    this.firestore.create(
      {
        path:["Users", currentUser.uid],
        data:{
          publicName: name,
          description: description

        },
        onComplete: (docId) => {
          alert("Profile created");
          nameInput.value = "";
          descriptionInput.value = "";
        },
        onFail: (err) => {

        }
      }
    )
  }
}
