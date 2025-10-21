import React, { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Stack,
  Typography,
} from '@mui/material'

interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
  age: number | null
}

interface UserRegistrationConfirmDialogProps {
  open: boolean
  userData: UserData
  onClose: () => void
  onConfirm: () => void
}

const UserRegistrationConfirmDialog: React.FC<UserRegistrationConfirmDialogProps> =
  memo(({ open, userData, onClose, onConfirm }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="confirm-dialog-title">登録確認</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            以下の内容でユーザー登録を行います。よろしいですか？
          </DialogContentText>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>姓:</strong> {userData.firstName}
            </Typography>
            <Typography variant="body2">
              <strong>名:</strong> {userData.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>メールアドレス:</strong> {userData.email}
            </Typography>
            {userData.age && (
              <Typography variant="body2">
                <strong>年齢:</strong> {userData.age}歳
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            キャンセル
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained">
            登録する
          </Button>
        </DialogActions>
      </Dialog>
    )
  })

UserRegistrationConfirmDialog.displayName = 'UserRegistrationConfirmDialog'

export default UserRegistrationConfirmDialog
