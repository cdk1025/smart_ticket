import { useFileStore } from '../useFileStore'
import type { UploadedFile } from '../../types'

// Mock URL.revokeObjectURL since jsdom doesn't fully support it
const revokeObjectURLSpy = vi.fn()
globalThis.URL.revokeObjectURL = revokeObjectURLSpy

function createMockFile(overrides: Partial<UploadedFile> = {}): UploadedFile {
  return {
    id: 'file-1',
    file: new File(['test'], 'test.png', { type: 'image/png' }),
    name: 'test.png',
    type: 'image',
    thumbnailUrl: 'blob:http://localhost/thumb-1',
    rotation: 0,
    ...overrides,
  }
}

describe('useFileStore', () => {
  beforeEach(() => {
    useFileStore.setState({
      files: [],
      mergedPdfUrl: null,
      mergedPdfBytes: null,
      isMerging: false,
    })
    revokeObjectURLSpy.mockClear()
  })

  describe('addFiles', () => {
    it('should add files to empty store', () => {
      const file1 = createMockFile({ id: 'f1', name: 'a.png' })
      const file2 = createMockFile({ id: 'f2', name: 'b.png' })

      useFileStore.getState().addFiles([file1, file2])

      const { files } = useFileStore.getState()
      expect(files).toHaveLength(2)
      expect(files[0].id).toBe('f1')
      expect(files[1].id).toBe('f2')
    })

    it('should append files to existing files', () => {
      const file1 = createMockFile({ id: 'f1' })
      useFileStore.setState({ files: [file1] })

      const file2 = createMockFile({ id: 'f2' })
      useFileStore.getState().addFiles([file2])

      expect(useFileStore.getState().files).toHaveLength(2)
    })
  })

  describe('removeFile', () => {
    it('should remove specified file by id', () => {
      const file1 = createMockFile({ id: 'f1' })
      const file2 = createMockFile({ id: 'f2' })
      useFileStore.setState({ files: [file1, file2] })

      useFileStore.getState().removeFile('f1')

      const { files } = useFileStore.getState()
      expect(files).toHaveLength(1)
      expect(files[0].id).toBe('f2')
    })

    it('should revoke thumbnail URL when removing file', () => {
      const file1 = createMockFile({ id: 'f1', thumbnailUrl: 'blob:http://localhost/thumb-1' })
      useFileStore.setState({ files: [file1] })

      useFileStore.getState().removeFile('f1')

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/thumb-1')
    })

    it('should do nothing if file id not found', () => {
      const file1 = createMockFile({ id: 'f1' })
      useFileStore.setState({ files: [file1] })

      useFileStore.getState().removeFile('nonexistent')

      expect(useFileStore.getState().files).toHaveLength(1)
    })
  })

  describe('reorderFiles', () => {
    it('should replace files array with new order', () => {
      const file1 = createMockFile({ id: 'f1' })
      const file2 = createMockFile({ id: 'f2' })
      const file3 = createMockFile({ id: 'f3' })
      useFileStore.setState({ files: [file1, file2, file3] })

      useFileStore.getState().reorderFiles([file3, file1, file2])

      const { files } = useFileStore.getState()
      expect(files[0].id).toBe('f3')
      expect(files[1].id).toBe('f1')
      expect(files[2].id).toBe('f2')
    })
  })

  describe('rotateFile', () => {
    it('should increment rotation by 90 degrees', () => {
      const file1 = createMockFile({ id: 'f1', rotation: 0 })
      useFileStore.setState({ files: [file1] })

      useFileStore.getState().rotateFile('f1')

      expect(useFileStore.getState().files[0].rotation).toBe(90)
    })

    it('should wrap rotation from 270 back to 0', () => {
      const file1 = createMockFile({ id: 'f1', rotation: 270 })
      useFileStore.setState({ files: [file1] })

      useFileStore.getState().rotateFile('f1')

      expect(useFileStore.getState().files[0].rotation).toBe(0)
    })

    it('should cycle through all rotation values', () => {
      const file1 = createMockFile({ id: 'f1', rotation: 0 })
      useFileStore.setState({ files: [file1] })

      const store = useFileStore.getState()
      store.rotateFile('f1')
      expect(useFileStore.getState().files[0].rotation).toBe(90)

      useFileStore.getState().rotateFile('f1')
      expect(useFileStore.getState().files[0].rotation).toBe(180)

      useFileStore.getState().rotateFile('f1')
      expect(useFileStore.getState().files[0].rotation).toBe(270)

      useFileStore.getState().rotateFile('f1')
      expect(useFileStore.getState().files[0].rotation).toBe(0)
    })

    it('should only rotate the targeted file', () => {
      const file1 = createMockFile({ id: 'f1', rotation: 0 })
      const file2 = createMockFile({ id: 'f2', rotation: 0 })
      useFileStore.setState({ files: [file1, file2] })

      useFileStore.getState().rotateFile('f1')

      expect(useFileStore.getState().files[0].rotation).toBe(90)
      expect(useFileStore.getState().files[1].rotation).toBe(0)
    })
  })

  describe('setMergedPdf', () => {
    it('should set merged PDF url and bytes', () => {
      const bytes = new Uint8Array([1, 2, 3])
      useFileStore.getState().setMergedPdf('blob:http://localhost/merged', bytes)

      const state = useFileStore.getState()
      expect(state.mergedPdfUrl).toBe('blob:http://localhost/merged')
      expect(state.mergedPdfBytes).toBe(bytes)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const file1 = createMockFile({ id: 'f1' })
      useFileStore.setState({
        files: [file1],
        mergedPdfUrl: 'blob:http://localhost/merged',
        mergedPdfBytes: new Uint8Array([1, 2, 3]),
        isMerging: true,
      })

      useFileStore.getState().reset()

      const state = useFileStore.getState()
      expect(state.files).toEqual([])
      expect(state.mergedPdfUrl).toBeNull()
      expect(state.mergedPdfBytes).toBeNull()
      expect(state.isMerging).toBe(false)
    })

    it('should revoke all thumbnail URLs and merged PDF URL', () => {
      const file1 = createMockFile({ id: 'f1', thumbnailUrl: 'blob:thumb1' })
      const file2 = createMockFile({ id: 'f2', thumbnailUrl: 'blob:thumb2' })
      useFileStore.setState({
        files: [file1, file2],
        mergedPdfUrl: 'blob:merged',
      })

      useFileStore.getState().reset()

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:thumb1')
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:thumb2')
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:merged')
    })
  })
})
