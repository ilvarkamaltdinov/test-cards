import {ref} from "vue";
import {object, string, number} from 'yup';
import {addCard} from "./cards";
import {closeModal} from "./modal";

export type Form = {
    id: number | null
    title: string
    project: string | boolean
    stage: string,
    score: string
}

export const form = ref<Form>({
    id: null,
    title: '',
    project: '',
    stage: '',
    score: ''
})

export const schema = object().shape({
    title: string()
        .min(5, 'Минимум 5 символов')
        .max(70, 'Максимум 70 символов')
        .required('Обязательное поле'),
    stage: string()
        .required('Обязательное поле'),
    score: number().typeError('Обязательное поле').positive('Положительное число')
        .required('Обязательное поле')
});


export function validateForm() {
    return schema.validate(form.value, {abortEarly: false})
        .then(() => {
            closeModal()
            return true
        })
        .catch(err => {
            err.inner.forEach((error: { path: string | number; message: any; }) => {
                // @ts-ignore
                errors.value[error.path] = error.message;
            });
            return false
        });
}

export async function submit() {
    if (await validateForm()) {
        addCard({
            "id": new Date().getTime(),
            "title": form.value.title,
            "stage": form.value.stage,
            "project": form.value.project,
            "score": Number(form.value.score)
        })
    }
}

export const errors = ref({
    title: '',
    stage: '',
    score: '',
})

export function clearErrors() {
    errors.value.title = '';
    errors.value.stage = '';
    errors.value.score = '';
}


export function clearForm() {
    form.value.id = null;
    form.value.title = '';
    form.value.project = '';
    form.value.stage = '';
    form.value.score = '';
}

export function validate(field: string) {
    schema.validateAt(field, form.value).then(() => {
        // @ts-ignore
        errors.value[field] = ''
    }).catch(err => {
        // @ts-ignore
        errors.value[field] = err.message
    })
}