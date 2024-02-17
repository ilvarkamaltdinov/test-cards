<template>
  <div class="container">
    <MainHeader>
      <template #title>
        Карточки
      </template>
      <template #left-controls>
        <div class="header__controls-group-label">Проект:</div>
        <Dropdown v-model="chosenProject"
                  class="input"
                  optionLabel="name" :options="currentProjects"
                  placeholder="Не выбрано"/>
        <button v-if="chosenProject" @click="chosenProject = null" class="button button--opacity">Сбросить</button>
      </template>
      <template #right-controls>
        <Button class="button button--primary" @click="openModal({type:'page'})">Добавить карточку</Button>
        <SplitButton class="button--primary-wrapper" label="Сохранить изменения" @click="save" :model="splitButtons"/>
      </template>
    </MainHeader>
    <section class="stages">
      <div class="stages__list" v-if="currentStages.length">
        <DataView class="stage" v-for="stage in currentStages" :key="stage.id" :value="stage.cards"
                  :sortOrder="stage.sort" :sortField="'score'"
                  @drop="onDrop($event, stage.code)"
                  @dragover.prevent
                  @dragenter.prevent>
          <template #header>
            <div class="stage__header">
              <h2 class="heading heading--h2 stage__header--title">
                {{ stage.name }}
              </h2>
              <div class="stage__header-sort">
                <button v-tooltip.top="'По убыванию'" class="button button--icon" @click="stage.sort = 1">
                  <img alt="dropdown icon" src="./assets/icons/icon-arrow-bottom.svg">
                </button>
                <button v-tooltip.top="'По возрастанию'" class="button button--icon" @click="stage.sort = -1">
                  <img alt="dropdown icon" src="./assets/icons/icon-arrow-top.svg">
                </button>
              </div>
            </div>
          </template>
          <template #list="slotProps">
            <MiniCard v-for="card in slotProps.items as Card[]" :key="card.id"
                      :draggable="true"
                      @dragstart="startDrag($event, card)"
            >
              <template #title>
                {{ card.title }}
              </template>
              <template #controls>
                <button @click="openModal({type:'edit', card:card})" class="button button--icon">
                  <img alt="dropdown icon" src="./assets/icons/icon-edit.svg">
                </button>
                <button class="button button--icon" @click="deleteCard(card)">
                  <img alt="dropdown icon" src="./assets/icons/icon-del.svg">
                </button>
              </template>
              <template #drag>
                <button class="button button--icon button--icon-drag">
                  <img alt="dropdown icon" src="./assets/icons/icon-drag.svg">
                </button>
              </template>
              <template #body>
                <div class="card__body-line">
                  <div>Балл</div>
                  <div class="card__body-line-value">{{ card.score }}</div>
                </div>
              </template>
              <template #footer>
                <div class="stock" v-if="card.projectName">
                  {{ card.projectName }}
                </div>
              </template>
            </MiniCard>
          </template>
          <template #footer>
            <button class="button button--add" @click="openModal({type:'stage', stage:stage})">
              Добавить
            </button>
          </template>
          <template #empty>
            <div class="stage__empty">
              Список пуст
            </div>
          </template>
        </DataView>
      </div>
      <div class="stages__list" v-else>
        <Skeleton class="stage" v-for="i in 4" :key="i"/>
      </div>
    </section>
  </div>
  <MainModal/>
  <Toast position="bottom-right"/>
</template>

<script setup lang="ts">
import {openModal} from "../scripts/modal";
import {getCards, deleteCard, Card, cards} from "../scripts/cards";
import {getProjects, projects, currentProjects, chosenProject, Project} from "../scripts/projects";
import {getStages, Stage, stages, currentStages} from "../scripts/stages";

import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import MiniCard from "./components/MiniCard.vue";
import MainModal from "./components/MainModal.vue";

import MainHeader from "@/components/MainHeader.vue";
import DataView from 'primevue/dataview';
import Toast from 'primevue/toast';
import {useToast} from "primevue/usetoast";
import Skeleton from 'primevue/skeleton';

const toast = useToast();
const splitButtons = [{
  label: 'Сбросить localStorage',
  command: () => {
    window.localStorage.removeItem('stages')
    window.localStorage.removeItem('cards')
    window.localStorage.removeItem('projects')
    toast.add({severity: 'info', summary: 'Удалено', detail: 'Данные удалены из localStorage', life: 3000});
    request()
  }
}]

const localStages = window.localStorage.getItem('stages')
const localCards = window.localStorage.getItem('cards')
const localProjects = window.localStorage.getItem('projects')

//Проверка на localStorage
if (localStages && localCards && localProjects) {
  stages.value = JSON.parse(localStages)
  cards.value = JSON.parse(localCards)
  projects.value = JSON.parse(localProjects)
} else {
  request()
}

function request() {
  Promise.all([getStages(2000), getCards(2000), getProjects(2000)]).then(data => {
    stages.value = data[0] as Stage[]
    cards.value = data[1] as Card[]
    projects.value = data[2] as Project[]
  })
}

function save() {
  window.localStorage.setItem('cards', JSON.stringify(cards.value))
  window.localStorage.setItem('stages', JSON.stringify(stages.value))
  window.localStorage.setItem('projects', JSON.stringify(projects.value))
  toast.add({severity: 'success', summary: 'Готово', detail: 'Изменения успешно сохранены!', life: 3000});
}


function startDrag(evt: any, card: Card) {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('cardID', card.id)
}

function onDrop(evt: any, stageCode: string) {
  const itemID = evt.dataTransfer.getData('cardID')
  const card = cards.value?.find((card) => card.id == itemID)
  card ? card.stage = stageCode : ''
}

</script>

