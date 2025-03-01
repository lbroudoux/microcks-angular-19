import { CommonModule } from '@angular/common';
import { Component, inject, Inject, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Api, ServiceType } from '../../../../models/service.model';

export function jsonValidator(
  control: AbstractControl
): ValidationErrors | null {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
}

export interface DialogData {
  animal: string;
  name: string;
}

const API_TYPE = {
  GENERIC_EVENT: 'GENERIC_EVENT',
  GENERIC_REST: 'GENERIC_REST',
} as const;

@Component({
  selector: 'app-direct-api-dialog',
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
  ],
  templateUrl: './direct-api-dialog.component.html',
  styleUrl: './direct-api-dialog.component.css',
})
export class DirectApiDialogComponent {
  private stepper = viewChild<MatStepper>('stepper');
  readonly dialogRef = inject(MatDialogRef<DirectApiDialogComponent>);

  private _formBuilder = inject(FormBuilder);

  API_TYPE = API_TYPE;
  selectedApiType: keyof typeof API_TYPE | undefined;

  referencePayloadGroup = this._formBuilder.group({
    referencePayload: ['', [Validators.required, jsonValidator]],
  });
  apiPropertiesGroup = this._formBuilder.group({
    name: ['', Validators.required],
    version: ['', Validators.required],
    resource: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { save: (apiType: ServiceType, api: Api) => void }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  save() {
    // TODO pass data via close
    this.close();
    this.data.save(this.selectedApiType! as ServiceType, {
      name: this.apiPropertiesGroup.value.name!,
      version: this.apiPropertiesGroup.value.version!,
      resource: this.apiPropertiesGroup.value.resource!,
      referencePayload: this.referencePayloadGroup.value.referencePayload!,
    });
  }

  changeApiType(value: keyof typeof API_TYPE) {
    this.selectedApiType = value;
    this.stepper && this.stepper()?.next();
  }
}
