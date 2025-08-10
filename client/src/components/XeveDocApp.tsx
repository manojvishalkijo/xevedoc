import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Brain, 
  Download, 
  History, 
  Settings, 
  Cloud, 
  Database,
  Eye,
  Tag,
  Sparkles,
  BarChart3,
  Users,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Zap,
  Target,
  Shield,
  Globe,
  Image as ImageIcon,
  HelpCircle,
  Info,
  Star,
  Award,
  Lightbulb,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  Rocket,
  Gift,
  Menu,
  Sun,
  Moon,
  Terminal,
  Share,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export function XeveDocApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showFloatingHelp, setShowFloatingHelp] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tutorial steps
  const tutorialSteps = [
    { 
      title: "Welcome to XeveDoc!", 
      content: "Let's take a quick tour of your AI document analyzer.",
      target: "overview",
      icon: <Rocket className="w-6 h-6" />
    },
    { 
      title: "Upload Documents", 
      content: "Drag and drop your files here or click to browse. We support PDFs, images, and more!",
      target: "upload",
      icon: <Upload className="w-6 h-6" />
    },
    { 
      title: "Watch the Magic", 
      content: "Our AI processes your documents in real-time with OCR and NLP technology.",
      target: "processing",
      icon: <Brain className="w-6 h-6" />
    },
    { 
      title: "Get Insights", 
      content: "View extracted data, smart tags, and AI summaries of your documents.",
      target: "results",
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  const processingSteps = [
    { name: 'OCR Processing', progress: 100, status: 'completed' },
    { name: 'NLP Analysis', progress: 75, status: 'processing' },
    { name: 'Data Extraction', progress: 30, status: 'pending' },
    { name: 'Summarization', progress: 0, status: 'pending' }
  ];

  const supportedFormats = [
    { name: 'PDF', icon: <FileText className="w-6 h-6" />, color: 'text-red-400' },
    { name: 'DOCX', icon: <FileText className="w-6 h-6" />, color: 'text-blue-400' },
    { name: 'XLSX', icon: <FileSpreadsheet className="w-6 h-6" />, color: 'text-green-400' },
    { name: 'JPG', icon: <ImageIcon className="w-6 h-6" />, color: 'text-yellow-400' },
    { name: 'PNG', icon: <ImageIcon className="w-6 h-6" />, color: 'text-purple-400' }
  ];

  const mockExtractedData = [
    { field: 'Name', value: 'John Smith', confidence: 98, type: 'Person' },
    { field: 'Email', value: 'john.smith@company.com', confidence: 95, type: 'Contact' },
    { field: 'Amount', value: '$1,247.50', confidence: 99, type: 'Financial' },
    { field: 'Date', value: '2024-03-15', confidence: 92, type: 'Date' },
    { field: 'Company', value: 'TechCorp Solutions', confidence: 97, type: 'Organization' }
  ];

  const mockDocumentHistory = [
    { id: 1, name: 'Invoice_2024_001.pdf', type: 'Invoice', date: '2024-03-15', status: 'Processed', accuracy: 98 },
    { id: 2, name: 'Resume_JohnDoe.docx', type: 'Resume', date: '2024-03-14', status: 'Processed', accuracy: 96 },
    { id: 3, name: 'Contract_ABC.pdf', type: 'Legal', date: '2024-03-13', status: 'Processing', accuracy: 0 },
    { id: 4, name: 'Report_Q1.xlsx', type: 'Report', date: '2024-03-12', status: 'Processed', accuracy: 94 }
  ];

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowSuccessAnimation(true);
    toast.success(`${files.length} file(s) uploaded successfully!`, {
      description: "Ready for AI analysis",
    });
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowSuccessAnimation(true);
    toast.success(`${files.length} file(s) selected!`);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  }, []);

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    toast.info("Starting AI analysis...");
    
    // Simulate processing steps with realistic timing
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          setExtractedData(mockExtractedData);
          setShowSuccessAnimation(true);
          toast.success('Document analysis completed!', {
            description: "All insights extracted successfully"
          });
          setTimeout(() => setShowSuccessAnimation(false), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const startTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
    setShowWelcome(false);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
      setActiveTab(tutorialSteps[nextStep].target);
    } else {
      setShowTutorial(false);
      setShowFloatingHelp(true);
      toast.success("Tutorial completed! You're ready to go!");
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    setShowWelcome(false);
  };

  // Auto-hide floating help after some time
  useEffect(() => {
    if (showFloatingHelp) {
      const timer = setTimeout(() => {
        setShowFloatingHelp(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showFloatingHelp]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Animated Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    XeveDoc
                  </h1>
                  <p className="text-xs text-muted-foreground">AI Document Analyzer</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div
                className="hidden md:flex items-center space-x-2 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span>System Online</span>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="button-click"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHelpPanel(true)}
                    className="button-click"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Help & Support</TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="icon" className="button-click">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        <div className="flex">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:relative md:top-0 md:h-[calc(100vh-4rem)]"
              >
                <ScrollArea className="h-full py-6 px-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('overview')}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === 'upload' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('upload')}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      variant={activeTab === 'processing' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('processing')}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Processing
                    </Button>
                    <Button
                      variant={activeTab === 'results' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('results')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Results
                    </Button>
                    <Button
                      variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('history')}
                    >
                      <History className="mr-2 h-4 w-4" />
                      History
                    </Button>
                    <Button
                      variant={activeTab === 'export' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('export')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </nav>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      New Upload
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                      onClick={startTutorial}
                    >
                      <BookOpen className="mr-2 h-3 w-3" />
                      Take Tour
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Supported Formats</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {supportedFormats.map((format) => (
                        <motion.div
                          key={format.name}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <div className={format.color}>
                            {format.icon}
                          </div>
                          <span className="text-xs font-medium">{format.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="container py-6 px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                          <p className="text-muted-foreground">
                            Monitor your document processing activities and system performance
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Card className="interactive-card">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  Total Documents
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">2,847</div>
                                <p className="text-xs text-muted-foreground">
                                  +20.1% from last month
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Card className="interactive-card">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  Processing Speed
                                </CardTitle>
                                <Zap className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">98.2%</div>
                                <p className="text-xs text-muted-foreground">
                                  +2.5% efficiency gain
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Card className="interactive-card">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  Accuracy Rate
                                </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">99.7%</div>
                                <p className="text-xs text-muted-foreground">
                                  Industry leading
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Card className="interactive-card">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  Active Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">573</div>
                                <p className="text-xs text-muted-foreground">
                                  +201 new this week
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>

                        {/* Feature Highlights */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="col-span-full lg:col-span-2"
                          >
                            <Card className="interactive-card">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Sparkles className="h-5 w-5 text-yellow-500" />
                                  AI-Powered Features
                                </CardTitle>
                                <CardDescription>
                                  Discover what makes XeveDoc special
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Smart OCR</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Extract text from any document format with 99%+ accuracy
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">NLP Analysis</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Understand context and extract meaningful insights
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                        <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Auto Categorization</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Automatically classify documents by type and content
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                        <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Secure Processing</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Enterprise-grade security for sensitive documents
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Card className="interactive-card">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5 text-green-500" />
                                  Quick Start
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Button 
                                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-click"
                                  onClick={() => setActiveTab('upload')}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Document
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full button-click"
                                  onClick={startTutorial}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Take Tutorial
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full button-click"
                                  onClick={() => setActiveTab('history')}
                                >
                                  <History className="mr-2 h-4 w-4" />
                                  View History
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'upload' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
                          <p className="text-muted-foreground">
                            Drag and drop files or click to browse. We support multiple formats.
                          </p>
                        </div>

                        {/* Upload Area */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className={`relative border-2 border-dashed rounded-lg p-12 transition-all duration-300 ${
                            dragActive 
                              ? 'border-primary bg-primary/5 scale-105' 
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                          />
                          
                          <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <motion.div
                              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}
                              animate={dragActive ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.3, repeat: dragActive ? Infinity : 0 }}
                            >
                              <Upload className="w-8 h-8" />
                            </motion.div>
                            
                            <div>
                              <h3 className="text-lg font-medium">
                                {dragActive ? 'Drop files here!' : 'Drop files here or click to browse'}
                              </h3>
                              <p className="text-muted-foreground">
                                Supports PDF, DOCX, XLSX, JPG, PNG files up to 10MB each
                              </p>
                            </div>

                            <Button 
                              onClick={() => fileInputRef.current?.click()}
                              className="button-click"
                              disabled={dragActive}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Select Files
                            </Button>
                          </div>

                          {showSuccessAnimation && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg"
                            >
                              <div className="flex items-center space-x-2 text-green-600 font-medium">
                                <CheckCircle2 className="w-6 h-6" />
                                <span>Files uploaded successfully!</span>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Cloud Integration */}
                        <Card className="interactive-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Cloud className="h-5 w-5" />
                              Cloud Integration
                            </CardTitle>
                            <CardDescription>
                              Import files directly from your cloud storage
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3 md:grid-cols-3">
                              <Button variant="outline" className="justify-start button-click">
                                <Cloud className="mr-2 h-4 w-4" />
                                Google Drive
                              </Button>
                              <Button variant="outline" className="justify-start button-click">
                                <Cloud className="mr-2 h-4 w-4" />
                                Dropbox
                              </Button>
                              <Button variant="outline" className="justify-start button-click">
                                <Cloud className="mr-2 h-4 w-4" />
                                OneDrive
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Uploaded Files */}
                        {uploadedFiles.length > 0 && (
                          <Card className="interactive-card">
                            <CardHeader>
                              <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                              <CardDescription>
                                Ready for processing
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-5 w-5 text-blue-500" />
                                      <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setUploadedFiles(files => files.filter((_, i) => i !== index));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                              
                              <div className="flex gap-3 mt-6">
                                <Button 
                                  onClick={startProcessing}
                                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-click"
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Start Analysis
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setUploadedFiles([])}
                                  className="button-click"
                                >
                                  Clear All
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {activeTab === 'processing' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight">Processing Dashboard</h2>
                          <p className="text-muted-foreground">
                            Real-time view of document analysis pipeline
                          </p>
                        </div>

                        {/* Processing Steps */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {processingSteps.map((step, index) => (
                            <motion.div
                              key={step.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className={`interactive-card ${step.status === 'processing' ? 'pulse-glow' : ''}`}>
                                <CardContent className="p-6">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">{step.name}</h4>
                                      <div className={`w-3 h-3 rounded-full ${
                                        step.status === 'completed' 
                                          ? 'bg-green-500' 
                                          : step.status === 'processing' 
                                          ? 'bg-blue-500 animate-pulse' 
                                          : 'bg-muted'
                                      }`} />
                                    </div>
                                    <Progress 
                                      value={step.progress} 
                                      className="h-2"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                      {step.progress}% complete
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>

                        {/* Live Processing Log */}
                        <Card className="interactive-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Terminal className="h-5 w-5" />
                              Live Processing Log
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-64">
                              <div className="space-y-2 font-mono text-sm">
                                <div className="text-green-600">[OCR] ✓ Text extraction completed - 1,247 characters detected</div>
                                <div className="text-blue-600">[NLP] → Analyzing semantic structure...</div>
                                <div className="text-blue-600">[NLP] → Identifying entities: 5 names, 3 dates, 2 amounts</div>
                                <div className="text-yellow-600">[EXTRACT] → Processing field mappings...</div>
                                <div className="text-gray-600">[SUMMARY] ⏳ Waiting for extraction completion...</div>
                                <div className="shimmer h-4 rounded"></div>
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>

                        {/* System Performance */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <Card className="interactive-card">
                            <CardHeader>
                              <CardTitle>System Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>CPU Usage</span>
                                  <span>67%</span>
                                </div>
                                <Progress value={67} className="mt-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Memory</span>
                                  <span>43%</span>
                                </div>
                                <Progress value={43} className="mt-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>GPU Utilization</span>
                                  <span>89%</span>
                                </div>
                                <Progress value={89} className="mt-2" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="interactive-card">
                            <CardHeader>
                              <CardTitle>Queue Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span>Documents in queue</span>
                                <Badge variant="secondary">12</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Processing time</span>
                                <span className="text-sm text-muted-foreground">~2.3 min avg</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Success rate</span>
                                <span className="text-green-600 font-medium">99.7%</span>
                              </div>
                              <Separator />
                              <Button 
                                variant="outline" 
                                className="w-full button-click"
                                onClick={() => toast.info("Queue cleared successfully")}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Clear Queue
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {activeTab === 'results' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight">Analysis Results</h2>
                          <p className="text-muted-foreground">
                            Extracted data and insights from your documents
                          </p>
                        </div>

                        {extractedData.length > 0 ? (
                          <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid gap-4 md:grid-cols-3">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <Card className="interactive-card">
                                  <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                                      <div>
                                        <p className="text-2xl font-bold">98.5%</p>
                                        <p className="text-sm text-muted-foreground">Avg Confidence</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Card className="interactive-card">
                                  <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                      <Tag className="h-8 w-8 text-blue-500" />
                                      <div>
                                        <p className="text-2xl font-bold">{extractedData.length}</p>
                                        <p className="text-sm text-muted-foreground">Fields Extracted</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Card className="interactive-card">
                                  <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-8 w-8 text-purple-500" />
                                      <div>
                                        <p className="text-2xl font-bold">2.3s</p>
                                        <p className="text-sm text-muted-foreground">Process Time</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </div>

                            {/* Extracted Data Table */}
                            <Card className="interactive-card">
                              <CardHeader>
                                <CardTitle>Extracted Data</CardTitle>
                                <CardDescription>
                                  Structured information extracted from your documents
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Field</TableHead>
                                      <TableHead>Value</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Confidence</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {extractedData.map((item, index) => (
                                      <motion.tr
                                        key={item.field}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group hover:bg-muted/50"
                                      >
                                        <TableCell className="font-medium">{item.field}</TableCell>
                                        <TableCell>{item.value}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{item.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center space-x-2">
                                            <Progress value={item.confidence} className="w-16" />
                                            <span className="text-sm font-medium">{item.confidence}%</span>
                                          </div>
                                        </TableCell>
                                      </motion.tr>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>

                            {/* Smart Tags and Categories */}
                            <div className="grid gap-6 md:grid-cols-2">
                              <Card className="interactive-card">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Smart Tags
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {['Invoice', 'Financial', 'Business', 'Q1-2024', 'TechCorp', 'Payment'].map((tag, index) => (
                                      <motion.div
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                      >
                                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                          {tag}
                                        </Badge>
                                      </motion.div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="interactive-card">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5" />
                                    AI Summary
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm leading-relaxed text-muted-foreground">
                                    This appears to be a business invoice from TechCorp Solutions for 
                                    services rendered to John Smith. The document contains standard 
                                    invoice elements including contact information, service details, 
                                    and payment amount of $1,247.50.
                                  </p>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <Button 
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-click"
                                onClick={() => setActiveTab('export')}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Export Results
                              </Button>
                              <Button variant="outline" className="button-click">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Re-analyze
                              </Button>
                              <Button variant="outline" className="button-click">
                                <Share className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Card className="interactive-card">
                            <CardContent className="p-12 text-center">
                              <div className="space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                  <BarChart3 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium">No Results Yet</h3>
                                  <p className="text-muted-foreground">
                                    Upload and process documents to see analysis results here
                                  </p>
                                </div>
                                <Button 
                                  onClick={() => setActiveTab('upload')}
                                  className="button-click"
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Documents
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold tracking-tight">Document History</h2>
                            <p className="text-muted-foreground">
                              View and manage your processed documents
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input 
                                placeholder="Search documents..." 
                                className="pl-10 w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <Button variant="outline" size="icon" className="button-click">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Card className="interactive-card">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Document</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Accuracy</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {mockDocumentHistory.map((doc, index) => (
                                  <motion.tr
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group hover:bg-muted/50"
                                  >
                                    <TableCell>
                                      <div className="flex items-center space-x-3">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <p className="font-medium">{doc.name}</p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{doc.type}</Badge>
                                    </TableCell>
                                    <TableCell>{doc.date}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={doc.status === 'Processed' ? 'default' : 'secondary'}
                                        className={doc.status === 'Processing' ? 'animate-pulse' : ''}
                                      >
                                        {doc.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {doc.accuracy > 0 ? (
                                        <div className="flex items-center space-x-2">
                                          <Progress value={doc.accuracy} className="w-16" />
                                          <span className="text-sm">{doc.accuracy}%</span>
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="button-click">
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>View Details</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="button-click">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Download</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="button-click">
                                              <RefreshCw className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Re-analyze</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </TableCell>
                                  </motion.tr>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {activeTab === 'export' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight">Export & Integration</h2>
                          <p className="text-muted-foreground">
                            Export your data or integrate with external systems
                          </p>
                        </div>

                        {/* Export Options */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="font-medium mb-2">Export to Excel</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Download structured data as XLSX file
                                </p>
                                <Button className="w-full button-click">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Excel
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-medium mb-2">Database Export</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Connect to MySQL, PostgreSQL, MongoDB
                                </p>
                                <Button variant="outline" className="w-full button-click">
                                  <Database className="mr-2 h-4 w-4" />
                                  Configure DB
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="font-medium mb-2">CRM Integration</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Push to HubSpot, Salesforce, Zoho
                                </p>
                                <Button variant="outline" className="w-full button-click">
                                  <Users className="mr-2 h-4 w-4" />
                                  Connect CRM
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="font-medium mb-2">API Access</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  REST API for custom integrations
                                </p>
                                <Button variant="outline" className="w-full button-click">
                                  <Globe className="mr-2 h-4 w-4" />
                                  Get API Key
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="font-medium mb-2">PDF Report</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Generate comprehensive analysis report
                                </p>
                                <Button variant="outline" className="w-full button-click">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate PDF
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Card className="interactive-card cursor-pointer hover:scale-105 transition-transform">
                              <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <Zap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="font-medium mb-2">Webhooks</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Real-time notifications and triggers
                                </p>
                                <Button variant="outline" className="w-full button-click">
                                  <Zap className="mr-2 h-4 w-4" />
                                  Setup Webhook
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>

                        {/* Export Settings */}
                        <Card className="interactive-card">
                          <CardHeader>
                            <CardTitle>Export Settings</CardTitle>
                            <CardDescription>
                              Customize your export preferences
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Export Format</label>
                                  <Select defaultValue="xlsx">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                      <SelectItem value="csv">CSV</SelectItem>
                                      <SelectItem value="json">JSON</SelectItem>
                                      <SelectItem value="pdf">PDF Report</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Date Range</label>
                                  <Select defaultValue="all">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Time</SelectItem>
                                      <SelectItem value="today">Today</SelectItem>
                                      <SelectItem value="week">This Week</SelectItem>
                                      <SelectItem value="month">This Month</SelectItem>
                                      <SelectItem value="custom">Custom Range</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Include Confidence Scores</label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Include AI Summary</label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Include Smart Tags</label>
                                  <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Compress Files</label>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-click">
                                <Download className="mr-2 h-4 w-4" />
                                Export Now
                              </Button>
                              <Button variant="outline" className="button-click">
                                <Clock className="mr-2 h-4 w-4" />
                                Schedule Export
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>

        {/* Welcome Dialog */}
        <AnimatePresence>
          {showWelcome && (
            <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
              <DialogContent className="sm:max-w-md">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <DialogHeader className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Welcome to XeveDoc!
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Your AI-powered document analyzer is ready to transform how you handle documents.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-3 mt-6">
                    <Button 
                      onClick={startTutorial}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-click"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Take a Quick Tour
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowWelcome(false)}
                      className="button-click"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Jump Right In
                    </Button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Tutorial Overlay */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl p-6 max-w-md w-full border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                    {tutorialSteps[tutorialStep].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{tutorialSteps[tutorialStep].title}</h3>
                    <p className="text-sm text-muted-foreground">Step {tutorialStep + 1} of {tutorialSteps.length}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {tutorialSteps[tutorialStep].content}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={skipTutorial} className="button-click">
                    Skip Tour
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={nextTutorialStep} className="button-click">
                      {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Panel */}
        <Dialog open={showHelpPanel} onOpenChange={setShowHelpPanel}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help & Support
              </DialogTitle>
              <DialogDescription>
                Get help with using XeveDoc effectively
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="faq" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">What file formats are supported?</h4>
                    <p className="text-sm text-muted-foreground">
                      We support PDF, DOCX, XLSX, JPG, PNG, and more formats up to 10MB each.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">How accurate is the extraction?</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI achieves 99%+ accuracy with clear, well-formatted documents.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Can I export to my CRM?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We integrate with HubSpot, Salesforce, Zoho, and more platforms.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tutorials">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start button-click">
                    <Play className="mr-2 h-4 w-4" />
                    Getting Started with XeveDoc
                  </Button>
                  <Button variant="outline" className="w-full justify-start button-click">
                    <Play className="mr-2 h-4 w-4" />
                    Advanced Processing Options
                  </Button>
                  <Button variant="outline" className="w-full justify-start button-click">
                    <Play className="mr-2 h-4 w-4" />
                    Setting Up Integrations
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="contact">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Support</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start button-click">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Live Chat Support
                      </Button>
                      <Button variant="outline" className="w-full justify-start button-click">
                        <Mail className="mr-2 h-4 w-4" />
                        Email: support@xevedoc.com
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Floating Help Button */}
        <AnimatePresence>
          {showFloatingHelp && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 button-click"
                    onClick={() => setShowHelpPanel(true)}
                  >
                    <HelpCircle className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Need help? Click here!</TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}