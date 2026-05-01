import PDFParser from "pdf2json";

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

parser.on("pdfParser_dataError", (errMsg: Error | { parserError: Error; }) => {
  if ('parserError' in errMsg) {
    reject(new Error(errMsg.parserError.message));
  } else {
    reject(errMsg);
  }
});

    parser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfData.Pages.flatMap((page: any) =>
        page.Texts.map((t: any) =>
          decodeURIComponent(t.R.map((r: any) => r.T).join(""))
        )
      )
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!text || text.length < 50) {
        reject(new Error("Could not extract text from PDF. Make sure it's not a scanned image."));
        return;
      }

      resolve(text);
    });

    parser.parseBuffer(buffer);
  });
};