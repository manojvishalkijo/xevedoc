import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { LLMService, DocumentAnalysis } from './llmService';

export class DocumentProcessor {
  private llmService: LLMService;
  private ocrWorker: any;

  constructor() {
    this.llmService = new LLMService();
    this.initializeOCR();
  }

  private async initializeOCR() {
    try {
      this.ocrWorker = await createWorker('eng');
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
    }
  }

  async processDocument(filePath: string): Promise<ProcessedDocument> {
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      const fileName = path.basename(filePath);
      
      console.log(`Processing document: ${fileName}`);

      let extractedText = '';
      let processingMethod = '';

      // Extract text based on file type
      switch (fileExtension) {
        case '.pdf':
          extractedText = await this.extractTextFromPDF(filePath);
          processingMethod = 'PDF Parser';
          break;
        case '.docx':
        case '.doc':
          extractedText = await this.extractTextFromWord(filePath);
          processingMethod = 'Word Parser';
          break;
        case '.txt':
          extractedText = await this.extractTextFromTxt(filePath);
          processingMethod = 'Text Reader';
          break;
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
        case '.bmp':
          extractedText = await this.extractTextFromImage(filePath);
          processingMethod = 'OCR';
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the document');
      }

      console.log(`Extracted ${extractedText.length} characters using ${processingMethod}`);

      // Analyze document with LLM
      const analysis = await this.llmService.analyzeDocument(extractedText);
      const category = await this.llmService.categorizeDocument(extractedText);
      const summary = await this.llmService.summarizeDocument(extractedText);
      const extractedData = await this.llmService.extractKeyInformation(extractedText, category.category);

      const processedDocument: ProcessedDocument = {
        id: this.generateId(),
        fileName,
        filePath,
        fileType: fileExtension,
        fileSize: this.getFileSize(filePath),
        processingMethod,
        extractedText,
        analysis,
        category: category.category,
        categoryConfidence: category.confidence,
        summary,
        extractedData,
        processedAt: new Date().toISOString(),
        status: 'completed'
      };

      return processedDocument;

    } catch (error) {
      console.error(`Error processing document ${filePath}:`, error);
      
      return {
        id: this.generateId(),
        fileName: path.basename(filePath),
        filePath,
        fileType: path.extname(filePath).toLowerCase(),
        fileSize: this.getFileSize(filePath),
        processingMethod: 'Failed',
        extractedText: '',
        analysis: null,
        category: 'Error',
        categoryConfidence: 0,
        summary: `Failed to process: ${error.message}`,
        extractedData: null,
        processedAt: new Date().toISOString(),
        status: 'failed',
        error: error.message
      };
    }
  }

  async processBatch(filePaths: string[]): Promise<ProcessedDocument[]> {
    const results: ProcessedDocument[] = [];
    
    for (const filePath of filePaths) {
      try {
        const result = await this.processDocument(filePath);
        results.push(result);
      } catch (error) {
        console.error(`Batch processing error for ${filePath}:`, error);
        results.push({
          id: this.generateId(),
          fileName: path.basename(filePath),
          filePath,
          fileType: path.extname(filePath).toLowerCase(),
          fileSize: 0,
          processingMethod: 'Failed',
          extractedText: '',
          analysis: null,
          category: 'Error',
          categoryConfidence: 0,
          summary: `Batch processing failed: ${error.message}`,
          extractedData: null,
          processedAt: new Date().toISOString(),
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }

  private async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  private async extractTextFromWord(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  private async extractTextFromTxt(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async extractTextFromImage(filePath: string): Promise<string> {
    if (!this.ocrWorker) {
      throw new Error('OCR worker not initialized');
    }

    try {
      // Optimize image for OCR
      const optimizedImagePath = await this.optimizeImageForOCR(filePath);
      
      // Perform OCR
      const { data: { text } } = await this.ocrWorker.recognize(optimizedImagePath);
      
      // Clean up temporary file if created
      if (optimizedImagePath !== filePath) {
        fs.unlinkSync(optimizedImagePath);
      }
      
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  private async optimizeImageForOCR(filePath: string): Promise<string> {
    try {
      const tempPath = path.join(path.dirname(filePath), `temp_${Date.now()}_${path.basename(filePath)}.png`);
      
      await sharp(filePath)
        .resize(null, 2000, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .greyscale()
        .normalize()
        .sharpen()
        .png({ quality: 100 })
        .toFile(tempPath);
      
      return tempPath;
    } catch (error) {
      console.error('Image optimization error:', error);
      return filePath; // Return original if optimization fails
    }
  }

  private getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async cleanup() {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate();
    }
  }
}

// Type definitions
export interface ProcessedDocument {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  processingMethod: string;
  extractedText: string;
  analysis: DocumentAnalysis | null;
  category: string;
  categoryConfidence: number;
  summary: string;
  extractedData: any;
  processedAt: string;
  status: 'completed' | 'failed' | 'processing';
  error?: string;
}