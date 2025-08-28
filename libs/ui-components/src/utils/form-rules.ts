import { type FormInstance } from 'element-plus'
import { type Ref, type ShallowRef } from 'vue'

type ValidateFormResult = { isValid: boolean; fields: any }

/**
 * Валидация формы element-plus
 *
 * @param form - форма
 */
export const validateForm = async (
  form: Readonly<ShallowRef<FormInstance | null>> | Ref<FormInstance | undefined>
): Promise<ValidateFormResult> => {
  const result: ValidateFormResult = {
    isValid: false,
    fields: null
  }
  if (form === undefined) return result

  if (form.value) {
    await form.value.validate((v, f) => {
      result.isValid = v
      result.fields = f
    })
  }
  return result
}

/**
 * Правила валидации для форм element-plus
 */
export const simpleRules = {
  /** Обязательное поле. Триггер: уход с поля */
  requiredBlur: { required: true, message: 'Не может быть пустым', trigger: 'blur' },

  /** Обязательное поле. Триггер: изменение поля */
  requiredChange: { required: true, message: 'Не может быть пустым', trigger: 'change' },

  /** Больше нуля. Триггер: изменение поля */
  aboveZero: { type: 'number', min: 0.000_000_1, message: 'Больше 0', trigger: 'blur' },

  /** Контракт. Триггер: изменение поля */
  contract: {
    pattern: /(^1{4}$)|(^[3-9]\d{3}$)|(^[3-9]\d{3}-\d{1,3}$)|(^\d{3}гп$)|(^[3-9]\d{3}э$)/,
    message: 'Неверный формат (1111, 1111-1, 111гп, 1111э)',
    trigger: 'change'
  },

  /** Min-Max. Триггер: уход с поля */
  minMax: function (min: number, max: number) {
    return { min, max, message: `Длина от ${min} до ${max}`, trigger: 'blur' }
  },

  /** Целое число. Триггер: уход с поля */
  integer: {
    validator: (_rule: any, value: any, callback: (error?: string | Error) => void) => {
      if (Number.isInteger(value)) {
        callback()
      } else {
        callback(new Error('Не целое число'))
      }
    },
    trigger: 'blur'
  }
}
