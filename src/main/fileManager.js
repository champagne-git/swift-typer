import fs from 'fs'
import { join } from 'path'
import iconv from 'iconv-lite'

export class FileManager {
  constructor(userFolderPath) {
    this.userFolderPath = userFolderPath
    this.fileEncodings = new Map()
    this.ensureUserFolder()
  }

  ensureUserFolder() {
    if (!fs.existsSync(this.userFolderPath)) {
      fs.mkdirSync(this.userFolderPath, { recursive: true })
    }
  }

  getFilePath(filename) {
    return join(this.userFolderPath, filename)
  }

  async getFiles() {
    const files = await fs.promises.readdir(this.userFolderPath)
    return files.filter((file) => fs.statSync(this.getFilePath(file)).isFile())
  }

  detectFileEncoding(filePath) {
    const buffer = fs.readFileSync(filePath)

    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      return 'utf8'
    }

    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return 'utf16le'
    }
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      return 'utf16be'
    }

    try {
      const text = buffer.toString('utf8')
      if (text.includes('�')) {
        return 'gb2312'
      }
      return 'utf8'
    } catch {
      return 'gb2312'
    }
  }

  async getFileInfo(filename) {
    const filePath = this.getFilePath(filename)
    const stats = await fs.promises.stat(filePath)
    const encoding = this.fileEncodings.get(filename) || this.detectFileEncoding(filePath)
    return {
      size: stats.size,
      filename,
      encoding
    }
  }

  async readFileChunk(filename, start, end, encoding) {
    const filePath = this.getFilePath(filename)
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, { start, end })

      let chunks = []
      stream.on('data', (chunk) => {
        chunks.push(chunk)
      })

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const content = iconv.decode(buffer, encoding)
        resolve(content)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    })
  }

  saveFileEncoding(filename, encoding) {
    this.fileEncodings.set(filename, encoding)
  }

  getFileEncoding(filename) {
    return this.fileEncodings.get(filename) || this.detectFileEncoding(this.getFilePath(filename))
  }
}
