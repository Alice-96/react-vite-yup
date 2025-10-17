import React from 'react';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  // 事前に用意したusersの配列
  const users: User[] = [
    {
      id: 1,
      name: '田中太郎',
      email: 'tanaka@example.com',
      role: '管理者'
    },
    {
      id: 2,
      name: '佐藤花子',
      email: 'sato@example.com',
      role: '一般ユーザー'
    },
    {
      id: 3,
      name: '山田次郎',
      email: 'yamada@example.com',
      role: '編集者'
    },
    {
      id: 4,
      name: '鈴木美咲',
      email: 'suzuki@example.com',
      role: '一般ユーザー'
    },
    {
      id: 5,
      name: '高橋健太',
      email: 'takahashi@example.com',
      role: '管理者'
    }
  ];

  return (
    <Box>
      <Typography component="h2" variant="h6" color="primary">
        ユーザー一覧
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} divider>
            <ListItemText
              primary={user.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {user.email}
                  </Typography>
                  {' — '}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;