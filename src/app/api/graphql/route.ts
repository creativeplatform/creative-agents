import { NextRequest, NextResponse } from 'next/server';

// This is a server-side API route that proxies GraphQL requests
// to avoid CORS issues in the browser
export async function POST(request: NextRequest) {
  // Log the request method and URL for debugging
  console.log(`Received ${request.method} request to /api/graphql`);
  
  try {
    // Clone the request to ensure we can read the body multiple times if needed
    const clonedRequest = request.clone();
    
    // Try to parse the request body with better error handling
    let body;
    try {
      const text = await clonedRequest.text();
      console.log(`Request body length: ${text.length} characters`);
      
      // Only try to parse if there's actual content
      if (text && text.trim().length > 0) {
        body = JSON.parse(text);
      } else {
        console.error('Empty request body received');
        return NextResponse.json(
          { error: 'Empty request body' },
          { status: 400 }
        );
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate the required parameters
    if (!body || typeof body !== 'object') {
      console.error('Invalid request body format:', body);
      return NextResponse.json(
        { error: 'Request body must be a JSON object' },
        { status: 400 }
      );
    }
    
    const { endpoint, query, variables } = body;

    if (!endpoint || typeof endpoint !== 'string') {
      console.error('Missing or invalid endpoint parameter');
      return NextResponse.json(
        { error: 'Missing or invalid endpoint parameter' },
        { status: 400 }
      );
    }
    
    if (!query || typeof query !== 'string') {
      console.error('Missing or invalid query parameter');
      return NextResponse.json(
        { error: 'Missing or invalid query parameter' },
        { status: 400 }
      );
    }

    console.log(`Proxying GraphQL request to ${endpoint}`);

    // Make the GraphQL request from the server side
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GraphQL server returned ${response.status}:`, errorText);
        return NextResponse.json(
          { error: `GraphQL server error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // Check for GraphQL-level errors
      // Add type assertion to handle the unknown type
      const graphqlResponse = data as { 
        errors?: Array<{ message: string; locations?: Array<{ line: number; column: number }>; path?: string[] }>; 
        data?: Record<string, unknown> 
      };
      
      if (graphqlResponse.errors && graphqlResponse.errors.length > 0) {
        console.warn('GraphQL query returned errors:', graphqlResponse.errors);
        // Still return the data along with the errors
      }
      
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Error fetching from GraphQL endpoint:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch from GraphQL endpoint: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in GraphQL proxy route:', error);
    return NextResponse.json(
      { error: 'Internal server error in GraphQL proxy' },
      { status: 500 }
    );
  }
}
