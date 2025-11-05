declare module 'tga' {
  interface TGAOptions {
    width: number
    height: number
    pixels: Buffer
    isRLE?: boolean
  }

  class TGA {
    constructor(options: TGAOptions)
    data: Buffer
  }

  export default TGA
}
