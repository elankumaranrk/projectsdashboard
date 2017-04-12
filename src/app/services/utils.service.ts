import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  public getBrowserVendor = () => {
    const UA: string = navigator.userAgent;
    let vendor: string;

    if ((UA.indexOf('Opera') || UA.indexOf('OPR')) != -1 ) {
      vendor = 'Opera';
    } else if (UA.indexOf('Chrome') != -1 ) {
      vendor = 'Chrome';
    } else if (UA.indexOf('Safari') != -1) {
      vendor = 'Safari';
    } else if (UA.indexOf('Firefox') != -1 ) {
      vendor = 'Firefox';
    } else if (UA.indexOf('MSIE') != -1 ) {
      vendor = 'IE';
    } else {
      vendor = 'Unknown';
    }

    return vendor;
  }

  public modulo = (a, b) => {
    return (+a % (b = +b) + b) % b;
  }

  public hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

}

