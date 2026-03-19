import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './task-form.html',
  styleUrl:    './task-form.scss',
})
export class TaskFormComponent implements OnChanges {

  @Input() task: Task | null = null;
  @Input() errorMessage = '';

  @Output() formSubmit = new EventEmitter<Task>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  statusOptions: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  get isEditMode(): boolean { return !!this.task?.id; }

  constructor(private fb: FormBuilder) { this.buildForm(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) this.buildForm(this.task ?? undefined);
  }

  private buildForm(task?: Task): void {
    this.form = this.fb.group({
      title:       [task?.title       ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [task?.description ?? '', [Validators.maxLength(500)]],
      status:      [task?.status      ?? 'TO_DO', Validators.required],
    });
  }

  statusLabel(s: TaskStatus): string {
    return { TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[s];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.value as Task);
  }

  onCancel(): void { this.formCancel.emit(); }
}