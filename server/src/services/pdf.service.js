import fs from 'fs';
import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    try {
      const pdfData = await pdfParse(dataBuffer);
      if (pdfData && pdfData.text && pdfData.text.trim().length > 0) {
        return {
          text: pdfData.text.trim(),
          numPages: pdfData.numpages || 1,
          info: pdfData.info || {}
        };
      }
    } catch (pdfErr) {
      console.warn('pdf-parse failed on buffer. Attempting UTF-8 text extraction fallback:', pdfErr.message);
    }

    // Fallback: If uploaded file is plain text or synthetic text stream
    const rawText = dataBuffer.toString('utf-8').trim();
    if (rawText && rawText.length > 5) {
      return {
        text: rawText,
        numPages: 1,
        info: {}
      };
    }

    throw new Error('Could not extract readable text from the uploaded PDF file.');
  } catch (error) {
    console.error('Error parsing PDF text:', error);
    throw new Error('Failed to parse text from the uploaded PDF file.');
  }
};
