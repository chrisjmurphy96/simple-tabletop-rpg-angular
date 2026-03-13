import { Routes } from '@angular/router';
import { Board } from './board/board';
import { Login } from './login/login';
import { NewAccount } from './new-user/new-account';
import { RpgRoutes } from './rpg-routes';

export const routes: Routes = [{
    path: RpgRoutes.login,
    component: Login
}, {
    path: RpgRoutes.newAccount,
    component: NewAccount
}, {
    path: RpgRoutes.board,
    component: Board
}];
