import React, { memo } from 'react'
import { TextField, Stack } from '@mui/material'
import { FormikProps } from 'formik'

interface FormikValuesProps {
  firstName: string
  lastName: string
  email: string
  password: string
  age: number | null
}

interface UserFormFieldsProps {
  formik: FormikProps<FormikValuesProps>
}

const UserFormFields: React.FC<UserFormFieldsProps> = memo(({ formik }) => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label="姓"
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
          label="名"
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
          label="年齢"
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
          label="メールアドレス"
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
          label="パスワード"
          type="password"
          variant="standard"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </Stack>
    </>
  )
})

UserFormFields.displayName = 'UserFormFields'

export default UserFormFields
