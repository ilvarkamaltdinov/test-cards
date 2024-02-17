import {app} from '@/main';
import {ref, computed} from "vue";
import {chosenProject, projects} from "./projects";
import {form, validateForm} from "./form";

export type Card = {
    id: number,
    title: string,
    stage: string,
    project: string | boolean,
    projectName?: string | boolean,
    score: number
}

export const getCards = (ms: number) => {
    const serverCards: Card[] = [
        {
            "id": 1,
            "title": "Карточка 1",
            "stage": "stage-1",
            "project": false,
            "score": 3.2
        },
        {
            "id": 2,
            "title": "Карточка 2",
            "stage": "stage-1",
            "project": "project-1",
            "score": 2
        },
        {
            "id": 3,
            "title": "Карточка 3",
            "stage": "stage-1",
            "project": "project-2",
            "score": 5
        },
        {
            "id": 4,
            "title": "Карточка 4",
            "stage": "stage-1",
            "project": "project-1",
            "score": 3
        },
        {
            "id": 5,
            "title": "Карточка 5",
            "stage": "stage-2",
            "project": "project-1",
            "score": 5
        },
        {
            "id": 6,
            "title": "Карточка 6",
            "stage": "stage-3",
            "project": "project-2",
            "score": 2
        },
        {
            "id": 7,
            "title": "Карточка 7",
            "stage": "stage-3",
            "project": "project-1",
            "score": 4
        },
        {
            "id": 8,
            "title": "Карточка 8",
            "stage": "stage-3",
            "project": false,
            "score": 1
        }
    ]
    return new Promise((resolve) => {
        setTimeout(() => resolve(serverCards), ms)
    })
}
export const cards = ref<Card[]>([])
export const currentCards = computed(() => {
    let result: Card[] = []
    if (chosenProject.value) {
        result = cards.value?.filter(card => card.project === chosenProject.value?.code) || []
    } else {
        result = cards.value || []
    }
    result.forEach(card => {
        card.projectName = projects.value?.find(project => project.code === card.project)?.name
    })
    return result
})

export function addCard(card: Card) {
    cards.value?.push(card)
}

export async function editCard() {
    if (await validateForm()) {
        const editedCard: Card | undefined = cards.value?.find(card => Number(card.id) === Number(form.value.id))
        if (editedCard) {
            editedCard.project = form.value.project || false
            editedCard.title = form.value.title
            editedCard.score = Number(form.value.score)
            app.config.globalProperties.$toast.add({
                severity: 'info',
                summary: 'Обновлено',
                detail: `Данные карточки "${form.value.title}" обновлены!`,
                life: 3000
            });
        }

    }

}

export function deleteCard(card: Card) {
    const index = cards.value!.map(card => {
        return card.id;
    }).indexOf(card.id);
    cards.value?.splice(index, 1);
    window.localStorage.setItem('cards', JSON.stringify(cards.value))
    app.config.globalProperties.$toast.add({
        severity: 'info',
        summary: 'Удалено',
        detail: `Карточка "${card.title}" удалена!`,
        life: 3000
    });
}