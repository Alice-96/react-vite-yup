import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Page from '../../../shared/components/Page';
import { Button, Stack, TextField, Typography } from '@mui/material';

interface FormikValuesProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number | null;
}

const BasicValidationPage: React.FC = () => {
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string().required('必須項目です'),
      lastName: Yup.string().required('必須項目です'),
      email: Yup.string().required('必須項目です'),
      password: Yup.string().required('必須項目です'),
      age: Yup.number()
        .min(0, '適切な値を入力してください')
        .max(130, '適切な値を入力してください')
        .nullable(),
    });
  }, []);

  const formik = useFormik<FormikValuesProps>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      age: null,
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        Simple Yup
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="firstName"
            variant="standard"
            sx={{ width: '200px' }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="lastName"
            variant="standard"
            sx={{ width: '200px' }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            fullWidth
            id="age"
            name="age"
            label="age"
            variant="standard"
            sx={{ width: '100px' }}
            value={formik.values.age}
            onChange={formik.handleChange}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="standard"
            sx={{ width: '300px' }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="standard"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={() => formik.handleSubmit()}
        >
          Submit
        </Button>
      </Stack>
    </Page>
  );
};

export default BasicValidationPage;