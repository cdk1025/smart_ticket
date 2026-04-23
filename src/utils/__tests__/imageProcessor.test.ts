import { fitToA4 } from '../imageProcessor'

// Constants matching imageProcessor.ts
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const MARGIN = 20
const USABLE_WIDTH = A4_WIDTH - MARGIN * 2   // 555.28
const USABLE_HEIGHT = A4_HEIGHT - MARGIN * 2 // 801.89

describe('fitToA4', () => {
  it('should fit a landscape image (width > height) correctly', () => {
    const result = fitToA4(1000, 500)

    // scale = min(555.28/1000, 801.89/500, 1) = min(0.55528, 1.60378, 1) = 0.55528
    expect(result.width).toBeCloseTo(555.28, 1)
    expect(result.height).toBeCloseTo(277.64, 1)
    // Should not exceed usable area
    expect(result.width).toBeLessThanOrEqual(USABLE_WIDTH + 0.01)
    expect(result.height).toBeLessThanOrEqual(USABLE_HEIGHT + 0.01)
  })

  it('should fit a portrait image (height > width) correctly', () => {
    const result = fitToA4(500, 1000)

    // scale = min(555.28/500, 801.89/1000, 1) = min(1.11056, 0.80189, 1) = 0.80189
    expect(result.width).toBeCloseTo(400.945, 1)
    expect(result.height).toBeCloseTo(801.89, 1)
    expect(result.width).toBeLessThanOrEqual(USABLE_WIDTH + 0.01)
    expect(result.height).toBeLessThanOrEqual(USABLE_HEIGHT + 0.01)
  })

  it('should center a square image correctly', () => {
    const result = fitToA4(800, 800)

    // scale = min(555.28/800, 801.89/800, 1) = min(0.6941, 1.0024, 1) = 0.6941
    expect(result.width).toBeCloseTo(result.height, 1)

    // Check centering: x should be MARGIN + (USABLE_WIDTH - width) / 2
    const expectedX = MARGIN + (USABLE_WIDTH - result.width) / 2
    const expectedY = MARGIN + (USABLE_HEIGHT - result.height) / 2
    expect(result.x).toBeCloseTo(expectedX, 2)
    expect(result.y).toBeCloseTo(expectedY, 2)
  })

  it('should not upscale small images beyond original size', () => {
    const result = fitToA4(100, 100)

    // scale = min(555.28/100, 801.89/100, 1) = min(5.5528, 8.0189, 1) = 1
    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
  })

  it('should center small images on the page', () => {
    const result = fitToA4(100, 100)

    const expectedX = MARGIN + (USABLE_WIDTH - 100) / 2
    const expectedY = MARGIN + (USABLE_HEIGHT - 100) / 2
    expect(result.x).toBeCloseTo(expectedX, 2)
    expect(result.y).toBeCloseTo(expectedY, 2)
  })

  it('should handle extreme wide aspect ratio without exceeding usable area', () => {
    const result = fitToA4(5000, 100)

    // scale = min(555.28/5000, 801.89/100, 1) = min(0.111056, 8.0189, 1) = 0.111056
    expect(result.width).toBeCloseTo(555.28, 1)
    expect(result.height).toBeLessThanOrEqual(USABLE_HEIGHT + 0.01)
    expect(result.width).toBeLessThanOrEqual(USABLE_WIDTH + 0.01)
  })

  it('should handle extreme tall aspect ratio without exceeding usable area', () => {
    const result = fitToA4(100, 5000)

    // scale = min(555.28/100, 801.89/5000, 1) = min(5.5528, 0.160378, 1) = 0.160378
    expect(result.height).toBeCloseTo(801.89, 1)
    expect(result.width).toBeLessThanOrEqual(USABLE_WIDTH + 0.01)
    expect(result.height).toBeLessThanOrEqual(USABLE_HEIGHT + 0.01)
  })

  it('should return x, y that ensure centered positioning', () => {
    const result = fitToA4(800, 600)

    // Verify centering formula
    expect(result.x).toBeCloseTo(MARGIN + (USABLE_WIDTH - result.width) / 2, 5)
    expect(result.y).toBeCloseTo(MARGIN + (USABLE_HEIGHT - result.height) / 2, 5)

    // Verify the image stays within page bounds
    expect(result.x).toBeGreaterThanOrEqual(MARGIN)
    expect(result.y).toBeGreaterThanOrEqual(MARGIN)
    expect(result.x + result.width).toBeLessThanOrEqual(A4_WIDTH - MARGIN + 0.01)
    expect(result.y + result.height).toBeLessThanOrEqual(A4_HEIGHT - MARGIN + 0.01)
  })

  it('should handle image exactly matching usable area dimensions', () => {
    const result = fitToA4(USABLE_WIDTH, USABLE_HEIGHT)

    // scale = min(1, 1, 1) = 1
    expect(result.width).toBeCloseTo(USABLE_WIDTH, 2)
    expect(result.height).toBeCloseTo(USABLE_HEIGHT, 2)
    expect(result.x).toBeCloseTo(MARGIN, 2)
    expect(result.y).toBeCloseTo(MARGIN, 2)
  })
})
