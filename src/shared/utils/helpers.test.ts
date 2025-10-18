import { describe, it, expect } from 'vitest'
import { sum, formatUserName, validateEmail, formatAge } from './helpers'

describe('Utility Functions', () => {
  describe('sum', () => {
    it('should add two positive numbers correctly', () => {
      expect(sum(2, 3)).toBe(5)
    })

    it('should handle negative numbers', () => {
      expect(sum(-1, 5)).toBe(4)
      expect(sum(-3, -7)).toBe(-10)
    })

    it('should handle zero', () => {
      expect(sum(0, 5)).toBe(5)
      expect(sum(10, 0)).toBe(10)
    })
  })

  describe('formatUserName', () => {
    it('should format user name correctly', () => {
      expect(formatUserName('太郎', '田中')).toBe('田中 太郎')
      expect(formatUserName('花子', '佐藤')).toBe('佐藤 花子')
    })

    it('should handle empty strings', () => {
      expect(formatUserName('', '田中')).toBe('田中 ')
      expect(formatUserName('太郎', '')).toBe(' 太郎')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.jp')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('formatAge', () => {
    it('should format age correctly', () => {
      expect(formatAge(25)).toBe('25歳')
      expect(formatAge(0)).toBe('0歳')
    })

    it('should handle null and undefined', () => {
      expect(formatAge(null)).toBe('未入力')
      expect(formatAge(undefined as any)).toBe('未入力')
    })
  })
})