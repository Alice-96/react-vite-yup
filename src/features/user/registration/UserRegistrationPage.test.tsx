import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import UserRegistrationPage from './UserRegistrationPage'

describe('UserRegistrationPage', () => {
  it('should render all form fields', () => {
    render(<UserRegistrationPage />)
    
    expect(screen.getByLabelText('姓')).toBeInTheDocument()
    expect(screen.getByLabelText('名')).toBeInTheDocument()
    expect(screen.getByLabelText('年齢')).toBeInTheDocument()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
  })

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<UserRegistrationPage />)
    
    // 登録ボタンをクリック
    await user.click(screen.getByRole('button', { name: '登録' }))
    
    // バリデーションエラーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('姓を入力してください')).toBeInTheDocument()
      expect(screen.getByText('名を入力してください')).toBeInTheDocument()
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()
    render(<UserRegistrationPage />)
    
    const emailInput = screen.getByLabelText('メールアドレス')
    
    // 無効なメールアドレスを入力
    await user.type(emailInput, 'invalid-email')
    await user.click(screen.getByRole('button', { name: '登録' }))
    
    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('should validate password length', async () => {
    const user = userEvent.setup()
    render(<UserRegistrationPage />)
    
    const passwordInput = screen.getByLabelText('パスワード')
    
    // 短いパスワードを入力
    await user.type(passwordInput, '123')
    await user.click(screen.getByRole('button', { name: '登録' }))
    
    await waitFor(() => {
      expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument()
    })
  })
})