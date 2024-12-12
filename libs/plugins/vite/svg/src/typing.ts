export type DomInject = 'body-first' | 'body-last'

export interface ViteSvgIconsPlugin {
  /**
   * icons folder, all svg files in it will be converted to svg sprite.
   */
  iconDirs: string[]

  /**
   * icon format
   * @default: icon-[dir]-[name]
   */
  symbolId?: string

  /**
   * icon format
   * @default: body-last
   */
  inject?: DomInject

  /**
   * custom dom id
   * @default: __svg__icons__dom__
   */
  customDomId?: string
}

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}
