import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedPhotoFile?: File;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore()
  storage = new FirebaseTSStorage();
  constructor(private dialogRef: MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }

  onPostClick(commentinput: HTMLTextAreaElement){
    let comment = commentinput.value;
    if(comment.length <= 0) return;
    if(this.selectedPhotoFile){
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }
  }

  uploadImagePost(comment: string) {
    let postId = this.firestore.genDocId();
    this.storage.upload({
      uploadName: "Uploading post image",
      path: ["Posts", postId, "image"],
      data:
    {
      data: this.selectedPhotoFile
    },
    onComplete: (downloadUrl) => {
      this.firestore.create(
        {
          path: ["Posts", postId],
          data: {
            comment: comment,
            imageUrl: downloadUrl,
            creatorId: this.auth.getAuth().currentUser?.uid,
            timestamp: FirebaseTSApp.getFirestoreTimestamp()
          },
          onComplete: (docId) => {
            this.dialogRef.close();
          }
    })
    }
  });
  }
      
  uploadPost(comment: string) {
    this.firestore.create(
        {
          path: ["Posts"],
          data: {
            comment: comment,
            creatorId: this.auth.getAuth().currentUser?.uid,
            timestamp: FirebaseTSApp.getFirestoreTimestamp()
          },
          onComplete: (docId) => {
            this.dialogRef.close();
          }
    })
    }
  

  onPhotoSelected(photoSelector: HTMLInputElement){
    if(!photoSelector.files || photoSelector.files.length === 0) return;
    this.selectedPhotoFile = photoSelector.files[0];
    let fileReader = new FileReader();
    fileReader.addEventListener(
      "loadend",
      (ev) => {
        if(!fileReader.result) return;
        let readableString = fileReader.result.toString();
        let postPreviewImage = document.getElementById("post-preview-imagem") as HTMLImageElement;
        if(postPreviewImage) {
          postPreviewImage.src = readableString;
        }
      }
    );
    fileReader.readAsDataURL(this.selectedPhotoFile);
  }


}
