import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { ProcessedDocument } from './documentProcessor';

export class ExportService {
  
  async exportToExcel(documents: ProcessedDocument[]): Promise<Buffer> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Create summary sheet
      const summaryData = documents.map(doc => ({
        'File Name': doc.fileName,
        'Category': doc.category,
        'Confidence': `${(doc.categoryConfidence * 100).toFixed(1)}%`,
        'File Size (KB)': Math.round(doc.fileSize / 1024),
        'Processing Method': doc.processingMethod,
        'Status': doc.status,
        'Processed At': new Date(doc.processedAt).toLocaleString(),
        'Summary': doc.summary?.substring(0, 200) + (doc.summary?.length > 200 ? '...' : '')
      }));
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // Create detailed data sheet
      const detailedData = [];
      documents.forEach(doc => {
        if (doc.extractedData && doc.extractedData.entities) {
          doc.extractedData.entities.forEach(entity => {
            detailedData.push({
              'File Name': doc.fileName,
              'Category': doc.category,
              'Entity Type': entity.type,
              'Entity Value': entity.value,
              'Confidence': `${(entity.confidence * 100).toFixed(1)}%`
            });
          });
        }
        
        // Add key-value pairs
        if (doc.extractedData && doc.extractedData.keyValues) {
          Object.entries(doc.extractedData.keyValues).forEach(([key, value]) => {
            if (value) {
              detailedData.push({
                'File Name': doc.fileName,
                'Category': doc.category,
                'Entity Type': 'Key-Value',
                'Entity Value': `${key}: ${value}`,
                'Confidence': '100.0%'
              });
            }
          });
        }
      });
      
      if (detailedData.length > 0) {
        const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Extracted Data');
      }
      
      // Create full text sheet (for reference)
      const textData = documents.map(doc => ({
        'File Name': doc.fileName,
        'Category': doc.category,
        'Full Text': doc.extractedText?.substring(0, 32767) // Excel cell limit
      }));
      
      const textSheet = XLSX.utils.json_to_sheet(textData);
      XLSX.utils.book_append_sheet(workbook, textSheet, 'Full Text');
      
      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return buffer;
      
    } catch (error) {
      console.error('Excel export error:', error);
      throw new Error(`Failed to export to Excel: ${error.message}`);
    }
  }
  
  async exportSummaryReport(documents: ProcessedDocument[]): Promise<string> {
    try {
      const totalDocs = documents.length;
      const successfulDocs = documents.filter(doc => doc.status === 'completed').length;
      const failedDocs = totalDocs - successfulDocs;
      
      // Category distribution
      const categoryCount = {};
      documents.forEach(doc => {
        if (doc.status === 'completed') {
          categoryCount[doc.category] = (categoryCount[doc.category] || 0) + 1;
        }
      });
      
      // Processing method distribution
      const methodCount = {};
      documents.forEach(doc => {
        methodCount[doc.processingMethod] = (methodCount[doc.processingMethod] || 0) + 1;
      });
      
      const report = `
# XeveDoc Processing Report
Generated: ${new Date().toLocaleString()}

## Summary Statistics
- Total Documents Processed: ${totalDocs}
- Successfully Processed: ${successfulDocs}
- Failed Processing: ${failedDocs}
- Success Rate: ${((successfulDocs / totalDocs) * 100).toFixed(1)}%

## Document Categories
${Object.entries(categoryCount)
  .sort(([,a], [,b]) => b - a)
  .map(([category, count]) => `- ${category}: ${count} documents`)
  .join('\n')}

## Processing Methods
${Object.entries(methodCount)
  .sort(([,a], [,b]) => b - a)
  .map(([method, count]) => `- ${method}: ${count} documents`)
  .join('\n')}

## Document Details
${documents.map(doc => `
### ${doc.fileName}
- **Category**: ${doc.category} (${(doc.categoryConfidence * 100).toFixed(1)}% confidence)
- **Status**: ${doc.status}
- **Processing Method**: ${doc.processingMethod}
- **File Size**: ${Math.round(doc.fileSize / 1024)} KB
- **Processed**: ${new Date(doc.processedAt).toLocaleString()}
- **Summary**: ${doc.summary}
${doc.error ? `- **Error**: ${doc.error}` : ''}
`).join('\n')}

## Key Insights
${this.generateInsights(documents)}
`;
      
      return report;
      
    } catch (error) {
      console.error('Summary report error:', error);
      throw new Error(`Failed to generate summary report: ${error.message}`);
    }
  }
  
  private generateInsights(documents: ProcessedDocument[]): string {
    const insights = [];
    const completedDocs = documents.filter(doc => doc.status === 'completed');
    
    if (completedDocs.length === 0) {
      return '- No successfully processed documents to analyze.';
    }
    
    // Most common category
    const categoryCount = {};
    completedDocs.forEach(doc => {
      categoryCount[doc.category] = (categoryCount[doc.category] || 0) + 1;
    });
    
    const mostCommonCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommonCategory) {
      insights.push(`- Most common document type: ${mostCommonCategory[0]} (${mostCommonCategory[1]} documents)`);
    }
    
    // Average confidence
    const avgConfidence = completedDocs.reduce((sum, doc) => sum + doc.categoryConfidence, 0) / completedDocs.length;
    insights.push(`- Average categorization confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    
    // Processing efficiency
    const ocrDocs = completedDocs.filter(doc => doc.processingMethod === 'OCR').length;
    if (ocrDocs > 0) {
      insights.push(`- ${ocrDocs} documents required OCR processing (image-based)`);
    }
    
    // Text extraction stats
    const totalTextLength = completedDocs.reduce((sum, doc) => sum + (doc.extractedText?.length || 0), 0);
    const avgTextLength = Math.round(totalTextLength / completedDocs.length);
    insights.push(`- Average extracted text length: ${avgTextLength} characters`);
    
    return insights.join('\n');
  }
  
  async exportToCSV(documents: ProcessedDocument[]): Promise<string> {
    try {
      const headers = [
        'File Name',
        'Category',
        'Confidence',
        'File Size (KB)',
        'Processing Method',
        'Status',
        'Processed At',
        'Summary'
      ];
      
      const rows = documents.map(doc => [
        `"${doc.fileName}"`,
        `"${doc.category}"`,
        `"${(doc.categoryConfidence * 100).toFixed(1)}%"`,
        Math.round(doc.fileSize / 1024),
        `"${doc.processingMethod}"`,
        `"${doc.status}"`,
        `"${new Date(doc.processedAt).toLocaleString()}"`,
        `"${(doc.summary || '').replace(/"/g, '""').substring(0, 200)}"`
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      return csvContent;
      
    } catch (error) {
      console.error('CSV export error:', error);
      throw new Error(`Failed to export to CSV: ${error.message}`);
    }
  }
}