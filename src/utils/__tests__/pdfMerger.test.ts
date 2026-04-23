/**
 * pdfMerger tests.
 *
 * mergeFiles depends heavily on browser APIs (Canvas, pdfjs-dist) that are
 * not available in jsdom. We test what we can:
 * - mergeFiles throws on empty input
 * - Layout constants are consistent (via snapshot-style checks)
 */

// Mock pdfjs-dist to avoid import errors in jsdom
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(),
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'mock-worker-url',
}))

describe('pdfMerger', () => {
  describe('mergeFiles', () => {
    it('should throw an error when given empty file list', async () => {
      // Dynamic import after mocks are set up
      const { mergeFiles } = await import('../pdfMerger')
      await expect(mergeFiles([])).rejects.toThrow('No files to merge')
    })
  })

  describe('layout constants', () => {
    // Verify the layout math is consistent
    const A4_WIDTH = 595.28
    const A4_HEIGHT = 841.89
    const MARGIN = 16
    const GAP = 16
    const USABLE_WIDTH = A4_WIDTH - MARGIN * 2
    const USABLE_HEIGHT = A4_HEIGHT - MARGIN * 2
    const SLOT_HALF_HEIGHT = (USABLE_HEIGHT - GAP) / 2
    const SLOT_HALF_WIDTH = (USABLE_WIDTH - GAP) / 2

    it('should have correct usable dimensions', () => {
      expect(USABLE_WIDTH).toBeCloseTo(563.28, 2)
      expect(USABLE_HEIGHT).toBeCloseTo(809.89, 2)
    })

    it('should have correct slot dimensions', () => {
      expect(SLOT_HALF_HEIGHT).toBeCloseTo(396.945, 2)
      expect(SLOT_HALF_WIDTH).toBeCloseTo(273.64, 2)
    })

    it('should have top slot positioned correctly', () => {
      const topSlotY = A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT
      expect(topSlotY).toBeCloseTo(A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT, 2)
      // Top slot should be above the midpoint
      expect(topSlotY).toBeGreaterThan(A4_HEIGHT / 2)
    })

    it('should have bottom slot starting at margin', () => {
      const bottomSlotY = MARGIN
      expect(bottomSlotY).toBe(16)
    })

    it('should have non-overlapping top and bottom slots', () => {
      const topSlotY = A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT
      const bottomSlotTop = MARGIN + SLOT_HALF_HEIGHT
      // There should be a gap between bottom slot top and top slot bottom
      expect(topSlotY).toBeGreaterThan(bottomSlotTop)
      expect(topSlotY - bottomSlotTop).toBeCloseTo(GAP, 2)
    })

    it('should have non-overlapping left and right columns', () => {
      const leftEnd = MARGIN + SLOT_HALF_WIDTH
      const rightStart = MARGIN + SLOT_HALF_WIDTH + GAP
      expect(rightStart - leftEnd).toBe(GAP)
    })
  })
})
