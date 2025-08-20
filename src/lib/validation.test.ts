import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validateRequestBody, validateQuery } from './validation'

describe('validateRequestBody', () => {
  const schema = z.object({ name: z.string() })

  it('returns data when valid', () => {
    const data = validateRequestBody(schema, { name: 'test' })
    expect(data).toEqual({ name: 'test' })
  })

  it('throws error when invalid', () => {
    expect(() => validateRequestBody(schema, {})).toThrowError(/name/)
  })
})

describe('validateQuery', () => {
  const schema = z.object({ page: z.string() })

  it('parses query params', () => {
    const params = new URLSearchParams({ page: '1' })
    expect(validateQuery(schema, params)).toEqual({ page: '1' })
  })

  it('throws error when params invalid', () => {
    const params = new URLSearchParams()
    expect(() => validateQuery(schema, params)).toThrowError(/page/)
  })
})
