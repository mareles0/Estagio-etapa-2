import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  comments: userDocument[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private postId: string) { }

  ngOnInit(): void {
    this.getComments();
  }


  isCommentCreator(comment: userDocument): boolean {
    try{
      return comment.creatorId === AppComponent.getUserDocument()?.userId;
    } catch(err){
      return false;
    }
  }

   getComments(){
    this.firestore.listenToCollection({
      name: "Post comments",
      path: ["Posts", this.postId, "PostComments"],
      where: [new OrderBy("timestamp", "asc")],
      onUpdate: (result) => {
        result.docChanges().forEach(
          postCommentDoc =>{
            if(postCommentDoc.type === "added"){
              this.comments.push(<userDocument>postCommentDoc.doc.data());
            }

          }
        );
    }
  });
}



  onSendClick(commentInput: HTMLInputElement){
    if(!(commentInput.value.length > 0)) return;
    
    const userDoc = AppComponent.getUserDocument();
    if(!userDoc) return;
    
    this.firestore.create({
      path: ["Posts", this.postId, "PostComments"],
      data:{
        comment: commentInput.value,
        creatorId: userDoc.userId,
        creatorName: userDoc.publicName,
        timestamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete: (docId) => {
        commentInput.value = "";
      },
      onFail: (err) => {
        alert("Failed to create comment: " + err);
      }
    })
  }

}

export interface userDocument {
  creatorId: string;
  creatorName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}
