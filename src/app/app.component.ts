import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public account = {
    password: <string>null
  };
  public baseColor = '#FFF';
  public strengthLabels = ['', '(Weak)', '(Average)', '(Strong)', '(Very Strong)'];
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
}
