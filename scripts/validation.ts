import {object, string, number} from 'yup';

export const schema = object().shape({
    title: string()
        .min(5, 'Минимум 5 символов')
        .max(70, 'Максимум 70 символов')
        .required('Обязательное поле'),
    stage: string()
        .required('Обязательное поле'),
    score: number().positive('Положительное число')
        .required('Обязательное поле')
});