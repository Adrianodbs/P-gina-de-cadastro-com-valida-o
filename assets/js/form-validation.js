'use strict'
;(() => {
  const form = document.querySelector('[data-form]')

  const fields = {}

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
        element.classList.add('error')
        errorElement.style.display = 'block'
        errorElement.textContent = 'Este campo é obrigatório'
      }
    }

    return isInvalid
  }

  const onFormSubmit = event => {
    event.preventDefault()
    if (validateRequiredFields()) {
      return
    }
    alert('Dados prontos para serem enviados!')
  }

  const setListeners = () => {
    form.addEventListener('submit', onFormSubmit)
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
    setListeners()
  }

  init()
})()
