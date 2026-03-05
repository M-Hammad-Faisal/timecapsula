import { validateEmail, EMAIL_REGEX } from '../validation.js'

describe('validateEmail', () => {
  const valid = [
    'user@example.com',
    'hello+tag@sub.domain.org',
    'x@y.z',
    'name.surname@company.co.uk',
  ]

  const invalid = [
    '',
    'notanemail',
    '@nodomain.com',
    'missing@',
    'missing@domain',
    'space here@example.com',
    null,
    undefined,
    42,
  ]

  test.each(valid)('accepts valid email: %s', email => {
    expect(validateEmail(email)).toBe(true)
  })

  test.each(invalid)('rejects invalid input: %s', input => {
    expect(validateEmail(input)).toBe(false)
  })

  test('trims whitespace before testing', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true)
  })
})

describe('EMAIL_REGEX', () => {
  test('is a RegExp', () => {
    expect(EMAIL_REGEX).toBeInstanceOf(RegExp)
  })
})
