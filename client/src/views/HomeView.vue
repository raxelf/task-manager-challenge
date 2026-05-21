<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useTitle from '@/composables/useTitle'
import { useDevice } from '@/composables/useDevice'
import TaskTable from '@/components/tasks/TaskTable.vue'
import TaskCardList from '@/components/tasks/TaskCardList.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import { fetchTasks, updateTask } from '@/api/tasks'
import type { Task } from '@/types/task'
import dayjs from 'dayjs'

useTitle('Dashboard')

const { device } = useDevice()

const tasks = ref<Task[]>([])
const loading = ref(true)
const sortBy = ref<string>('dueDate')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')
const isFormOpen = ref(false)
const showOnlyToday = ref(false)

const loadTasks = async () => {
  try {
    loading.value = true
    tasks.value = await fetchTasks({ sort: sortBy.value, order: sortOrder.value })
  } catch (err) {
    console.error('Failed to load tasks', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = field
    sortOrder.value = 'ASC'
  }
  loadTasks()
}

const toggleTask = async (id: number) => {
  const t = tasks.value.find((t: Task) => t.id === id)
  if (t) {
    const original = t.isCompleted
    t.isCompleted = !original
    try {
      await updateTask(id, { isCompleted: t.isCompleted })
    } catch (err) {
      console.error('Failed to update task', err)
      t.isCompleted = original
    }
  }
}

const updateTaskPriority = async (id: number, priority: string) => {
  const t = tasks.value.find((t: Task) => t.id === id)
  if (t) {
    const original = t.priority
    t.priority = priority as 'low' | 'medium' | 'high'
    try {
      await updateTask(id, { priority: t.priority })
    } catch (err) {
      console.error('Failed to update priority', err)
      t.priority = original as 'low' | 'medium' | 'high'
    }
  }
}

const openTaskForm = () => {
  isFormOpen.value = true
}

// Compute uncompleted tasks due today for the alert badge/banner
const todayTasks = computed(() => {
  return tasks.value.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false
    return dayjs(t.dueDate).isSame(dayjs(), 'day')
  })
})

// Filter tasks to show in UI (normal list vs today focus filter)
const displayedTasks = computed(() => {
  if (showOnlyToday.value) {
    return tasks.value.filter((t) => {
      if (!t.dueDate) return false
      return dayjs(t.dueDate).isSame(dayjs(), 'day')
    })
  }
  return tasks.value
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Due Today Alert Banner -->
      <div
        v-if="todayTasks.length > 0 && !showOnlyToday"
        class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs"
      >
        <div class="flex items-start space-x-3">
          <div class="bg-amber-100 p-2 rounded-lg text-amber-700 shrink-0">
            <!-- Alert Bell SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-amber-800 text-sm">Tasks Due Today!</h4>
            <p class="text-xs text-amber-700 mt-0.5">
              You have <span class="font-bold text-amber-900">{{ todayTasks.length }} task(s)</span> due today that need your attention.
            </p>
          </div>
        </div>
        <button
          @click="showOnlyToday = true"
          class="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer self-start sm:self-auto shadow-xs"
        >
          Perform Now
        </button>
      </div>

      <!-- Focus Mode Filter Indicator -->
      <div
        v-if="showOnlyToday"
        class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-xs animate-fade-in"
      >
        <div class="flex items-center space-x-3">
          <div class="bg-blue-100 p-2 rounded-lg text-blue-700 shrink-0">
            <!-- Filter active SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-blue-800 text-sm">Focus Mode Active</h4>
            <p class="text-xs text-blue-600 mt-0.5">Showing only tasks due today.</p>
          </div>
        </div>
        <button
          @click="showOnlyToday = false"
          class="text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          Show All Tasks
        </button>
      </div>

      <!-- Desktop & Tablet Layout -->
      <div
        v-if="device === 'desktop' || device === 'tablet'"
        class="bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <TaskTable
          :tasks="displayedTasks"
          :sortBy="sortBy"
          :sortOrder="sortOrder"
          @toggle="toggleTask"
          @update-priority="updateTaskPriority"
          @sort="handleSort"
          @add="openTaskForm"
        />
      </div>

      <!-- Mobile Layout -->
      <TaskCardList
        v-if="device === 'mobile'"
        :tasks="displayedTasks"
        :sortBy="sortBy"
        :sortOrder="sortOrder"
        @toggle="toggleTask"
        @update-priority="updateTaskPriority"
        @sort="handleSort"
        @add="openTaskForm"
      />
    </template>

    <!-- Task Creation Adaptive Modal/Drawer/Sheet -->
    <TaskFormModal
      :is-open="isFormOpen"
      @close="isFormOpen = false"
      @success="loadTasks"
    />
  </div>
</template>
