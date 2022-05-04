'use strict'
;(() => {
  const form = document.querySelector('[data-form]')

  const progressBar = document.querySelector('[data-requirement-progressbar]')

  const fields = {}
  const requirements = {}

  const state = { passwordStrength: 0 }

  const styleProgressbar = () => {
    progressBar.style.width = `${state.passwordStrength}%`
    progressBar.dataset['percentage'] = state.passwordStrength
  }

  const showMessageError = (field, message) => {
    const { element, errorElement } = field
    element.classList.add('error')
    errorElement.style.display = 'block'
    errorElement.textContent = message
  }

  const hideMessageError = field => {
    const { element, errorElement } = field
    element.classList.remove('error')
    errorElement.style.display = 'none'
    errorElement.textContent = ''
  }

  const validateRequiredFields = () => {
    let isInvalid = false
    for (const fieldKey in fields) {
      const field = fields[fieldKey]
      const { element, errorElement, isRequired } = field
      if (
        (!element.value || (fieldKey === 'terms' && !element.checked)) &&
        isRequired
      ) {
        isInvalid = true

        showMessageError(field, 'Este campo é obrigatório')
      }
    }

    return isInvalid
  }

  const validatePasswordStrength = () => {
    let isInvalid = false
    const field = fields['password']
    if (state.passwordStrength < 100) {
      isInvalid = true
      showMessageError(field, 'digite uma senha válida')
    }

    return isInvalid
  }

  const onInputPasswordKeyup = event => {
    const { value } = event.target

    const lowerCasePattern = new RegExp(/[a-z]/)
    const upperCasePattern = new RegExp(/[A-Z]+/)
    const numberPattern = new RegExp(/[0-9]+/)
    const specialCharacterPattern = new RegExp(
      /[!"#$%&'()*+\,\./:;<=>?@[\]^_`{|}~-]+/
    )

    state.passwordStrength = 0

    if (value.match(lowerCasePattern) && value.match(upperCasePattern)) {
      state.passwordStrength += 25
      requirements['lowerUpperCase'].classList.add('checked')
    } else {
      requirements['lowerUpperCase'].classList.remove('checked')
    }

    if (value.match(numberPattern)) {
      state.passwordStrength += 25
      requirements['number'].classList.add('checked')
    } else {
      requirements['number'].classList.remove('checked')
    }

    if (value.match(specialCharacterPattern)) {
      state.passwordStrength += 25
      requirements['specialCharacter'].classList.add('checked')
    } else {
      requirements['specialCharacter'].classList.remove('checked')
    }

    if (value.length >= 8) {
      state.passwordStrength += 25
      requirements['minCharacter'].classList.add('checked')
    } else {
      requirements['minCharacter'].classList.remove('checked')
    }

    styleProgressbar()
  }

  const onInputFocus = event => {
    const field = fields[event.target.name]
    hideMessageError(field)
  }

  const onFormSubmit = event => {
    event.preventDefault()
    if (validateRequiredFields()) return
    if (validatePasswordStrength()) return

    alert('Dados prontos para serem enviados!')
  }

  const setListeners = () => {
    form.addEventListener('submit', onFormSubmit)
    for (const fieldKey in fields) {
      const { element } = fields[fieldKey]
      element.addEventListener('focus', onInputFocus)
      if (fieldKey === 'password')
        element.addEventListener('keyup', onInputPasswordKeyup)
    }
  }

  const setRequirementsItemsElements = () => {
    const requirementItemsElements = document.querySelectorAll(
      '[data-requirement-item]'
    )
    for (const requirementItem of requirementItemsElements) {
      const requirementName = requirementItem.dataset['requirementItem']
      requirements[requirementName] = requirementItem
    }
  }

  const setFieldElements = () => {
    const inputElements = document.querySelectorAll('[data-input]')
    for (const input of inputElements) {
      const inputName = input.getAttribute('name')
      fields[inputName] = {
        element: input,
        errorElement: input.parentElement.querySelector('[data-error-message]'),
        isRequired: input.hasAttribute('required')
      }
      input.removeAttribute('required')
    }
  }

  const init = () => {
    setFieldElements()
    setRequirementsItemsElements()
    setListeners()
  }

  init()
})()
