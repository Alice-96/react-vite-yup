import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Page from './Page';
import { Typography } from '@mui/material';
interface FormikValuesProps {
  name: string;
  type: string;
  areaInfo: { area: string };
}

const YupTrialNestedNested: React.FC = () => {
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('必須項目です'),
      type: Yup.string().required('必須項目です'),
      areaInfo: Yup.object().when(['type'], {
        is: (type: string) => type === 'A',
        then: Yup.object({ area: Yup.string() }),
        otherwise: Yup.object({ area: Yup.string().required('必須項目です') }),
      }),
    });
  }, []);

  const formik = useFormik<FormikValuesProps>({
    initialValues: {
      name: '',
      type: '',
      areaInfo: { area: 'test' },
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        Nested Yup
      </Typography>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />

        <p style={{ color: 'red', fontSize: '8px' }}>{formik.errors.name}</p>
      </div>
      <div>
        <label htmlFor="type">Type</label>
        <input
          type="text"
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
        />

        <p style={{ color: 'red', fontSize: '8px' }}>{formik.errors.type}</p>
      </div>
      <div>
        <label htmlFor="type">AreaInfo.Area</label>
        <input
          type="text"
          name="areaInfo.area"
          value={formik.values.areaInfo.area}
          onChange={formik.handleChange}
        />
        <p style={{ color: 'red', fontSize: '8px' }}>
          {formik.errors.areaInfo?.area}
        </p>
      </div>
    </Page>
  );
};

export default YupTrialNestedNested;
