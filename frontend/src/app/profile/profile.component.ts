import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  form: any = {
    password: null
  }
  currentUser: any;
  constructor(private storageService: StorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }

  openChangePwDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, { 
      minWidth: '25vw',
      minHeight: '25vh',
      hasBackdrop: true, 
      data: this.currentUser.username });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  openDeleteAccDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountComponent, { 
      minWidth: '25vw',
      minHeight: '15vh',
      hasBackdrop: true, 
      data: this.currentUser.username });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'change-password-form',
  templateUrl: './profile-dialogs/change-password-form.html',  
  styleUrls: ['./profile-dialogs/dialog-form.css']
})
export class ChangePasswordComponent {
  @ViewChild('updatePwForm') updatePwForm!: NgForm;
  newPassword = '';
  response = '';
  isError = false;
  isFormSubmitted = false;
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string,
    private userService: UserService) {}
  
  changePw() {
    if (this.updatePwForm.valid) {
      this.userService.changePw(this.newPassword).subscribe({
        next: (res) => this.response = res.message,
        error: (err) => {
          this.response = err.error.message
          this.isError = true;
        }
      });
      this.isFormSubmitted = true;
   }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-account-form',
  templateUrl: './profile-dialogs/delete-account-form.html',
  styleUrls: ['./profile-dialogs/dialog-form.css']  
})
export class DeleteAccountComponent {
  constructor(public dialogRef: MatDialogRef<DeleteAccountComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private userService: UserService,
    private authService: AuthService,
    private storageService: StorageService) {}

  deleteAcc() {
    this.userService.deleteAcc().subscribe((res) => {
      console.log(res);
    });
    this.authService.signout().subscribe((res) => {
      this.storageService.clean();
      window.location.reload();
      window.location.href = '/';
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
