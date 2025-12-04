import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedPhotoFile?: File;
  constructor() { }

  ngOnInit(): void {
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
