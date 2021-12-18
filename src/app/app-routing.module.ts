import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// myrmidon
import { AuthJwtGuardService } from '@myrmidon/auth-jwt-login';

// libraries in this workspace
import { EditorGuardService } from 'projects/myrmidon/cadmus-api/src/public-api';
import { PendingChangesGuard } from 'projects/myrmidon/cadmus-core/src/public-api';

// locals
import { HomeComponent } from './home/home.component';
import { ManageUsersPageComponent } from './manage-users-page/manage-users-page.component';
import { RegisterUserPageComponent } from './register-user-page/register-user-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // auth
  { path: 'login', component: LoginPageComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register-user', component: RegisterUserPageComponent },
  { path: 'manage-users', component: ManageUsersPageComponent },
  // cadmus
  {
    path: 'demo/layers',
    loadChildren: () =>
      import('@myrmidon/cadmus-layer-demo').then(
        (module) => module.CadmusLayerDemoModule
      ),
  },
  // cadmus - items
  {
    path: 'items',
    loadChildren: () =>
      import('@myrmidon/cadmus-item-list').then(
        (module) => module.CadmusItemListModule
      ),
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'items/:id',
    loadChildren: () =>
      import('@myrmidon/cadmus-item-editor').then(
        (module) => module.CadmusItemEditorModule
      ),
    canActivate: [AuthJwtGuardService],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'search',
    loadChildren: () =>
      import('@myrmidon/cadmus-item-search').then(
        (module) => module.CadmusItemSearchModule
      ),
    canActivate: [AuthJwtGuardService],
  },
  // cadmus - thesauri
  {
    path: 'thesauri',
    loadChildren: () =>
      import('@myrmidon/cadmus-thesaurus-list').then(
        (module) => module.CadmusThesaurusListModule
      ),
    canActivate: [EditorGuardService],
  },
  {
    path: 'thesauri/:id',
    loadChildren: () =>
      import('@myrmidon/cadmus-thesaurus-editor').then(
        (module) => module.CadmusThesaurusEditorModule
      ),
    canActivate: [EditorGuardService],
  },
  // cadmus - parts
  {
    path: 'items/:iid/general',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-general-pg').then(
        (module) => module.CadmusPartGeneralPgModule
      ),
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'items/:iid/philology',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-philology-pg').then(
        (module) => module.CadmusPartPhilologyPgModule
      ),
    canActivate: [AuthJwtGuardService],
  },
  // cadmus - graph
  {
    path: 'graph',
    loadChildren: () =>
      import('@myrmidon/cadmus-graph-pg').then(
        (module) => module.CadmusGraphPgModule
      ),
    canActivate: [AuthJwtGuardService],
  },
  // fallback
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
