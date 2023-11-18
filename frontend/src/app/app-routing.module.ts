import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { MatchingComponent } from './matching/matching.component';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { CollabComponent } from './collab/collab.component';
import { PageNotFoundComponentComponent } from './shared/page-not-found-component/page-not-found-component.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'question-creation', component: UserComponent, canActivate: [AuthGuard, RoleGuard]  },
  { path: 'match', component: MatchingComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard]},
  { path: 'collab', component: CollabComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
