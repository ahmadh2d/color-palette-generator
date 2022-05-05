import { Component, HostListener, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { DisplayColor as DisplayColors } from './models/display-color';
import { RequestColormindColors } from './models/request-colormind-colors';
import { ResponseColormindColors } from './models/response-colormind-colors';
import { ColormindService } from './services/colormind.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Random Color Pallette Generator';
  displayColors: DisplayColors;
  copyAlert: string;
  timeout: any;

  constructor(private colormindService: ColormindService,
    private _clipboardService: ClipboardService) {
    this.displayColors = new DisplayColors();
    this.copyAlert = '';
  }

  ngOnInit() {
    this.getColorsFromColormindApi();
  }

  getColorsFromColormindApi() {
    const requestColormind = new RequestColormindColors();

    this.colormindService
      .getColors(requestColormind)
      .subscribe((data: ResponseColormindColors) => {
        this.displayColors.rgbColors = data.result;
        this.displayColors.hexColors = this.displayColors.rgbColors.map(
          (color) => this.rgbToHex(color[0], color[1], color[2])
        );
        console.log(this.displayColors);
      });
  }

  rgbToHex(r: number, g: number, b: number) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  generatePalette() {
    this.getColorsFromColormindApi();
  }

  colorCopied(color: any) {
    this.copyAlert = `Color ${color.content} copied to your clipboard`;
    this.putTimeoutForAlert();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.code === 'KeyC') {
      if (this.displayColors?.hexColors) {
        this._clipboardService.copy(this.displayColors.hexColors.join(', '));
        this.copyAlert = 'Colors copied to your clipboard';
        this.putTimeoutForAlert();
      }
    }
    if (event.code === 'Space')
      this.generatePalette();
  }

  private putTimeoutForAlert() {
    if (this.timeout)
      clearTimeout(this.timeout);
      
    this.timeout = setTimeout(() => {
      this.copyAlert = '';
    }, 3000);
  }
}
