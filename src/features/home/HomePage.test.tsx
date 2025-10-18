import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'

// テスト用のRouter Wrapper
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('HomePage', () => {
  it('should render the page title', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Links')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    renderWithRouter(<HomePage />)

    expect(
      screen.getByRole('link', { name: 'ユーザー登録' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '拠点登録' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'ユーザー一覧' })
    ).toBeInTheDocument()
  })

  it('should have correct href attributes for links', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('link', { name: 'ユーザー登録' })).toHaveAttribute(
      'href',
      '/user-registration'
    )
    expect(screen.getByRole('link', { name: '拠点登録' })).toHaveAttribute(
      'href',
      '/location-registration'
    )
    expect(screen.getByRole('link', { name: 'ユーザー一覧' })).toHaveAttribute(
      'href',
      '/user-list'
    )
  })
})
