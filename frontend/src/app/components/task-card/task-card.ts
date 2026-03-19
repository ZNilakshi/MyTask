import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './task-card.html',
  styleUrl:    './task-card.scss',
})
export class TaskCardComponent {

  @Input({ required: true }) task!: Task;

  @Output() viewTask   = new EventEmitter<Task>();
  @Output() editTask   = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  onView():   void { this.viewTask.emit(this.task); }
  onEdit():   void { this.editTask.emit(this.task); }
  onDelete(): void { this.deleteTask.emit(this.task.id); }

  truncate(text: string | undefined, limit = 120): string {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  get cardClass(): string {
    return { TO_DO: 'card-todo', IN_PROGRESS: 'card-progress', DONE: 'card-done' }[this.task.status] ?? '';
  }

  get statusBadgeClass(): string {
    return { TO_DO: 'status-to_do', IN_PROGRESS: 'status-in_progress', DONE: 'status-done' }[this.task.status] ?? '';
  }

  get statusLabel(): string {
    return { TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[this.task.status] ?? this.task.status;
  }
}