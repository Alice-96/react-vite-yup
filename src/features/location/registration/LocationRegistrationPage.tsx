import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Page from '../../../shared/components/Page';
import { Button, Stack, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FormikValuesProps {
  name: string;
  type: string;
  areaInfo: { area: string };
}

const LocationRegistrationPage: React.FC = () => {
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('拠点名を入力してください'),
      type: Yup.string().required('拠点タイプを選択してください'),
      areaInfo: Yup.object().when(['type'], {
        is: (type: string) => type === 'A',
        then: () => Yup.object({ area: Yup.string() }),
        otherwise: () => Yup.object({ area: Yup.string().required('エリアを入力してください') }),
      }),
    });
  }, []);

  const formik = useFormik<FormikValuesProps>({
    initialValues: {
      name: '',
      type: '',
      areaInfo: { area: '' },
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        拠点登録
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="拠点名"
          variant="standard"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        
        <FormControl variant="standard" fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
          <InputLabel id="type-label">拠点タイプ</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            label="拠点タイプ"
          >
            <MenuItem value="A">タイプA（本社）</MenuItem>
            <MenuItem value="B">タイプB（支社）</MenuItem>
            <MenuItem value="C">タイプC（営業所）</MenuItem>
          </Select>
          {formik.touched.type && formik.errors.type && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {formik.errors.type}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          id="areaInfo.area"
          name="areaInfo.area"
          label="エリア"
          variant="standard"
          value={formik.values.areaInfo.area}
          onChange={formik.handleChange}
          error={formik.touched.areaInfo?.area && Boolean(formik.errors.areaInfo?.area)}
          helperText={formik.touched.areaInfo?.area && formik.errors.areaInfo?.area}
          disabled={formik.values.type === 'A'}
        />

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
    </Page>
  );
};

export default LocationRegistrationPage;