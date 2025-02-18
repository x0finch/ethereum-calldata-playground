import zlib from "zlib"

export async function zip(hex: `0x${string}`): Promise<string> {
  const buffer = Buffer.from(hex.slice(2), "hex")
  const compressed = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(buffer, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  return base64UrlEncode(compressed.toString("base64"))
}

function base64UrlEncode(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
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
