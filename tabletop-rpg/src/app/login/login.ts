import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { LoginData } from './login-data';
import { Router } from '@angular/router';
import { RpgRoutes } from '../rpg-routes';

/**
 * Since I never had time to properly dig into forms anyways,
 * figured it made sense to try the upcoming signal forms. They feel pretty slick.
 * https://angular.dev/essentials/signal-forms
 */
@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly _loginModel = signal<LoginData>({
    email: '',
    password: ''
  });
  public readonly loginForm = form(this._loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });
  
  public constructor(private _httpClient: HttpClient, private _router: Router) { }

  // TODO: there probably needs to be max retry logic.
  // The server would need to be the source of truth for that.
  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this._httpClient.post('/session', {
      email_address: this._loginModel().email,
      password: this._loginModel().password
    }).subscribe({
      next: () => this._router.navigateByUrl(RpgRoutes.board),
      error: () => console.log('TODO')
    });
  }

  public routeToNewAccount(): void {
    this._router.navigateByUrl(RpgRoutes.newAccount);
  }
}
