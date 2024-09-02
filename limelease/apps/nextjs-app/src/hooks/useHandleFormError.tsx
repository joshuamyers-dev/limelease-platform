import { useEffect } from 'react';
import { FormInstance, message } from 'antd';
import { ApolloError } from '@apollo/client';

const useHandleFormError = (error: ApolloError | undefined, form: FormInstance, errorKeyToFieldName: any) => {
  useEffect(() => {
    if (error?.message) {
      const errorKey = Object.keys(errorKeyToFieldName).find((key) => error.message.includes(key));

      if (errorKey) {
        form.setFields([
          {
            name: errorKeyToFieldName[errorKey as keyof typeof errorKeyToFieldName],
            errors: ['Invalid format'],
          },
        ]);
      } else {
        message.error(error.message);
      }
    }
  }, [error, form]);
};

export default useHandleFormError;
