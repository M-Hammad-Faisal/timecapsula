import { computeDeliveryDate } from '../delivery.js'

describe('computeDeliveryDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
  })
  afterEach(() => jest.useRealTimers())

  test('returns null for unknown `when` value', () => {
    expect(computeDeliveryDate('unknown')).toBeNull()
  })

  test('returns null for custom without a date', () => {
    expect(computeDeliveryDate('custom')).toBeNull()
  })

  test('returns null for custom with invalid date string', () => {
    expect(computeDeliveryDate('custom', 'not-a-date')).toBeNull()
  })

  test('1w adds 7 days', () => {
    const result = computeDeliveryDate('1w')
    expect(result.toISOString().startsWith('2025-01-08')).toBe(true)
  })

  test('1m adds 1 month', () => {
    const result = computeDeliveryDate('1m')
    expect(result.toISOString().startsWith('2025-02-01')).toBe(true)
  })

  test('3m adds 3 months', () => {
    const result = computeDeliveryDate('3m')
    expect(result.toISOString().startsWith('2025-04-01')).toBe(true)
  })

  test('6m adds 6 months', () => {
    const result = computeDeliveryDate('6m')
    expect(result.toISOString().startsWith('2025-07-01')).toBe(true)
  })

  test('1y adds 1 year', () => {
    const result = computeDeliveryDate('1y')
    expect(result.toISOString().startsWith('2026-01-01')).toBe(true)
  })

  test('10y adds 10 years', () => {
    const result = computeDeliveryDate('10y')
    expect(result.toISOString().startsWith('2035-01-01')).toBe(true)
  })

  test('50y adds 50 years', () => {
    const result = computeDeliveryDate('50y')
    expect(result.toISOString().startsWith('2075-01-01')).toBe(true)
  })

  test('custom with valid ISO date returns that date', () => {
    const result = computeDeliveryDate('custom', '2030-06-15')
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2030)
    expect(result.getMonth()).toBe(5) // June = 5
  })
})
