import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  newTodo = '';
  isLoading = false;
  errorMessage = '';

  todos: Todo[] = [];

  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  async loadTodos() {
    this.isLoading = true;
    this.errorMessage = '';

    const { data, error } = await this.todoService.getTodos();

    this.isLoading = false;

    if (error) {
      console.error(error);
      this.errorMessage = 'Nem sikerült betölteni a feladatokat.';
      this.cdr.detectChanges();
      return;
    }

    this.todos = data ?? [];
    this.cdr.detectChanges();
  }

  async addTodo() {
    const todoText = this.newTodo.trim();

    if (todoText === '' || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { data, error } = await this.todoService.addTodo(todoText);

    this.isLoading = false;

    if (error) {
      console.error(error);
      this.errorMessage = 'Nem sikerült hozzáadni a feladatot.';
      this.cdr.detectChanges();
      return;
    }

    if (data) {
      this.todos = [...this.todos, data];
      this.newTodo = '';
      this.cdr.detectChanges();
    }
  }

  async toggleTodo(index: number) {
    const todo = this.todos[index];

    const { data, error } = await this.todoService.updateTodo(
      todo.id,
      !todo.completed
    );

    if (error) {
      console.error(error);
      this.errorMessage = 'Nem sikerült módosítani a feladatot.';
      this.cdr.detectChanges();
      return;
    }

    if (data) {
      this.todos = this.todos.map((currentTodo, todoIndex) => {
        if (todoIndex === index) {
          return data;
        }

        return currentTodo;
      });

      this.cdr.detectChanges();
    }
  }

  async deleteTodo(index: number) {
    const todo = this.todos[index];

    const { error } = await this.todoService.deleteTodo(todo.id);

    if (error) {
      console.error(error);
      this.errorMessage = 'Nem sikerült törölni a feladatot.';
      this.cdr.detectChanges();
      return;
    }

    this.todos = this.todos.filter((_, todoIndex) => todoIndex !== index);
    this.cdr.detectChanges();
  }
}