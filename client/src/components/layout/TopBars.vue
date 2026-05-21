<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { useDevice } from '@/composables/useDevice'

defineEmits<{ (e: 'open-menu'): void }>()
const { device } = useDevice()
</script>

<template>
  <header
    :class="[
      'bg-white border-b border-gray-200 flex items-center justify-between',
      device === 'mobile' ? 'h-14 px-4 shadow-sm z-20 relative' : 'h-16 px-6 md:px-8',
    ]"
  >
    <button v-if="device === 'mobile'" @click="$emit('open-menu')" class="p-2 -ml-2 text-gray-600">
      <Menu class="w-6 h-6" />
    </button>
  </header>
</template>
