export type Card = {
    id: number,
    title: string,
    stage: string,
    project: string | boolean,
    projectName?: string | boolean,
    score: number
}
export const cards: Card[] = [
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

export const getCards = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(cards), ms)
    })
}
