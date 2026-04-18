import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100): string {
    if (!value) {
      return '';
    }

    const normalizedValue = value.replace(/\s+/g, ' ').trim();

    if (normalizedValue.length <= limit) {
      return normalizedValue;
    }

    return `${normalizedValue.slice(0, limit).trim()}...`;
  }
}
