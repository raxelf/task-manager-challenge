import axiosInstance from './index'
import type { Task, FetchTasksParams, TaskResponse } from '@/types/task'

export const fetchTasks = async (params?: FetchTasksParams): Promise<Task[]> => {
  const { data } = await axiosInstance.get<TaskResponse>('/tasks', { params })
  return data.data as Task[]
}

export const createTask = async (payload: Partial<Task>): Promise<Task> => {
  const { data } = await axiosInstance.post<TaskResponse>('/tasks', payload)
  return data.data as Task
}

export const updateTask = async (id: number, payload: Partial<Task>): Promise<Task> => {
  const { data } = await axiosInstance.patch<TaskResponse>(`/task/${id}`, payload)
  return data.data as Task
}

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/task/${id}`)
}
