import React from 'react'
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { userService, User } from '../../../shared'

const UserList: React.FC = () => {
  const {
    data: userListResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', { page: 1, limit: 10 }],
    queryFn: () => userService.fetchUsers(1, 10),
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          ユーザー情報を読み込み中...
        </Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          ユーザー情報の取得に失敗しました: {(error as Error)?.message}
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          再試行
        </Button>
      </Box>
    )
  }

  const users = userListResponse?.users || []

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography component="h2" variant="h6" color="primary">
          ユーザー一覧
        </Typography>
        <Chip
          label={`総数: ${userListResponse?.total || 0}件`}
          variant="outlined"
          color="primary"
        />
      </Box>

      {users.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          ユーザーが見つかりませんでした。
        </Typography>
      ) : (
        <List>
          {users.map((user: User) => (
            <ListItem key={user.id} divider>
              <ListItemText
                primary={user.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.email}
                    </Typography>
                    {user.company && (
                      <>
                        {' — '}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {user.company.name}
                        </Typography>
                      </>
                    )}
                    {user.phone && (
                      <>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          📞 {user.phone}
                        </Typography>
                      </>
                    )}
                    {user.website && (
                      <>
                        {' | '}
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary"
                          sx={{ textDecoration: 'underline' }}
                        >
                          🌐 {user.website}
                        </Typography>
                      </>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default UserList
