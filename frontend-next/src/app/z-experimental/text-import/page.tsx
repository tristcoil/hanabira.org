// app/import-article/page.tsx

'use client';

import { useState, FormEvent } from 'react';

type ApiResponse = {
  content?: string;
  error?: string;
};

export default function ImportArticlePage() {
  const [url, setUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setContent('');

    try {
      const response = await fetch(`/api/fetch-content?url=${encodeURIComponent(url)}`);
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setContent(data.content || '');
      } else {
        setError(data.error || 'Failed to fetch content');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Import Article (Japanese)</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </label>
        <button type="submit">Fetch Content</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {content && (
        <div>
          <h2>Article Content</h2>
          <pre>{content}</pre>
        </div>
      )}
    </div>
  );
}
