<script setup lang="ts">
import { ChevronDown, ChevronUp, Plus, Check } from '@lucide/vue'
import dayjs from 'dayjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineProps<{ tasks: any[]; sortBy: string; sortOrder: 'ASC' | 'DESC' }>()
const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'update-priority', id: number, priority: string): void
  (e: 'sort', field: string): void
  (e: 'add'): void
}>()

const handlePriorityChange = (id: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update-priority', id, target.value)
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return dayjs(date).format('MMM D, YYYY h:mm A')
}
</script>

<template>
  <div>
    <!-- DESKTOP / TABLET HEADER -->
    <div class="px-6 py-4 flex items-center justify-between border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">Active Tasks</h2>

      <div class="flex items-center space-x-4">

        <button
          @click="$emit('add')"
          class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center shadow-sm cursor-pointer"
        >
          <Plus class="w-4 h-4 mr-1.5" />
          New Task
        </button>
      </div>
    </div>

    <!-- LIST HEADER -->
    <div
      class="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 tracking-wider items-center"
    >
      <div class="col-span-1"></div>
      <div
        @click="$emit('sort', 'priority')"
        class="col-span-3 lg:col-span-2 flex items-center space-x-1 cursor-pointer select-none hover:text-gray-900 transition-colors"
      >
        <span>PRIORITY</span>
        <ChevronUp v-if="sortBy === 'priority' && sortOrder === 'ASC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
        <ChevronDown v-else-if="sortBy === 'priority' && sortOrder === 'DESC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
      </div>
      <div
        @click="$emit('sort', 'title')"
        class="col-span-5 lg:col-span-7 flex items-center space-x-1 cursor-pointer select-none hover:text-gray-900 transition-colors"
      >
        <span>TASK</span>
        <ChevronUp v-if="sortBy === 'title' && sortOrder === 'ASC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
        <ChevronDown v-else-if="sortBy === 'title' && sortOrder === 'DESC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
      </div>
      <div
        @click="$emit('sort', 'dueDate')"
        class="col-span-3 lg:col-span-2 flex items-center space-x-1 cursor-pointer select-none hover:text-gray-900 transition-colors"
      >
        <span>DUE DATE</span>
        <ChevronUp v-if="sortBy === 'dueDate' && sortOrder === 'ASC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
        <ChevronDown v-else-if="sortBy === 'dueDate' && sortOrder === 'DESC'" class="w-3.5 h-3.5 text-primary shrink-0 transition-transform" />
      </div>
    </div>

    <!-- LIST ROWS -->
    <div
      v-if="tasks.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="text-4xl text-gray-300 mb-4">📝</div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
      <p class="text-gray-500 text-sm">
        You haven't created any tasks yet. Kick off your day by adding one!
      </p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
      >
        <!-- Checkbox -->
        <div class="col-span-1 flex items-center">
          <div
            @click="$emit('toggle', task.id)"
            class="w-5 h-5 rounded flex items-center justify-center cursor-pointer border transition-colors shrink-0"
            :class="
              task.isCompleted
                ? 'bg-primary border-primary text-white'
                : 'border-gray-300 hover:border-primary'
            "
          >
            <Check v-if="task.isCompleted" class="w-3.5 h-3.5" stroke-width="3" />
          </div>
        </div>

        <!-- Priority -->
        <div class="col-span-3 lg:col-span-2">
          <div class="relative inline-block w-max">
            <select
              :value="task.priority"
              @change="handlePriorityChange(task.id, $event)"
              class="pl-3 pr-7 py-1 rounded-full text-xs font-bold tracking-wider cursor-pointer outline-none appearance-none uppercase"
              :class="{
                'bg-red-100 text-red-700': task.priority === 'high',
                'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                'bg-green-100 text-green-700': task.priority === 'low',
              }"
            >
              <option value="high" class="bg-white text-gray-800">HIGH</option>
              <option value="medium" class="bg-white text-gray-800">MEDIUM</option>
              <option value="low" class="bg-white text-gray-800">LOW</option>
            </select>
            <ChevronDown
              class="w-3 h-3 text-current absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        <!-- Task (Title + Description) -->
        <div class="col-span-5 lg:col-span-7 pr-4" :class="{ 'opacity-50 line-through': task.isCompleted }">
          <div class="text-gray-800 text-sm font-bold truncate">{{ task.title }}</div>
          <div class="text-gray-500 text-xs truncate mt-0.5">{{ task.description }}</div>
        </div>

        <!-- Due Date -->
        <div class="col-span-3 lg:col-span-2 text-sm text-gray-500">
          {{ formatDate(task.dueDate) }}
        </div>
      </div>
    </div>
  </div>
</template>
