import OpenAI from 'openai';

export class LLMService {
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
    });
  }

  async analyzeDocument(text: string, documentType?: string): Promise<DocumentAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(text, documentType);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert document analyzer. Analyze documents and extract structured information in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('LLM Analysis Error:', error);
      throw new Error(`Failed to analyze document: ${error.message}`);
    }
  }

  async summarizeDocument(text: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional document summarizer. Create concise, informative summaries."
          },
          {
            role: "user",
            content: `Please provide a comprehensive summary of the following document:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
      console.error('Summarization Error:', error);
      throw new Error(`Failed to summarize document: ${error.message}`);
    }
  }

  async categorizeDocument(text: string): Promise<DocumentCategory> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a document classifier. Categorize documents into types and extract confidence scores. Respond in JSON format."
          },
          {
            role: "user",
            content: `Categorize this document and provide a confidence score (0-1). Available categories: Invoice, Contract, Resume, Report, Letter, Legal Document, Financial Statement, Other.

Document text:
${text.substring(0, 2000)}

Respond in JSON format:
{
  "category": "category_name",
  "confidence": 0.95,
  "subcategory": "optional_subcategory",
  "reasoning": "brief explanation"
}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Categorization Error:', error);
      return {
        category: 'Other',
        confidence: 0.5,
        subcategory: 'Unknown',
        reasoning: 'Failed to categorize automatically'
      };
    }
  }

  async extractKeyInformation(text: string, documentType: string): Promise<ExtractedData> {
    try {
      const prompt = this.buildExtractionPrompt(text, documentType);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert data extractor. Extract structured information from documents in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Extraction Error:', error);
      return {
        entities: [],
        keyValues: {},
        dates: [],
        amounts: [],
        contacts: []
      };
    }
  }

  private buildAnalysisPrompt(text: string, documentType?: string): string {
    return `Analyze the following document and provide a comprehensive analysis in JSON format:

Document Type: ${documentType || 'Unknown'}
Document Text:
${text.substring(0, 3000)}

Please provide analysis in this JSON structure:
{
  "summary": "Brief summary of the document",
  "category": "Document category",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "sentiment": "positive/negative/neutral",
  "complexity": "low/medium/high",
  "extractedData": {
    "names": ["person names found"],
    "organizations": ["company names found"],
    "dates": ["dates found"],
    "amounts": ["monetary amounts found"],
    "locations": ["locations found"]
  },
  "confidence": 0.95
}`;
  }

  private buildExtractionPrompt(text: string, documentType: string): string {
    const typeSpecificFields = this.getTypeSpecificFields(documentType);
    
    return `Extract structured information from this ${documentType} document:

${text.substring(0, 2500)}

Extract the following information in JSON format:
{
  "entities": [
    {"type": "PERSON", "value": "John Doe", "confidence": 0.95},
    {"type": "ORGANIZATION", "value": "Company Name", "confidence": 0.90}
  ],
  "keyValues": ${JSON.stringify(typeSpecificFields)},
  "dates": ["2024-01-15", "2024-02-20"],
  "amounts": [{"value": 1500.00, "currency": "USD", "context": "invoice total"}],
  "contacts": [{"email": "email@example.com", "phone": "+1234567890"}]
}`;
  }

  private getTypeSpecificFields(documentType: string): Record<string, any> {
    const fieldMaps = {
      'Invoice': {
        'invoice_number': '',
        'due_date': '',
        'total_amount': '',
        'vendor': '',
        'customer': ''
      },
      'Resume': {
        'name': '',
        'email': '',
        'phone': '',
        'experience_years': '',
        'skills': [],
        'education': ''
      },
      'Contract': {
        'parties': [],
        'effective_date': '',
        'expiration_date': '',
        'contract_value': '',
        'terms': ''
      },
      'Report': {
        'title': '',
        'author': '',
        'date': '',
        'key_findings': [],
        'recommendations': []
      }
    };

    return fieldMaps[documentType] || {};
  }

  private parseAnalysisResponse(response: string): DocumentAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return {
        summary: response.substring(0, 200),
        category: 'Other',
        keyTopics: [],
        sentiment: 'neutral',
        complexity: 'medium',
        extractedData: {
          names: [],
          organizations: [],
          dates: [],
          amounts: [],
          locations: []
        },
        confidence: 0.5
      };
    }
  }
}

// Type definitions
export interface DocumentAnalysis {
  summary: string;
  category: string;
  keyTopics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  complexity: 'low' | 'medium' | 'high';
  extractedData: {
    names: string[];
    organizations: string[];
    dates: string[];
    amounts: string[];
    locations: string[];
  };
  confidence: number;
}

export interface DocumentCategory {
  category: string;
  confidence: number;
  subcategory?: string;
  reasoning: string;
}

export interface ExtractedData {
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  keyValues: Record<string, any>;
  dates: string[];
  amounts: Array<{
    value: number;
    currency: string;
    context: string;
  }>;
  contacts: Array<{
    email?: string;
    phone?: string;
  }>;
}