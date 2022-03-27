import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface FormikValuesProps {
  firstName: string;
  lastName: string;
}

const YupTrial: React.FC = () => {
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string().required('必須項目です'),
      lastName: Yup.string().required('必須項目です'),
    });
  }, []);

  const formik = useFormik<FormikValuesProps>({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />

            <p style={{ color: 'red', fontSize: '8px' }}>
              {formik.errors.firstName}
            </p>
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />

            <p style={{ color: 'red', fontSize: '8px' }}>
              {formik.errors.lastName}
            </p>
          </div>
        </header>
      </div>
    </>
  );
};

export default YupTrial;
