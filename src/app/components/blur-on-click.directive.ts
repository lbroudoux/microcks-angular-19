import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  standalone: true,
  selector: '[blurOnClick]'
})
export class BlurOnClickDirective {
  constructor(private el: ElementRef) { }

  @HostListener('click')
  onClick(): void {
    console.log('BlurOnClickDirective.onClick()');
    this.el.nativeElement.blur();

    console.log('Active element: ' + document.activeElement);
    if (document.activeElement) {
      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();
    }
  }
}