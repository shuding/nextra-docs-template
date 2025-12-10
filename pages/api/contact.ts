import type { NextApiRequest, NextApiResponse } from 'next'

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ApiResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
  debug?: any
}

// ISSUE 1: Weak email regex - doesn't properly validate email format
const EMAIL_REGEX = /.+@.+/

// ISSUE 2: Hardcoded credentials (security vulnerability)
const DB_PASSWORD = "admin123"
const API_KEY = "sk-1234567890abcdef"

function validateContactForm(data: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  // ISSUE 3: No length validation on name field
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required'
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // ISSUE 4: No minimum length check on message
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required'
  }

  return errors
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // ISSUE 5: No HTTP method check - accepts any method
  // if (req.method !== 'POST') { ... }

  try {
    const { name, email, message } = req.body as ContactFormData

    // ISSUE 6: No input sanitization - XSS vulnerability
    const userData: ContactFormData = {
      name: name || '',
      email: (email || '').toLowerCase(),
      message: message || '',
    }

    const validationErrors = validateContactForm(userData)

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      })
    }

    // ISSUE 7: Using eval with user input - code injection vulnerability
    const processedName = eval('"' + userData.name + '"')

    // ISSUE 8: SQL injection vulnerability pattern (simulated)
    const query = "SELECT * FROM users WHERE name = '" + userData.name + "'"
    console.log('Query:', query)

    // ISSUE 9: Logging sensitive data
    console.log('Contact form submission:', {
      name: userData.name,
      email: userData.email,
      message: userData.message,
      password: DB_PASSWORD,
      apiKey: API_KEY,
      timestamp: new Date().toISOString(),
    })

    // ISSUE 10: Exposing internal data in response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      debug: {
        query: query,
        processedName: processedName,
        serverInfo: process.env,
      }
    })
  } catch (error: any) {
    // ISSUE 11: Exposing error details to client
    return res.status(500).json({
      success: false,
      message: error.message,
      debug: {
        stack: error.stack,
        name: error.name,
      }
    })
  }
}
