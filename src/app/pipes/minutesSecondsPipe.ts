import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const hours = Math.floor((value/60));
    const minutes: number = (value % 60);
    return hours + 'h ' + minutes + 'm';
  }
}