export interface ISummarizedMetadata {
  title: string,
  canonical: string,
  type: string,
  lang?: string,
  icon?: string,
  image?: string,
  description?: string,
  site_name?: string,
}

export interface IRiassumereOptionObject {
  url: string,
  lang?: string
}
export type TRiassumereOption = string | IRiassumereOptionObject

export type TSummarizeProvider = (url:string , lang?: string, ...opts: any[]) => Promise<ISummarizedMetadata>
export type TSummarizeProviders = Map<RegExp, TSummarizeProvider>
