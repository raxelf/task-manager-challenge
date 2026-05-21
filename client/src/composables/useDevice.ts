import { ref, onMounted, onUnmounted } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDevice() {
  const device = ref<DeviceType>('desktop')

  const updateDevice = () => {
    const width = window.innerWidth
    if (width < 768) {
      device.value = 'mobile'
    } else if (width >= 768 && width < 1024) {
      device.value = 'tablet'
    } else {
      device.value = 'desktop'
    }
  }

  onMounted(() => {
    updateDevice()
    window.addEventListener('resize', updateDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDevice)
  })

  return { device }
}
