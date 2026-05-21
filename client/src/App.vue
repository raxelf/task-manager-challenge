<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <Toaster position="top-center" richColors closeButton />
    <RouterView />
  </div>
</template>
