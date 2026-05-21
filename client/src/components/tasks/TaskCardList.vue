<script setup lang="ts">
import { Plus, ChevronDown, ChevronUp, Check } from '@lucide/vue'
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

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Active Tasks</h2>
          <button
            @click="$emit('add')"
            class="bg-primary hover:bg-blue-700 text-white w-8 h-8 rounded-md flex items-center justify-center shadow-sm cursor-pointer"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Sort Field Select -->
          <div class="relative flex-1">
            <select
              :value="sortBy"
              @change="$emit('sort', ($event.target as HTMLSelectElement).value)"
              class="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="dueDate">Sort by: Due Date</option>
              <option value="title">Sort by: Title</option>
              <option value="priority">Sort by: Priority</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <!-- Sort Order Toggle -->
          <button
            @click="$emit('sort', sortBy)"
            class="px-2.5 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ChevronUp v-if="sortOrder === 'ASC'" class="w-4 h-4 text-primary" />
            <ChevronDown v-else class="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      <!-- List -->
      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center py-12 px-6 text-center"
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
          class="p-4 flex items-center gap-3.5 hover:bg-gray-50/50 transition-colors"
        >
          <!-- Checkbox Left -->
          <div class="shrink-0 flex items-center">
            <div
              @click="$emit('toggle', task.id)"
              class="w-5.5 h-5.5 rounded flex items-center justify-center cursor-pointer border border-gray-300 hover:border-primary transition-colors shrink-0 shadow-2xs"
              :class="
                task.isCompleted
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white hover:bg-blue-50/50'
              "
            >
              <Check v-if="task.isCompleted" class="w-3.5 h-3.5" stroke-width="3" />
            </div>
          </div>

          <!-- Content Right -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <!-- Title -->
            <div
              class="text-sm font-bold text-gray-800 leading-tight"
              :class="[
                task.isCompleted ? 'opacity-50 line-through text-gray-400' : '',
                task.description ? 'mb-0.5' : 'mb-2'
              ]"
            >
              {{ task.title }}
            </div>

            <!-- Description -->
            <div
              v-if="task.description"
              class="text-xs text-gray-500 leading-snug truncate mb-2"
              :class="{ 'opacity-50 line-through text-gray-400': task.isCompleted }"
            >
              {{ task.description }}
            </div>

            <!-- Metadata Row -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Priority dropdown pill -->
              <div class="relative inline-block shrink-0">
                <select
                  :value="task.priority"
                  @change="handlePriorityChange(task.id, $event)"
                  class="pl-2.5 pr-6 py-0.5 rounded-full text-[10px] font-bold tracking-wider cursor-pointer outline-none appearance-none uppercase transition-all duration-200"
                  :class="{
                    'bg-red-50 text-red-600 hover:bg-red-100': task.priority === 'high',
                    'bg-yellow-50 text-yellow-600 hover:bg-yellow-100': task.priority === 'medium',
                    'bg-green-50 text-green-600 hover:bg-green-100': task.priority === 'low',
                  }"
                >
                  <option value="high" class="bg-white text-gray-800">HIGH</option>
                  <option value="medium" class="bg-white text-gray-800">MEDIUM</option>
                  <option value="low" class="bg-white text-gray-800">LOW</option>
                </select>
                <ChevronDown
                  class="w-2.5 h-2.5 text-current absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>

              <!-- Bullet Separator -->
              <span class="text-gray-300 text-xs shrink-0 select-none">•</span>

              <!-- Due Date with Calendar icon -->
              <span class="text-[10px] text-gray-400 font-medium shrink-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(task.dueDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
