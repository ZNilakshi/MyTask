import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskCardComponent } from '../task-card/task-card';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

export type ToastKind = 'created' | 'updated' | 'deleted' | 'error';

export interface Toast {
  id:      number;
  kind:    ToastKind;
  title:   string;
  message: string;
  leaving: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    TaskFormComponent,
    TaskCardComponent,
  ],
  templateUrl: './task-list.html',
  styleUrl:    './task-list.scss',
})
export class TaskList implements OnInit, OnDestroy {

  // Board state
  allTasks: Task[] = [];
  selectedStatus: TaskStatus | '' = '';
  statusOptions: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  // Detail modal
  selectedTask: Task | null = null;

  // Form modal — passed DOWN to TaskFormComponent via @Input()
  formOpen     = false;
  editingTask: Task | null = null;   // null = create mode, Task = edit mode
  formError    = '';                 // set after API failure, passed to child via @Input

  // Toast stack
  toasts: Toast[] = [];
  private toastCounter = 0;
  private toastTimers  = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly TOAST_DURATION  = 3500;
  private readonly TOAST_EXIT_WAIT = 340;

  // Route subscription
  private routeSub!: Subscription;

  // Greeting
  private quotes = [
    'Small steps every day lead to big results.',
    'Focus on progress, not perfection.',
    'Every task completed is a step forward.',
    'You are capable of amazing things.',
    'Stay consistent. Results will follow.',
    "One task at a time — you've got this.",
    'Great work is built from small, steady efforts.',
  ];
  motivationalQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  constructor(
    private taskService: TaskService,
    public  authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTasks();

    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id  = params.get('id');
      const url = this.router.url;

      if (url.includes('/tasks/new')) {
        this.openForm();
      } else if (id) {
        this.taskService.getTaskById(+id).subscribe({
          next:  task => this.openForm(task),
          error: ()   => this.toast('error', 'Not found', 'Task could not be loaded.'),
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.toastTimers.forEach(t => clearTimeout(t));
  }

  // Toast helpers
  private toast(kind: ToastKind, title: string, message: string): void {
    const id = ++this.toastCounter;
    this.toasts.push({ id, kind, title, message, leaving: false });
    const timer = setTimeout(() => this.dismissToast(id), this.TOAST_DURATION);
    this.toastTimers.set(id, timer);
  }

  dismissToast(id: number): void {
    const t = this.toasts.find(t => t.id === id);
    if (!t || t.leaving) return;
    t.leaving = true;
    const timer = this.toastTimers.get(id);
    if (timer) { clearTimeout(timer); this.toastTimers.delete(id); }
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, this.TOAST_EXIT_WAIT);
  }

  toastIcon(kind: ToastKind): string {
    return {
      created: 'add_circle_outline',
      updated: 'edit',
      deleted: 'delete_outline',
      error:   'error_outline',
    }[kind];
  }

  // Form open / close
  openForm(task?: Task): void {
    this.editingTask = task ?? null;
    this.formError   = '';
    this.formOpen    = true;

       if (task?.id) {
      this.router.navigate(['/tasks/edit', task.id], { replaceUrl: true });
    } else {
      this.router.navigate(['/tasks/new'], { replaceUrl: true });
    }
  }

  closeForm(): void {
    this.formOpen    = false;
    this.editingTask = null;
    this.formError   = '';
    this.router.navigate(['/tasks'], { replaceUrl: true });
  }

   onFormSubmit(payload: Task): void {
    this.formError = '';

    if (this.editingTask?.id) {
      const id = this.editingTask.id;
      this.taskService.updateTask(id, payload).subscribe({
        next: () => {
          this.toast('updated', 'Task updated', `"${payload.title}" has been saved.`);
          this.closeForm();
          this.taskService.getAllTasks().subscribe(tasks => {
            this.allTasks = tasks;
            if (this.selectedTask?.id === id) {
              this.selectedTask = tasks.find(t => t.id === id) ?? null;
            }
          });
        },
        error: () => { this.formError = 'Failed to update task. Please try again.'; },
      });

    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => {
          this.toast('created', 'Task created', `"${payload.title}" was added to the board.`);
          this.closeForm();
          this.loadTasks();
        },
        error: () => { this.formError = 'Failed to create task. Please try again.'; },
      });
    }
  }

  // Tasks CRUD
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next:  tasks => this.allTasks = tasks,
      error: ()    => this.toast('error', 'Load failed', 'Could not fetch tasks from the server.'),
    });
  }

  // Called by TaskCardComponent's (deleteTask) @Output
  deleteTask(id: number): void {
    const target = this.allTasks.find(t => t.id === id);

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data:  { message: `Are you sure you want to delete "${target?.title ?? 'this task'}"?` },
      width: '360px',
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.taskService.deleteTask(id).subscribe({
        next:  () => {
          this.closeTask();
          this.loadTasks();
          this.toast('deleted', 'Task deleted', `"${target?.title ?? 'Task'}" was removed.`);
        },
        error: () => this.toast('error', 'Delete failed', 'Could not delete the task.'),
      });
    });
  }

  // Detail modal
  openTask(task: Task): void { this.selectedTask = task; }
  closeTask():          void { this.selectedTask = null; }

// ── Filters / getters ─────────────────────────────────────────
get filteredTasks(): Task[] {
  if (!this.selectedStatus) return this.allTasks;
  return this.allTasks.filter(t => t.status === this.selectedStatus);
}

get todoTasks()       { return this.filteredTasks.filter(t => t.status === 'TO_DO'); }
get inProgressTasks() { return this.filteredTasks.filter(t => t.status === 'IN_PROGRESS'); }
get doneTasks()       { return this.filteredTasks.filter(t => t.status === 'DONE'); }
get totalTodo()       { return this.allTasks.filter(t => t.status === 'TO_DO').length; }
get totalInProgress() { return this.allTasks.filter(t => t.status === 'IN_PROGRESS').length; }
get totalDone()       { return this.allTasks.filter(t => t.status === 'DONE').length; }


statusLabel(s: TaskStatus): string {
  return { TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[s];
}
  // Auth
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}