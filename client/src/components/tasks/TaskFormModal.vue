<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Calendar, AlertTriangle } from '@lucide/vue'
import { useDevice } from '@/composables/useDevice'
import { createTask } from '@/api/tasks'
import { toast } from 'vue-sonner'
import axios from 'axios'
import dayjs from 'dayjs'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const { device } = useDevice()
const isSaving = ref(false)

const form = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium' as 'low' | 'medium' | 'high'
})

// Initialize with tomorrow's date at 9:00 AM as a helper
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    dueDate: dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'),
    priority: 'medium'
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    toast.error('Task title is required.')
    return
  }

  try {
    isSaving.value = true
    
    // Convert local datetime string to proper Date ISO string for backend
    const payload = {
      title: form.value.title,
      description: form.value.description || undefined,
      priority: form.value.priority,
      dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
    }

    await createTask(payload)
    toast.success('Task created successfully!')
    emit('success')
    emit('close')
  } catch (err: unknown) {
    console.error('Failed to create task:', err)
    let errMsg = 'Failed to create task. Please try again.'
    if (axios.isAxiosError(err)) {
      errMsg = err.response?.data?.errors || errMsg
    }
    toast.error(errMsg)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      :class="[
        'fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs transition-all duration-300',
        device === 'desktop' ? 'items-center justify-center p-4' : '',
        device === 'tablet' ? 'items-stretch justify-end p-0' : '',
        device === 'mobile' ? 'items-end justify-center p-0' : ''
      ]"
    >
      <!-- Backdrop Overlay -->
      <div class="absolute inset-0 cursor-default" @click="$emit('close')"></div>

      <!-- Main Form Wrapper Container -->
      <div
        :class="[
          'bg-white shadow-2xl flex flex-col transition-all duration-300 transform relative z-10 border-slate-100',
          
          // Desktop Layout
          device === 'desktop' ? 'w-full max-w-lg rounded-xl scale-100 border' : '',
          
          // Tablet Layout (Right slide drawer)
          device === 'tablet' ? 'h-full w-96 ml-auto translate-x-0' : '',
          
          // Mobile Layout (Bottom Sheet)
          device === 'mobile' ? 'w-full h-[92vh] rounded-t-2xl translate-y-0' : ''
        ]"
      >
        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Create New Task</h3>
            <p class="text-xs text-slate-400">Add a task to stay organized and productive.</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- FORM BODY -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Title -->
          <div class="space-y-1">
            <label for="task-title" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Task Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              id="task-title"
              placeholder="What needs to be done?"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm placeholder-slate-400 transition-all font-medium text-slate-800"
              required
              autofocus
            />
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <label for="task-desc" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              v-model="form.description"
              id="task-desc"
              rows="3"
              placeholder="Add some details about this task..."
              class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm placeholder-slate-400 transition-all text-slate-800 font-medium resize-none"
            ></textarea>
          </div>

          <!-- Due Date -->
          <div class="space-y-1">
            <label for="task-due" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              <span>Due Date & Time</span>
            </label>
            <input
              v-model="form.dueDate"
              type="datetime-local"
              id="task-due"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-slate-800 font-medium transition-all"
            />
          </div>

          <!-- Priority: Segmented Radios -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <AlertTriangle class="w-3.5 h-3.5 text-slate-400" />
              <span>Priority Level</span>
            </label>
            
            <div class="grid grid-cols-3 gap-2.5 p-1 bg-slate-100 rounded-lg">
              <!-- LOW -->
              <label 
                class="flex flex-col items-center justify-center py-2.5 rounded-md cursor-pointer select-none text-xs font-bold transition-all"
                :class="form.priority === 'low' 
                  ? 'bg-green-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
              >
                <input 
                  type="radio" 
                  value="low" 
                  v-model="form.priority" 
                  class="sr-only" 
                />
                <span>LOW</span>
              </label>

              <!-- MEDIUM -->
              <label 
                class="flex flex-col items-center justify-center py-2.5 rounded-md cursor-pointer select-none text-xs font-bold transition-all"
                :class="form.priority === 'medium' 
                  ? 'bg-yellow-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
              >
                <input 
                  type="radio" 
                  value="medium" 
                  v-model="form.priority" 
                  class="sr-only" 
                />
                <span>MEDIUM</span>
              </label>

              <!-- HIGH -->
              <label 
                class="flex flex-col items-center justify-center py-2.5 rounded-md cursor-pointer select-none text-xs font-bold transition-all"
                :class="form.priority === 'high' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
              >
                <input 
                  type="radio" 
                  value="high" 
                  v-model="form.priority" 
                  class="sr-only" 
                />
                <span>HIGH</span>
              </label>
            </div>
          </div>
        </form>

        <!-- FOOTER ACTIONS -->
        <div class="flex items-center justify-end space-x-3 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSaving"
            class="px-5 py-2 bg-primary hover:bg-blue-700 disabled:bg-primary/70 text-white rounded-lg font-semibold text-sm shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            <span>Create Task</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
