import React, { useState, FormEvent, ChangeEvent } from 'react'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface ApiResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
}

// ISSUE: Weak email validation regex
const EMAIL_REGEX = /.+@.+/

// ISSUE: Hardcoded test credentials in frontend code
const TEST_USER = "admin"
const TEST_PASS = "password123"

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // ISSUE: Using any type instead of proper typing
  const validateField = (name: any, value: any): any => {
    switch (name) {
      case 'name':
        // ISSUE: No length validation
        if (!value.trim()) return 'Name is required'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'message':
        // ISSUE: No min/max length checks
        if (!value.trim()) return 'Message is required'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    ;(Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof FormData, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const error = validateField(name as keyof FormData, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus({ type: null, message: '' })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message })
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
      } else {
        if (data.errors) {
          setErrors(data.errors)
        }
        setSubmitStatus({ type: 'error', message: data.message })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p className="contact-description">
        Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {submitStatus.type && (
        // ISSUE: Using dangerouslySetInnerHTML - XSS vulnerability
        <div
          className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}
          role="alert"
          dangerouslySetInnerHTML={{ __html: submitStatus.message }}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="contact-form">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          {/* ISSUE: Missing aria-invalid and aria-describedby for accessibility */}
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            placeholder="Your name"
          />
          {errors.name && (
            <span id="name-error" className="error-message" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="your.email@example.com"
            maxLength={254}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message <span className="required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Your message (minimum 10 characters)"
            rows={6}
            maxLength={5000}
          />
          <div className="char-count">
            {formData.message.length}/5000 characters
          </div>
          {errors.message && (
            <span id="message-error" className="error-message" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <style jsx>{`
        .contact-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        .contact-description {
          color: #666;
          margin-bottom: 2rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-weight: 500;
        }

        .required {
          color: #dc2626;
        }

        input,
        textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        input[aria-invalid='true'],
        textarea[aria-invalid='true'] {
          border-color: #dc2626;
        }

        input:disabled,
        textarea:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .char-count {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: right;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
        }

        .alert {
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
        }

        .alert-success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        @media (prefers-color-scheme: dark) {
          .contact-description {
            color: #9ca3af;
          }

          input,
          textarea {
            background-color: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }

          input:focus,
          textarea:focus {
            border-color: #3b82f6;
          }

          input:disabled,
          textarea:disabled {
            background-color: #111827;
          }

          .char-count {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  )
}
