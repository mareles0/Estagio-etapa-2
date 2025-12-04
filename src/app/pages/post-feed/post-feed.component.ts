import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
  }

  ggetPosts(){
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(10)
        ],
      }
    )
  }

}
