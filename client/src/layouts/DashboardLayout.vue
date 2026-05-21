<script setup lang="ts">
import SideBars from '@/components/layout/SideBars.vue'
import TopBars from '@/components/layout/TopBars.vue'
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="h-screen w-full flex bg-slate-50 overflow-hidden text-slate-900 font-sans relative">
    <SideBars :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden relative w-full">
      <TopBars @open-menu="isMobileMenuOpen = true" />

      <main class="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
