import { Component, OnChanges, Input, SimpleChange } from '@angular/core';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'password-validation',
  styles: [`
    #strength {
      margin-top: 5px;
    }

    .strengthBar {
      display: inline;
      list-style: none;
      margin: 0;
      padding: 0;
      vertical-align: 2px;
    }

    .strengthBar .point {
      background: #DDD;
      border-radius: 2px;
      display: inline-block;
      height: 5px;
      margin-right: 1px;
      width: 20px;
    }

    .strengthBar .point:last-child {
      margin: 0;
    }
    .pre {
      white-space: pre;
    }
    .green {
      color: green !important;
    }
    .ng-link {
      cursor: pointer;
      color: blue;
    }
  `],
  template: `
    <div id="strength" #strength>
      <ul id="strengthBar" class="strengthBar">
        <li id="bar0" class="point" [style.background-color]="bar0"></li>
        <li class="point" [style.background-color]="bar1"></li>
        <li class="point" [style.background-color]="bar2"></li>
        <li class="point" [style.background-color]="bar3"></li>
        <li class="point" [style.background-color]="bar4"></li>
      </ul>
      <small [hidden]="!strengths" class="pre">  {{strengthLabel}}</small>
      <br />
      <small [class.green]="min8">- Minimum of 8 characters</small>
      <br />
      <small [class.green]="atLeastAverage">- At least average strength</small>
      <br />
      <small *ngIf="!showHints && hints" class="ng-link" (click)="showHints=true">Need some hints?</small>
      <small *ngIf="showHints && hints" class="pre">{{hints}}</small>
    </div>
  `
})
export class PasswordValidationComponent implements OnChanges {
  @Input() passwordToCheck: string;
  @Input() barColors: Array<string>;
  @Input() baseColor: string;
  @Input() strengthLabels: Array<string>;

  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;
  strengthLabel: string;
  strengths: Array<string>;
  //variables for password help
  min8: boolean;
  atLeastAverage: boolean;
  showHints: boolean;
  hints: string;
  //

  private colors: Array<string>;
  private defaultColors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
  private defaultBaseColor: string = '#DDD';

  constructor() {
    this.colors = this.defaultColors;
  }

  private checkBarColors(): void {
    // Accept custom colors if input is valid, otherwise the default colors will be used
    if (this.barColors && this.barColors.length === 5) {
      this.colors = this.barColors.slice();
    } else {
      this.colors = this.defaultColors;
    }

    this.strengths = this.strengthLabels && this.strengthLabels.length === 5 ? this.strengthLabels.slice() : null;
    this.setStrengthLabel(0);

    if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.baseColor)) {
      this.baseColor = this.defaultBaseColor;
    }
  }

  getStrength(password: string) {
    return zxcvbn(password);
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.checkBarColors();
    this.setBarColors(5, this.baseColor);
    if (password && password != '') {
      let results =  this.getStrength(password);
      this.min8 = password.length >= 8;
      this.atLeastAverage = results.score >= 2;
      this.setStrengthLabel(results.score);
      this.setBarColors(results.score, this.colors[results.score]);
      this.hints = results.feedback.suggestions.join(" ");
    } else {
      this.strengthLabel = '';
      this.hints = '';
      this.showHints = false;
    }
  }

  private setBarColors(count: number, col: string) {
    for (let _n = 0; _n < count + 1; _n++) {
      this['bar' + _n] = col;
    }
  }
  private setStrengthLabel(index: number) {
    if (this.strengths) {
      this.strengthLabel = this.strengths[index];
    }
  }
}
