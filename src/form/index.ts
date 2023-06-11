const dataSent = true

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T & { value: string }
}

interface createFormProps {
  labelText: string
  labelName: string
  type?: string
  placeholder: string
  maxLength?: number
  mask?: typeof maskCPF
  change: typeof onChangeName
}

const createFormInput = ({
  labelText,
  labelName,
  type,
  placeholder,
  maxLength,
  mask = (value: string) => value,
  change,
}: createFormProps) => {
  const label = document.createElement('label')
  label.classList.add('form__wrapper--label')
  label.textContent = labelText
  label.setAttribute('for', `${labelName}`)

  const input = document.createElement('input')
  input.classList.add('form__wrapper--input')
  input.setAttribute('id', `${labelName}`)
  input.setAttribute('type', `${type}`)
  input.setAttribute('placeholder', `${placeholder}`)
  if (maxLength) input.setAttribute('maxLength', `${maxLength}`)

  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    const value = mask(target.value)
    change(value)
    input.value = value
  })

  const feedback = document.createElement('span')
  feedback.classList.add('form__wrapper--feedback')

  const wrapper = document.createElement('div')
  wrapper.classList.add('form__wrapper')
  wrapper.appendChild(label)
  wrapper.appendChild(input)

  const setStatus = (status: 'default' | 'error' | 'success', message?: string) => {
    if (status === 'default') feedback.remove()

    if (status === 'error') {
      if (message) feedback.textContent = message
      wrapper.appendChild(feedback)
      feedback.classList.add('form__wrapper--error')
      feedback.classList.remove('form__wrapper--success')
    }

    if (status === 'success') {
      if (message) feedback.textContent = message
      wrapper.appendChild(feedback)
      feedback.classList.add('form__wrapper--success')
      feedback.classList.remove('form__wrapper--error')
    }
  }

  const resetValue = () => {
    input.value = ''
    setStatus('default')
  }

  return { wrapper, setStatus, resetValue }
}

const createFormLine = () => {
  const line = document.createElement('div')
  line.classList.add('form__line')
  return line
}

const createFormMessageSubmit = (message: string) => {
  const text = document.createElement('span')
  text.classList.add('form__message-wrapper--text')
  text.textContent = message

  const wrapper = document.createElement('div')
  wrapper.classList.add('form__message-wrapper')
  wrapper.appendChild(text)
  return wrapper
}

let nameValue = ''
let cpfValue = ''
let cnpjValue = ''
let emailValue = ''
let phoneValue = ''

const onChangeName = (value: string) => (nameValue = value)
const onChangeCPF = (value: string) => (cpfValue = value)
const onChangeCNPJ = (value: string) => (cnpjValue = value)
const onChangeEmail = (value: string) => (emailValue = value)
const onChangePhone = (value: string) => (phoneValue = value)

const validateName = (value: string) => value.length > 2
const validateCPF = (value: string) => value.length === 14
const validateCNPJ = (value: string) => value.length === 18
const validateEmail = (value: string) => value.includes('@') && value.includes('.com')
const validatePhone = (value: string) => value.length === 14 || value.length === 15

const maskCPF = (value: string): string => {
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1-$2')
  return value
}

const maskCNPJ = (value: string): string => {
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1/$2')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')
  return value
}

const maskPhone = (value: string): string => {
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}

const createForm = () => {
  const name = createFormInput({
    labelText: 'Digite o seu nome:',
    labelName: 'name',
    placeholder: 'Digite o seu nome',
    change: onChangeName,
  })

  const cpf = createFormInput({
    labelText: 'Digite o CPF',
    labelName: 'cpf',
    placeholder: 'Digite o CPF',
    maxLength: 14,
    change: onChangeCPF,
    mask: maskCPF,
  })

  const cnpj = createFormInput({
    labelText: 'Digite o CNPJ',
    labelName: 'cnpj',
    placeholder: 'Digite o CNPJ',
    maxLength: 18,
    change: onChangeCNPJ,
    mask: maskCNPJ,
  })

  const email = createFormInput({
    labelText: 'Digite o e-mail',
    labelName: 'email',
    type: 'email',
    placeholder: 'Digite o e-mail',
    change: onChangeEmail,
  })

  const phone = createFormInput({
    labelText: 'Digite o telefone',
    labelName: 'phone',
    type: 'tel',
    placeholder: 'Digite o telefone',
    maxLength: 15,
    change: onChangePhone,
    mask: maskPhone,
  })

  const line1 = createFormLine()
  line1.appendChild(name.wrapper)
  line1.appendChild(cpf.wrapper)

  const line2 = createFormLine()
  line2.classList.add('form__line-2')
  line2.appendChild(cnpj.wrapper)
  line2.appendChild(email.wrapper)
  line2.appendChild(phone.wrapper)

  const buttonSubmit = document.createElement('button')
  buttonSubmit.classList.add('form__button')
  buttonSubmit.textContent = 'Enviar'

  const buttonBack = document.createElement('button')
  buttonBack.classList.add('form__button')
  buttonBack.textContent = 'Voltar'

  const loading = document.createElement('img')
  loading.classList.add('form__loading')
  loading.setAttribute('src', 'loading.svg')

  buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault()

    const isValidName = validateName(nameValue)
    const isValidCpf = validateCPF(cpfValue)
    const isValidCnpj = validateCNPJ(cnpjValue)
    const isValidEmail = validateEmail(emailValue)
    const isValidPhone = validatePhone(phoneValue)

    isValidName ? name.setStatus('success', 'Dado válido') : name.setStatus('error', 'Digite um nome válido')
    isValidCpf ? cpf.setStatus('success', 'Dado válido') : cpf.setStatus('error', 'Digite um CPF válido')
    isValidCnpj ? cnpj.setStatus('success', 'Dado válido') : cnpj.setStatus('error', 'Digite um CNPJ válido')
    isValidEmail ? email.setStatus('success', 'Dado válido') : email.setStatus('error', 'Digite um e-mail válido')
    isValidPhone ? phone.setStatus('success', 'Dado válido') : phone.setStatus('error', 'Digite um telefone válido')

    if (isValidName && isValidCpf && isValidCnpj && isValidEmail && isValidPhone) {
      buttonSubmit.remove()
      form.appendChild(loading)

      setTimeout(() => {
        form.innerHTML = ''

        if (dataSent) {
          const text = createFormMessageSubmit('Parabéns, seu formulário foi enviado com sucesso')
          form.appendChild(text)
        } else {
          const text = createFormMessageSubmit('Sinto muito, seu formulário não foi enviado com sucesso, tente novamente mais tarde')
          form.appendChild(text)
        }

        form.appendChild(buttonBack)
      }, 2000)
    }
  })

  const clearForm = () => {
    nameValue = ''
    cpfValue = ''
    cnpjValue = ''
    emailValue = ''
    phoneValue = ''
    name.resetValue()
    cpf.resetValue()
    cnpj.resetValue()
    email.resetValue()
    phone.resetValue()
  }

  buttonBack.addEventListener('click', (e) => {
    e.preventDefault()

    form.innerHTML = ''
    form.appendChild(line1)
    form.appendChild(line2)
    form.appendChild(buttonSubmit)
    clearForm()
  })

  const form = document.createElement('form')
  form.classList.add('form')
  form.appendChild(line1)
  form.appendChild(line2)
  form.appendChild(buttonSubmit)
  return form
}

const renderForm = () => {
  const $container = document.querySelector('.container')
  if (!$container) return

  const form = createForm()
  $container.appendChild(form)
}

renderForm()
