<script setup lang="ts">
import { useDevice } from '@/composables/useDevice'
import todoAppIllustration from '@/assets/todo_app_illustration.svg'
import { RouterView } from 'vue-router'

const { device } = useDevice()
</script>

<template>
  <div class="min-h-screen w-full flex bg-gray-50">
    <!-- desktop -->
    <template v-if="device === 'desktop'">
      <!-- Left side -->
      <div class="bg-primary w-1/2 p-12 flex flex-col items-center justify-center text-white">
        <div class="max-w-md flex flex-col items-center text-center">
          <img
            :src="todoAppIllustration"
            alt="Todo App"
            class="w-full max-h-[50vh] object-contain mb-8 drop-shadow-2xl rounded-xl"
          />
          <h1 class="text-4xl font-bold mb-4">Master Your Day</h1>
          <p class="text-blue-200 leading-relaxed font-light">
            Organize your daily tasks, set priorities, and keep track of deadlines effortlessly.
            Stay focused and get more done.
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <RouterView />
        </div>
      </div>
    </template>

    <!-- tablet -->
    <template v-if="device === 'tablet'">
      <!-- Left side -->
      <div class="bg-primary w-[45%] p-6 flex flex-col items-center justify-center text-white">
        <div class="w-full flex flex-col items-center text-center">
          <img
            :src="todoAppIllustration"
            alt="Todo App"
            class="w-4/5 max-h-[40vh] object-contain mb-6 drop-shadow-2xl rounded-xl"
          />
          <h1 class="text-3xl font-bold mb-3">Master Your Day</h1>
          <p class="text-blue-200 leading-relaxed font-light text-sm px-4">
            Organize your daily tasks, set priorities, and keep track of your deadlines
            effortlessly.
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="w-[55%] flex items-center justify-center p-8">
        <div class="w-full max-w-sm">
          <RouterView />
        </div>
      </div>
    </template>

    <!-- mobile  -->
    <template v-if="device === 'mobile'">
      <div class="flex flex-col flex-1 bg-white justify-center">
        <div class="w-full p-6 flex flex-col justify-center">
          <RouterView />
        </div>
      </div>
    </template>
  </div>
</template>
