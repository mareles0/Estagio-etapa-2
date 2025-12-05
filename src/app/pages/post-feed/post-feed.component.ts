import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, OrderBy, Limit } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { ReplyComponent } from 'src/app/tools/reply/reply.component';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  private firestore = new FirebaseTSFirestore();
  posts: PostData[] = [];
  postData: any;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
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
