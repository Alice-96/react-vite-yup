import React, { useMemo, useState, useCallback } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Page from '../../../shared/components/Page'
import { Button, Stack, Typography } from '@mui/material'
import { UserRegistrationConfirmDialog, UserFormFields } from './components'

interface FormikValuesProps {
  firstName: string
  lastName: string
  email: string
  password: string
  age: number | null
}

const UserRegistrationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 初期値をメモ化してパフォーマンス最適化
  const initialValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      age: null,
    }),
    []
  )

  // バリデーションスキーマをメモ化してパフォーマンス最適化
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string().required('姓を入力してください'),
      lastName: Yup.string().required('名を入力してください'),
      email: Yup.string()
        .email('有効なメールアドレスを入力してください')
        .required('メールアドレスを入力してください'),
      password: Yup.string()
        .min(8, 'パスワードは8文字以上で入力してください')
        .required('パスワードを入力してください'),
      age: Yup.number()
        .min(0, '0歳以上で入力してください')
        .max(130, '130歳以下で入力してください')
        .nullable(),
    })
  }, [])

  const formik = useFormik<FormikValuesProps>({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      setIsModalOpen(true)
    },
  })

  // コールバック関数をメモ化してパフォーマンス最適化
  const handleConfirmSubmit = useCallback(() => {
    // 実際の登録処理をここに書く
    console.log('ユーザー登録処理:', formik.values)
    setIsModalOpen(false)
    // 登録完了後の処理（例：成功メッセージ表示、リダイレクトなど）
  }, [formik.values])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        ユーザー登録
      </Typography>
      <Stack spacing={2}>
        <UserFormFields formik={formik} />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={() => formik.handleSubmit()}
        >
          登録
        </Button>
      </Stack>

      {/* 確認モーダル */}
      <UserRegistrationConfirmDialog
        open={isModalOpen}
        userData={formik.values}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </Page>
  )
}

export default UserRegistrationPage
