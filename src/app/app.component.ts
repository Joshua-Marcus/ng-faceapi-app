import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const faceapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'faceApi';
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  message: string;

  constructor() {}

  async ngOnInit() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("assets/models"),
    ]);
    this.startVideo();
  }

  runDetection() {
    const canvas = faceapi.createCanvasFromMedia(this.video.nativeElement);
    document.body.append(canvas);
    const displaySize = { width: this.video.nativeElement.width, height: this.video.nativeElement.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      detections.map((detection) => {
        if (detection.expressions.sad > 0.5) {
          this.message = "Emotion: Sad";
        } else if (detection.expressions.happy > 0.5) {
          this.message = "Emotion: Happy";

        } else if (detection.expressions.surprised > 0.5) {
          this.message = "Emotion: Surprised";

        } else if (detection.expressions.disgusted > 0.5) {
          this.message = "Emotion: Disgusted";
        } else if (detection.expressions.fearful > 0.5) {
          this.message = "Emotion: Fearful";
        } else if (detection.expressions.angry > 0.5) {
          this.message = "Emotion: Happy";
        } else {
          this.message = "Emotion: Neutral";
        }
      });
    }, 500);
  }

  startVideo() {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (this.video.nativeElement.srcObject = stream),
      (err) => console.error(err)
    );
    setTimeout(() => {
      console.log('Waiting')
      this.runDetection();
    }, 2500)
  }
}
