import {projects} from "./projects";
import {Card} from "./cards";

export type Stage = {
    id: number,
    sort: number,
    name: string,
    code: string
    cards?: Card[]
}
export const stages: Stage[] = [
    {
        "id": 1,
        "sort": 10,
        "name": "Стадия 1",
        "code": "stage-1"
    },
    {
        "id": 2,
        "sort": 20,
        "name": "Стадия 2",
        "code": "stage-2"
    },
    {
        "id": 3,
        "sort": 30,
        "name": "Стадия 3",
        "code": "stage-3"
    },
    {
        "id": 4,
        "sort": 40,
        "name": "Стадия 4",
        "code": "stage-4"
    }
]

export const getStages = function (ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(stages), ms)
    })
}