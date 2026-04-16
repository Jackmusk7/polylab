import React from 'react'
import { theme, radius } from './theme'

export const Button = ({ children, onClick, variant = 'primary', size = 'md', style = {}, ...props }) => {
  const variants = {
    primary: {
      background: theme.accent,
      color: '#0a0b0f',
      fontWeight: 600,
    },
    secondary: {
      background: theme.bgElevated,
      color: theme.textPrimary,
      border: `1px solid ${theme.border}`,
    },
    ghost: {
      background: 'transparent',
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
    },
    danger: {
      background: 'transparent',
      color: theme.danger,
      border: `1px solid ${theme.dangerBg}`,
    },
  }
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12 },
    md: { padding: '8px 14px', fontSize: 13 },
    lg: { padding: '10px 18px', fontSize: 14 },
  }
  return (
    <button
      onClick={onClick}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: radius.md,
        cursor: 'pointer',
        border: variants[variant].border || 'none',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
      {...props}
    >
      {children}
    </button>
  )
}

export const Input = ({ value, onChange, placeholder, style = {}, ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      background: theme.bgInput,
      border: `1px solid ${theme.border}`,
      borderRadius: radius.md,
      color: theme.textPrimary,
      padding: '10px 12px',
      fontSize: 14,
      outline: 'none',
      transition: 'border-color 0.15s',
      ...style,
    }}
    onFocus={(e) => { e.target.style.borderColor = theme.accent }}
    onBlur={(e) => { e.target.style.borderColor = theme.border }}
    {...props}
  />
)

export const Textarea = ({ value, onChange, placeholder, rows = 4, style = {}, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: '100%',
      background: theme.bgInput,
      border: `1px solid ${theme.border}`,
      borderRadius: radius.md,
      color: theme.textPrimary,
      padding: '10px 12px',
      fontSize: 13,
      outline: 'none',
      resize: 'vertical',
      lineHeight: 1.5,
      fontFamily: 'inherit',
      transition: 'border-color 0.15s',
      ...style,
    }}
    onFocus={(e) => { e.target.style.borderColor = theme.accent }}
    onBlur={(e) => { e.target.style.borderColor = theme.border }}
    {...props}
  />
)

export const IconButton = ({ children, onClick, title, style = {}, danger = false, ...props }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: 'transparent',
      border: 'none',
      color: danger ? theme.danger : theme.textMuted,
      cursor: 'pointer',
      padding: 6,
      borderRadius: radius.sm,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger ? theme.dangerBg : theme.bgElevated
      e.currentTarget.style.color = danger ? theme.danger : theme.textPrimary
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent'
      e.currentTarget.style.color = danger ? theme.danger : theme.textMuted
    }}
    {...props}
  >
    {children}
  </button>
)

export const Modal = ({ open, onClose, title, children, maxWidth = 720 }) => {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: radius.lg,
          maxWidth, width: '100%', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {title && (
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{title}</div>
            <IconButton onClick={onClose} title="Fermer">✕</IconButton>
          </div>
        )}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export const Label = ({ children, style = {} }) => (
  <div style={{
    fontSize: 11,
    fontWeight: 600,
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
    ...style,
  }}>
    {children}
  </div>
)

export const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <Label>{label}</Label>
    {children}
  </div>
)
