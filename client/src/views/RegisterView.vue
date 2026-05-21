<script setup lang="ts">
import { ref } from 'vue'
import useTitle from '@/composables/useTitle'
import useAuth from '@/composables/useAuth'

useTitle('Register')

const { register, isLoading } = useAuth()

const form = ref({
  name: '',
  email: '',
  password: '',
})

const handleRegister = async () => {
  await register(form.value)
}
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-3xl font-semibold text-gray-900 mb-2">Create Account</h2>
    <p class="text-sm text-gray-500 mb-8">Sign up to start managing your daily tasks.</p>

    <form class="space-y-6" @submit.prevent="handleRegister">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="Your Name"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm placeholder-gray-400"
          required
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="form.email"
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
          v-model="form.password"
          type="password"
          id="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm placeholder-gray-400 tracking-widest"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 text-white bg-primary hover:bg-blue-700 rounded-md transition-colors font-medium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Register</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="mt-8 border-t border-gray-200 pt-6 text-center text-sm">
      <span class="text-gray-500">Already have an account? </span>
      <router-link to="/login" class="text-primary font-semibold hover:underline">
        Login Here
      </router-link>
    </div>
  </div>
</template>
