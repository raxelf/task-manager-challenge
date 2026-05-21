export type Task = {
  id: number
  userId: number
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export type FetchTasksParams = {
  sort?: string
  order?: 'ASC' | 'DESC'
}

export type TaskResponse = {
  success: boolean
  data: Task | Task[]
}
