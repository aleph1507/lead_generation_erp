import {FormGroup, ValidatorFn} from '@angular/forms';

// export function MustMatch(controlName: string, matchingControlName: string) {
//     return (formGroup: FormGroup) => {
//         const control = formGroup.controls[controlName];
//         const matchingControl = formGroup.controls[matchingControlName];
//
//         if (matchingControl.errors && !matchingControl.errors.mustMatch) {
//             return;
//         }
//
//         // set error on matchingControl if validation fails
//         if (control.value !== matchingControl.value) {
//             matchingControl.setErrors({ mustMatch: true });
//         } else {
//             matchingControl.setErrors(null);
//         }
//     };
// }

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: FormGroup): {
        [key: string]: any
    } | null => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true
            };
        }
    };
}

// export function matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
//     return (group: FormGroup): {[key: string]: any} | null => {
//         const password = group.controls[passwordKey];
//         const confirmPassword = group.controls[confirmPasswordKey];
//
//         if (password.value !== confirmPassword.value) {
//             return {
//                 mismatchedPasswords: true
//             };
//         }
//     };
// }

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
