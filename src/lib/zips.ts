import zlib from "zlib"

export async function zip(hex: `0x${string}`): Promise<string> {
  const buffer = Buffer.from(hex.slice(2), "hex")
  const compressed = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(buffer, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  return compressed.toString("base64url")
}

export async function unzip(base64: string): Promise<`0x${string}`> {
  const buffer = Buffer.from(base64, "base64") // base64 is more compatible with browsers

  const decompressed = await new Promise<Buffer>((resolve, reject) => {
    zlib.gunzip(buffer, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  return ("0x" + decompressed.toString("hex")) as `0x${string}`
}
