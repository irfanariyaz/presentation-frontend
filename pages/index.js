// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  // State for form inputs
  const [outlineInputs, setOutlineInputs] = useState({
    topic: '',
    instructional_level: '',
    n_slides: 5,
    file_upload_url: '',
    file_upload_type: '',
    lang: 'en'
  });

  // State for API responses
  const [outlineResponse, setOutlineResponse] = useState(null);
  const [slideResponse, setSlideResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOutlineInputs({
      ...outlineInputs,
      [name]: name === 'n_slides' ? parseInt(value) : value
    });
  };

  // Generate outline
  const generateOutline = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format inputs as list as required by the API
      const inputsList = [
        { name: "topic", value: outlineInputs.topic },
        { name: "instructional_level", value: outlineInputs.instructional_level },
        { name: "n_slides", value: outlineInputs.n_slides },
        { name: "file_upload_url", value: outlineInputs.file_upload_url },
        { name: "file_upload_type", value: outlineInputs.file_upload_type },
        { name: "lang", value: outlineInputs.lang }
      ];
      
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'dev'
        },
        body: JSON.stringify({
          user: {
            id: '123',
            fullName: 'Test User',
            email: 'test@example.com'
          },
          type: 'tool',
          tool_data: {
            tool_id: 'outline-generator',
            inputs: inputsList
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate outline');
      }
      
      setOutlineResponse(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate slides
  const generateSlides = async () => {
    if (!outlineResponse || !outlineResponse.outlines) {
      setError('Please generate outlines first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Format inputs as list as required by the API
      const inputsList = [
        { name: "slides_titles", value: outlineResponse.outlines },
        { name: "topic", value: outlineInputs.topic },
        { name: "instructional_level", value: outlineInputs.instructional_level },
        { name: "lang", value: outlineInputs.lang }
      ];
      
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'dev'
        },
        body: JSON.stringify({
          user: {
            id: '123',
            fullName: 'Test User',
            email: 'test@example.com'
          },
          type: 'tool',
          tool_data: {
            tool_id: 'slide-generator',
            inputs: inputsList
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate slides');
      }
      
      setSlideResponse(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Head>
        <title>Presentation Generator</title>
        <meta name="description" content="Generate presentation outlines and slides" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Presentation Generator</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Generate Outline Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Generate Outline</h2>
          
          <form onSubmit={generateOutline}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="topic"
                  value={outlineInputs.topic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructional Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="instructional_level"
                  value={outlineInputs.instructional_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Slides <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="n_slides"
                  value={outlineInputs.n_slides}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  type="text"
                  name="lang"
                  value={outlineInputs.lang}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="en"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  File Upload URL (Optional)
                </label>
                <input
                  type="text"
                  name="file_upload_url"
                  value={outlineInputs.file_upload_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  File Upload Type (Optional)
                </label>
                <input
                  type="text"
                  name="file_upload_type"
                  value={outlineInputs.file_upload_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Outline'}
              </button>
            </div>
          </form>
        </div>

        {/* Step 2: Generated Outlines */}
        {outlineResponse && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Step 2: Generated Outlines</h2>
            
            <div className="space-y-2">
              {outlineResponse.outlines.map((outline, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p><span className="font-medium">Slide {index + 1}:</span> {outline}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={generateSlides}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Slides Content'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Slides */}
        {slideResponse && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Step 3: Generated Slides</h2>
            
            <div className="space-y-6">
  {slideResponse.slides.map((slide, index) => (
    <div key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
      <h3 className="text-lg font-medium mb-2">{slide.title}</h3>
      <p className="text-sm text-gray-500 mb-2">Template: {slide.template}</p>

      {/* Handle twoColumn Template */}
      {slide.template === "twoColumn" && slide.content && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">{slide.content.leftColumn}</p>
          </div>
          <div>
            <p className="font-medium">{slide.content.rightColumn}</p>
          </div>
        </div>
      )}

      {/* Handle titleAndBullets Template */}
      {slide.template === "titleAndBullets" && Array.isArray(slide.content) && (
        <ul className="list-disc ml-5">
          {slide.content.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}

      {/* Handle titleAndBody and sectionHeader Templates */}
      {(slide.template === "titleAndBody" || slide.template === "sectionHeader") && (
        <div className="mt-2">
          <p className="whitespace-pre-wrap">{slide.content}</p>
        </div>
      )}
    </div>
  ))}
</div>


            <div className="mt-6 text-center">
              <p className="text-green-600 font-medium">Slides generated successfully!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}