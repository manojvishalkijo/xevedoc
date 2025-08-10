import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileCode, 
  CheckCircle, 
  Box, 
  Palette, 
  Server, 
  Bolt,
  Lightbulb,
  Settings
} from "lucide-react";

export default function Home() {
  const fixedIssues = [
    {
      title: "PostCSS Configuration",
      description: "Converted from CommonJS to ES modules"
    },
    {
      title: "Tailwind CSS Plugin",
      description: "Updated to @tailwindcss/postcss"
    },
    {
      title: "Unknown Utility Classes",
      description: "Fixed border-border and similar conflicts"
    },
    {
      title: "Module Type",
      description: 'Added "type": "module" to package.json'
    },
    {
      title: "Dependencies",
      description: "Updated to latest compatible versions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileCode className="text-blue-500 h-6 w-6" />
                <h1 className="text-xl font-semibold text-gray-900">XeveDoc</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-sm text-gray-500">Vite</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">React</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">Tailwind CSS</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Server Running</span>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Build Status</p>
                  <p className="text-2xl font-semibold text-green-600">Success</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dependencies</p>
                  <p className="text-2xl font-semibold text-blue-600">Updated</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Box className="text-blue-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CSS Framework</p>
                  <p className="text-2xl font-semibold text-gray-900">Tailwind</p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Palette className="text-gray-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dev Server</p>
                  <p className="text-2xl font-semibold text-green-600">Running</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Server className="text-green-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fixed Issues */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bolt className="text-blue-500 mr-2 h-5 w-5" />
                Fixed Issues
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {fixedIssues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="text-green-500 h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Files */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileCode className="text-blue-500 mr-2 h-5 w-5" />
                Updated Configurations
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">package.json</h3>
                  <div className="bg-gray-50 rounded-md p-3 text-sm font-mono">
                    <div className="text-gray-600">{"{"}</div>
                    <div className="ml-2 text-blue-600">"type": "module",</div>
                    <div className="ml-2 text-gray-600">"scripts": {"{"}</div>
                    <div className="ml-4 text-green-600">"dev": "vite"</div>
                    <div className="ml-2 text-gray-600">{"}"}</div>
                    <div className="text-gray-600">{"}"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">postcss.config.js</h3>
                  <div className="bg-gray-50 rounded-md p-3 text-sm font-mono">
                    <div className="text-purple-600">export default {"{"}</div>
                    <div className="ml-2 text-gray-600">plugins: {"{"}</div>
                    <div className="ml-4 text-green-600">'@tailwindcss/postcss': {},</div>
                    <div className="ml-4 text-green-600">autoprefixer: {"{}"}</div>
                    <div className="ml-2 text-gray-600">{"}"}</div>
                    <div className="text-purple-600">{"}"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">tailwind.config.js</h3>
                  <div className="bg-gray-50 rounded-md p-3 text-sm font-mono">
                    <div className="text-purple-600">export default {"{"}</div>
                    <div className="ml-2 text-gray-600">content: [</div>
                    <div className="ml-4 text-green-600">"./index.html",</div>
                    <div className="ml-4 text-green-600">"./src/**/*.{"{"}js,ts,jsx,tsx{"}"}"</div>
                    <div className="ml-2 text-gray-600">]</div>
                    <div className="text-purple-600">{"}"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Line Output */}
        <Card className="mt-8 bg-gray-900 shadow-sm border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400">Terminal - XeveDoc Project</span>
            </div>
          </div>
          <CardContent className="p-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-green-400">$ npm run dev</div>
              <div className="text-gray-300">&gt; my-v0-project@0.1.0 dev</div>
              <div className="text-gray-300">&gt; vite</div>
              <div className="text-gray-400 mt-2">
                <div className="text-cyan-400">  VITE v7.1.1</div>
                <div className="text-gray-300">  ready in 221 ms</div>
                <div className="mt-2">
                  <div className="text-gray-300">  ➜  <span className="text-white">Local:</span>   <span className="text-cyan-400 underline">http://localhost:5000/</span></div>
                  <div className="text-gray-300">  ➜  <span className="text-white">Network:</span> use --host to expose</div>
                  <div className="text-gray-300">  ➜  press h + enter to show help</div>
                </div>
              </div>
              <div className="text-green-500 mt-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Server running successfully - all errors resolved!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8 bg-blue-50 border border-blue-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Lightbulb className="text-blue-600 mr-2 h-5 w-5" />
              Next Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Development</h3>
                  <p className="text-sm text-gray-600 mb-3">Start building your React components with Tailwind CSS utilities</p>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300">
                    Begin Development →
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white border border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Testing</h3>
                  <p className="text-sm text-gray-600 mb-3">Run your test suite to ensure everything works correctly</p>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300">
                    Run Tests →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
