import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, OrderBy, Limit } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { ReplyComponent } from 'src/app/tools/reply/reply.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  private firestore = new FirebaseTSFirestore();
  private auth = new FirebaseTSAuth();
  posts: PostData[] = [];
  postData: any;
  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    // Verificar se está logado
    if(!this.auth.isSignedIn()) {
      this.router.navigate(['']);
      return;
    }
    
    // Ouvir mudanças no estado de autenticação
    this.auth.listenToSignInStateChanges(
      user => {
        if(!user) {
          this.router.navigate(['']);
        }
      }
    );
    
    this.getPosts();
  }

  onReplyClick(){
    this.dialog.open(ReplyComponent, {data: this.postData.postId});
  }

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
  }

  getPosts(){
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(10)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data();
              post.postId = doc.id; // Adicionar o ID do documento
              this.posts.push(post);
            }
          )
        },
        onFail: (err) => {
          console.error("Failed to get posts:", err);
        }
      }
    )
  }

}

export interface PostData{
  comment: string;
  creatorId: string;
  imageUrl: string;
  postId: string;
}
