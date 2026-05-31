import { Injectable } from '@angular/core';
import { supabase } from './supabase';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  async getTodos() {
    return await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true });
  }

  async addTodo(text: string) {
    return await supabase
      .from('todos')
      .insert({
        text: text,
        completed: false
      })
      .select()
      .single();
  }

  async updateTodo(id: number, completed: boolean) {
    return await supabase
      .from('todos')
      .update({
        completed: completed
      })
      .eq('id', id)
      .select()
      .single();
  }

  async deleteTodo(id: number) {
    return await supabase
      .from('todos')
      .delete()
      .eq('id', id);
  }
}