import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import '../../shared/styles/index.css';
import Page from '../../shared/components/Page';

const HomePage: React.FC = () => {
  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        Links
      </Typography>
      <div>
        <div>
          <Link to="/yup">yup</Link>
        </div>
        <div>
          <Link to="/yupNested">yupNested</Link>
        </div>
        <div>
          <Link to="/userList">ユーザー一覧</Link>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;