// import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
//
// export class CustomValidators {
//
//   static mustMatch(controlName: string, matchingControlName: string) {
//     return (formGroup: FormGroup) => {
//       const control = formGroup.controls[controlName];
//       const matchingControl = formGroup.controls[matchingControlName];
//
//       if (matchingControl.errors && !matchingControl.errors.mustMatch) {
//         return;
//       }
//
//       if (control.value !== matchingControl.value) {
//         matchingControl.setErrors({ mustMatch: true });
//       } else {
//         matchingControl.setErrors(null);
//       }
//     };
//   }
//
//
//   // static passwordConfirmation(confirm: FormControl, password: string) {
//   //   return confirm.value === password ? null : {
//   //     passwordConfirmation: {
//   //       valid: false
//   //     }
//   //   };
//   // }
// }


// mustMatch(controlName: string, matchingControlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];
//
//     if (matchingControl.errors && !matchingControl.errors.mustMatch) {
//       return;
//     }
//
//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ mustMatch: true });
//     } else {
//       matchingControl.setErrors(null);
//     }
//   }
// }
