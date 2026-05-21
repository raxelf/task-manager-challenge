import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

/**
 *
 * @param title
 */
const useTitle = (title: MaybeRefOrGetter<string>) => {
  watchEffect(() => {
    const titleValue = toValue(title)

    document.title = titleValue ? `${titleValue} | Task Manager` : 'Task Manager'
  })
}

export default useTitle
