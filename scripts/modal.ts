import {ref} from "vue";
import {Card, editCard} from "./cards";
import {clearErrors, clearForm, form, submit} from "./form";
import {Stage} from "./stages";

export const visible = ref(false)

type Modal = {
    type: string
    title: string
    label: string
    formAction(): void
    buttons: {
        title: string
        classList: string[]
        action(): void

    }[]
}
export const modalTypes = ref<Modal[]>([
    {
        type: 'page',
        title: 'Основные данные',
        label: 'Чтобы добавить карточку, нужно заполнить данные',
        buttons: [
            {
                title: 'Добавить',
                classList: ['button', 'button--primary'],
                action: submit
            },
            {
                title: 'Назад',
                classList: ['button', 'button--opacity'],
                action: closeModal
            }
        ],
        formAction: submit
    },
    {
        type: 'stage',
        title: 'Добавление',
        label: '',
        buttons: [
            {
                title: 'Добавить',
                classList: ['button', 'button--primary'],
                action: submit
            }
        ],
        formAction: submit
    },
    {
        type: 'edit',
        title: 'Внести изменения',
        label: '',
        buttons: [
            {
                title: 'Обновить',
                classList: ['button', 'button--primary'],
                action: editCard
            }
        ],
        formAction: editCard
    }
])
export const currentModal = ref<Modal | null>(null)

type Payload = {
    type: string,
    card?: Card
    stage?: Stage
}

export function openModal(payload: Payload) {
    try {
        currentModal.value = modalTypes.value.find(item => item.type === payload.type) || null
        if (payload.stage) {
            currentModal.value ? currentModal.value.label = payload.stage.name : ''
            form.value.stage = payload.stage.code
        }
        if (payload.card) {
            currentModal.value ? currentModal.value.label = payload.card.title : ''
            form.value.id = payload.card.id
            form.value.title = payload.card.title
            form.value.stage = payload.card.stage
            form.value.project = payload.card.project
            form.value.score = String(payload.card.score)
        }
        visible.value = true
    } catch {
        visible.value = false
    }
}

export function closeModal() {
    visible.value = false
    // setTimeout чтобы ошибки не пропадали и форма не очищалась,
    // пока проигрывается анимация скрытия модалки
    setTimeout(function () {
        currentModal.value = null
        clearErrors();
        clearForm();
    }, 200)
}

