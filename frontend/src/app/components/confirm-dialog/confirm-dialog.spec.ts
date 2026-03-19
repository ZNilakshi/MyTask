import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog';

// ── Helper ─────────────────────────────────────────────────────────────────────

function createComponent(message: string) {
  // Vitest uses vi.fn() instead of jasmine.createSpyObj
  const closeSpy    = vi.fn();
  const dialogRef   = { close: closeSpy } as unknown as MatDialogRef<ConfirmDialogComponent>;
  const dialogData: ConfirmDialogData = { message };

  TestBed.configureTestingModule({
    imports: [ConfirmDialogComponent, NoopAnimationsModule],
    providers: [
      { provide: MatDialogRef,    useValue: dialogRef  },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  });

  const fixture   = TestBed.createComponent(ConfirmDialogComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, closeSpy };
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('ConfirmDialogComponent', () => {

  // ── Creation ───────────────────────────────────────────────────
  describe('component creation', () => {

    it('should create successfully', () => {
      const { component } = createComponent('Delete this task?');
      expect(component).toBeTruthy();
    });

    it('should inject the dialog data correctly', () => {
      const message       = 'Are you sure you want to delete "Fix login bug"?';
      const { component } = createComponent(message);
      expect(component.data.message).toBe(message);
    });

  });

  // ── Template rendering ─────────────────────────────────────────
  describe('template', () => {

    it('should display the injected message in the template', () => {
      const message         = 'Delete "Write unit tests"?';
      const { fixture }     = createComponent(message);
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelector('.confirm-dialog__message')?.textContent?.trim())
        .toBe(message);
    });

    it('should display the "cannot be undone" warning text', () => {
      const { fixture }     = createComponent('Delete task?');
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelector('.confirm-dialog__warning')?.textContent?.trim())
        .toContain('cannot be undone');
    });

    it('should render a Cancel button', () => {
      const { fixture }     = createComponent('Delete task?');
      const el: HTMLElement = fixture.nativeElement;
      const labels          = Array.from(el.querySelectorAll('button'))
                                   .map(b => b.textContent?.trim());

      expect(labels).toContain('Cancel');
    });

    it('should render a Delete button', () => {
      const { fixture }     = createComponent('Delete task?');
      const el: HTMLElement = fixture.nativeElement;
      const labels          = Array.from(el.querySelectorAll('button'))
                                   .map(b => b.textContent?.trim());

      expect(labels).toContain('Delete');
    });

  });

  // ── confirm() ──────────────────────────────────────────────────
  describe('confirm()', () => {

    it('should close the dialog with true when confirm() is called', () => {
      const { component, closeSpy } = createComponent('Delete task?');

      component.confirm();

      // Vitest: split toHaveBeenCalledOnceWith into two separate assertions
      expect(closeSpy).toHaveBeenCalledWith(true);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog with true when the Delete button is clicked', () => {
      const { fixture, closeSpy } = createComponent('Delete task?');
      const el: HTMLElement       = fixture.nativeElement;

      const deleteBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim() === 'Delete');

      deleteBtn?.click();
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalledWith(true);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

  });

  // ── cancel() ───────────────────────────────────────────────────
  describe('cancel()', () => {

    it('should close the dialog with false when cancel() is called', () => {
      const { component, closeSpy } = createComponent('Delete task?');

      component.cancel();

      expect(closeSpy).toHaveBeenCalledWith(false);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog with false when the Cancel button is clicked', () => {
      const { fixture, closeSpy } = createComponent('Delete task?');
      const el: HTMLElement       = fixture.nativeElement;

      const cancelBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim() === 'Cancel');

      cancelBtn?.click();
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalledWith(false);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

  });

  // ── Edge cases ─────────────────────────────────────────────────
  describe('edge cases', () => {

    it('should handle an empty message string without crashing', () => {
      const { component } = createComponent('');
      expect(component.data.message).toBe('');
    });

    it('should handle a very long message without crashing', () => {
      const longMessage   = 'A'.repeat(500);
      const { component } = createComponent(longMessage);
      expect(component.data.message.length).toBe(500);
    });

    it('should not call close more than once on a single confirm', () => {
      const { component, closeSpy } = createComponent('Delete?');
      component.confirm();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call close more than once on a single cancel', () => {
      const { component, closeSpy } = createComponent('Delete?');
      component.cancel();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

  });

});