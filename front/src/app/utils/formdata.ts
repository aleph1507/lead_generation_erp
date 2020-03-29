export function toFormData<T>( formValue: T ): FormData {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    if (value == null) {
      continue;
    }
    formData.append(key, value);
  }

  return formData;
}
