import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {GridsterModule} from 'angular-gridster2';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UploadFilesComponent } from './upload-files/upload-files.component'
import { AlertCollectionComponent } from './alert-collection/alert-collection.component';
import { UploadFilesService } from './services/upload-files.service';
import { WebSocketService } from './services/web-socket.service';
import { HistoryChecksComponent } from './history-checks/history-checks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { TestHistoryDetailComponent } from './test-history-detail/test-history-detail.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UploadFilesComponent,
    AlertCollectionComponent,
    HistoryChecksComponent,
    LoginComponent,
    RegisterComponent,
    TestHistoryDetailComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgxGaugeModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatCardModule,
    GridsterModule,
    MatProgressBarModule,
    ScrollingModule,
    MatPaginatorModule,
    NgxChartsModule,
    MatSliderModule,
    FormsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [UploadFilesService, WebSocketService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
