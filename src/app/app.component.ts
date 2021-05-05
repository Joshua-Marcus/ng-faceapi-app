import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'faceApi';
  video = document.getElementById("video");

  constructor() {}
  startVideo() {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (this.video.srcObject = stream),
      (err) => console.error(err)
    );
  }
}
