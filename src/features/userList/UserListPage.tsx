import React from 'react';
import Page from '../../shared/components/Page';
import { UserList } from './components';

const UserListPage: React.FC = () => {
  return (
    <Page>
      <UserList />
    </Page>
  );
};

export default UserListPage;