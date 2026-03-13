import { Component, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { LoginData } from '../login/login-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RpgRoutes } from '../rpg-routes';

@Component({
  selector: 'app-new-account',
  imports: [FormField],
  templateUrl: './new-account.html',
  styleUrl: './new-account.css',
})
export class NewAccount {
  private readonly _newUserData = signal<LoginData>({
    email: '',
    password: ''
  });

  public readonly newUserForm = form(this._newUserData, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    const passwordLength = 'Password must be between 8 and 72 characters';
    maxLength(schemaPath.password, 72, { message: passwordLength });
    minLength(schemaPath.password, 8, { message: passwordLength });
    // TODO: if I ever want to use this for real, need stronger password requirements.
    // e.g. special characters at a minimum
  });

  public showErrorCreatingUser = signal(false);

  public constructor(private _httpClient: HttpClient, private _router: Router) { }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    // TODO: there probably needs to be max retry logic.
    // The server would need to be the source of truth for that.
    this._httpClient.post('/users/create', {
      email_address: this._newUserData().email,
      password: this._newUserData().password
    }).subscribe({
      next: () => this._router.navigateByUrl(RpgRoutes.login),
      error: () => this.showErrorCreatingUser.set(true)
    })
  }
}
