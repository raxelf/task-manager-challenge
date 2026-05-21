<script setup lang="ts">
import useTitle from '@/composables/useTitle'

useTitle('Login')
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h2>
    <p class="text-sm text-gray-500 mb-8">Please enter your details to access your dashboard.</p>

    <form class="space-y-6" @submit.prevent>
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          placeholder="name@company.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm placeholder-gray-400"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm placeholder-gray-400 tracking-widest"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full py-2.5 px-4 text-white bg-primary hover:bg-blue-700 rounded-md transition-colors font-medium cursor-pointer"
      >
        Login
      </button>
    </form>

    <!-- Divider -->
    <div class="mt-8 border-t border-gray-200 pt-6 text-center text-sm">
      <span class="text-gray-500">Don't have an account? </span>
      <router-link to="/register" class="text-primary font-semibold hover:underline">
        Create Account
      </router-link>
    </div>
  </div>
</template>
