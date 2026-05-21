<script setup lang="ts">
import { LayoutDashboard, LogOut } from '@lucide/vue'
import useAuth from '@/composables/useAuth'
import { useDevice } from '@/composables/useDevice'

defineProps<{ isOpen: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { logout } = useAuth()
const { device } = useDevice()
</script>

<template>
  <!-- Mobile Overlay -->
  <div
    v-if="device === 'mobile' && isOpen"
    class="absolute inset-0 bg-black/50 z-30 transition-opacity"
    @click="$emit('close')"
  ></div>

  <aside
    :class="[
      'bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
      device === 'mobile' ? 'absolute top-0 left-0 bottom-0 w-64 z-40 shadow-xl' : '',
      device === 'desktop' ? 'w-64' : '',
      device === 'tablet' ? 'w-20 items-center' : '',
      device === 'mobile' && !isOpen ? '-translate-x-full' : 'translate-x-0',
    ]"
  >
    <!-- User Info -->
    <div
      :class="[
        'py-6 flex items-center border-b border-gray-100',
        device === 'tablet' ? 'justify-center w-full' : 'px-6 space-x-3',
      ]"
    >
      <img
        src="https://ui-avatars.com/api/?name=Task Manager&background=0D8ABC&color=fff"
        class="rounded-full shadow-sm"
        :class="device === 'tablet' ? 'w-10 h-10' : 'w-10 h-10'"
      />
      <div v-if="device !== 'tablet'" class="overflow-hidden">
        <h3 class="font-bold text-sm text-primary leading-tight truncate">Task Manager</h3>
      </div>
    </div>

    <!-- Navigation -->
    <nav
      class="flex-1 py-8 space-y-2 flex flex-col overflow-y-auto"
      :class="device === 'tablet' ? 'w-full px-2 items-center' : 'px-4'"
    >
      <router-link
        to="/"
        @click="$emit('close')"
        :class="[
          'flex items-center bg-blue-100 text-blue-800 rounded-lg',
          device === 'tablet' ? 'p-3' : 'px-3 py-2.5 space-x-3',
        ]"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span v-if="device !== 'tablet'" class="font-medium text-sm">Dashboard</span>
      </router-link>
    </nav>

    <!-- Logout -->
    <div
      class="p-4 border-t border-gray-100"
      :class="device === 'tablet' ? 'w-full flex justify-center' : ''"
    >
      <button
        @click="logout"
        :class="[
          'flex items-center text-gray-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors',
          device === 'tablet' ? 'p-3' : 'px-3 py-2.5 space-x-3 w-full',
        ]"
      >
        <LogOut class="w-5 h-5" />
        <span v-if="device !== 'tablet'" class="font-medium text-sm">Logout</span>
      </button>
    </div>
  </aside>
</template>
