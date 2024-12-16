declare module 'pdf-parse' {
    interface PdfMeta {
      title?: string;
      author?: string;
      subject?: string;
      keywords?: string;
      creator?: string;
      producer?: string;
      creationDate?: string;
      modDate?: string;
      trapped?: string;
    }
  
    interface PdfInfo {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      Producer: string;
      CreationDate: string;
      ModDate: string;
    }
  
    interface PdfParseResult {
      numpages: number;
      numrender: number;
      info: PdfInfo;
      metadata: PdfMeta | null;
      text: string;
      version: string;
    }
  
    function pdf(data: Buffer | Uint8Array | ArrayBuffer): Promise<PdfParseResult>;
  
    export = pdf;
  }
  