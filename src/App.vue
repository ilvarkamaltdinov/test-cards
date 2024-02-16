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
        <Button class="button button--primary" @click="openModal('page')">Добавить карточку</Button>
        <Toast position="bottom-right"/>
        <SplitButton class="button--primary-wrapper" label="Сохранить изменения" @click="save" :model="splitButtons"/>
      </template>
    </MainHeader>
    <section class="stages">
      <div class="stages__list">
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
            <MiniCard v-for="card in slotProps.items" :key="card.id"
                      :draggable="true"
                      @dragstart="startDrag($event, card)"
            >
              <template #title>
                {{ card.title }}
              </template>
              <template #controls>
                <button @click="openModal('card', null, card)" class="button button--icon">
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
            <button class="button button--add" @click="openModal(stage.name, stage.code)">
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
      <div class="stages__list" v-if="!currentStages">
        <div class="skeleton skeleton--stage" v-for="i in 4" :key="i"></div>
      </div>
    </section>
    <Dialog class="modal" @hide="closeModal" v-model:visible="modalData.visible" modal :draggable="false">
      <template #header>
        <div class="modal__header">
          <h2 class="heading heading--h2-modal">
            {{ modalData.data.title }}
          </h2>
          <div class="heading__label">
            {{ modalData.data.label }}
          </div>
        </div>
      </template>
      <div class="modal__body">
        <form action="" class="form__group" @submit.prevent="validateForm">
          <div class="form__group-item">
            <label class="form__group-label">Заголовок *:</label>
            <InputText
                @change="validate('title')"
                :invalid="errors.title !== ''" v-model="form.title" class="input" autocomplete="off"
                placeholder="Заголовок"/>
            <InlineMessage v-if="errors.title !== ''" severity="error">{{ errors.title }}</InlineMessage>
          </div>
          <div class="form__group-item">
            <label class="form__group-label">Проект:</label>
            <Dropdown v-model="form.project" class="input" optionLabel="name" :options="currentProjects"
                      optionValue="code"
                      placeholder="Не выбрано"/>
          </div>
          <div class="form__group-item" v-if="modalData.data.type === 'page'">
            <label class="form__group-label">Стадия *:</label>
            <Dropdown @change="validate('stage')" :invalid="errors.stage !== ''" v-model="form.stage" class="input"
                      optionLabel="name"
                      optionValue="code"
                      :options="currentStages"
                      placeholder="Не выбрано"/>
            <InlineMessage v-if="errors.stage !== ''" severity="error">{{ errors.stage }}</InlineMessage>
          </div>
          <div class="form__group-item">
            <label class="form__group-label">Балл *:</label>
            <InputText @change="validate('score')" :invalid="errors.score !== ''" v-model="form.score"
                       class="input input--short" autocomplete="off"
                       placeholder="Балл"/>
            <InlineMessage v-if="errors.score !== ''" severity="error">{{ errors.score }}</InlineMessage>
          </div>
          <div class="form__controls">
            <Button v-if="!modalData.data.type === 'card'" type="submit" @click.prevent="validateForm"
                    class="button button--primary">Добавить
            </Button>
            <Button v-if="modalData.data.type === 'card'" type="submit" @click.prevent="editCard"
                    class="button button--primary">Обновить
            </Button>
            <Button v-if="modalData.data.type === 'page'" class="button button--opacity" @click="closeModal">Назад
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MiniCard from "./components/MiniCard.vue";
import {computed, ref} from "vue";
import {getStages, Stage} from "../scripts/stages";
import {getCards, Card} from "../scripts/cards";
import {getProjects, Project} from "../scripts/projects";
import MainHeader from "@/components/MainHeader.vue";
import DataView from 'primevue/dataview';
import Toast from 'primevue/toast';
import {useToast} from "primevue/usetoast";
import {schema} from "../scripts/validation";
import InlineMessage from 'primevue/inlinemessage';

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

const stages = ref<Stage[]>()
const cards = ref<Card[]>()
const projects = ref<Project[]>()

const localStages = window.localStorage.getItem('stages')
const localCards = window.localStorage.getItem('cards')
const localProjects = window.localStorage.getItem('projects')

function request() {
  Promise.all([getStages(500), getCards(800), getProjects(500)]).then(data => {
    stages.value = data[0]
    cards.value = data[1]
    projects.value = data[2]
  })
}

//Проверка на localStorage
if (localStages && localCards && localProjects) {
  stages.value = JSON.parse(localStages)
  cards.value = JSON.parse(localCards)
  projects.value = JSON.parse(localProjects)
} else {
  request()
}

const currentProjects = computed(() => {
  return projects.value || []
})
const chosenProject = ref<Project | null>(null)

const currentCards = computed(() => {
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

const currentStages = computed(() => {
  return stages.value?.map(stage => {
    stage.cards = currentCards.value?.filter(card => card.stage === stage.code)
    return stage
  })
})

const modalData = ref({
  visible: false,
  data: {
    title: '',
    label: '',
    type: ''
  }
})

function openModal(type: string, code?: string | null, card?: Card) {
  modalData.value.visible = true
  if (type === 'page') {
    modalData.value.data.title = 'Основные данные'
    modalData.value.data.label = 'Чтобы добавить карточку, нужно заполнить данные'
    modalData.value.data.type = 'page'
  } else if (type === 'card') {

    modalData.value.data.title = 'Внести изменения'
    modalData.value.data.label = card?.title || ''
    modalData.value.data.type = 'card'

    form.value.id = card?.id
    form.value.title = card?.title || ''
    form.value.project = card?.project || false
    form.value.stage = card?.stage || ''
    form.value.score = card?.score || ''

  } else {
    form.value.stage = code || '';
    modalData.value.data.title = 'Добавление'
    modalData.value.data.label = type
    modalData.value.data.type = 'stage'
  }
}

function closeModal() {
  modalData.value.visible = false
  modalData.value.data.title = ''
  modalData.value.data.label = ''
  modalData.value.data.type = ''

  clearErrors()
  clearForm()
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

const form = ref({
  id: null,
  title: '',
  project: '',
  stage: '',
  score: ''
})
const errors = ref({
  title: '',
  stage: '',
  score: '',
})

function clearErrors() {
  errors.value.title = '';
  errors.value.stage = '';
  errors.value.score = '';
}

function clearForm() {
  form.value.title = '';
  form.value.project = '';
  form.value.stage = '';
  form.value.score = '';
}


function addCard(newCard: Card) {
  cards.value?.push(newCard)
  closeModal();
}

function validate(field: string) {
  schema.validateAt(field, form.value).then(() => {
    errors.value[field] = ''
  }).catch(err => {
    errors.value[field] = err.message
  })
}

function editCard() {
  let findedCard = cards.value?.find(card => card.id === form.value.id)
  findedCard.project = form.value.project
  findedCard.title = form.value.title
  findedCard.score = form.value.score
  toast.add({
    severity: 'info',
    summary: 'Обновлено',
    detail: `Данные карточки "${form.value.title}" обновлены!`,
    life: 3000
  });
  closeModal()
}

function validateForm() {
  schema
      .validate(form.value, {abortEarly: false})
      .then(() => {
        clearErrors()
        let newCard = {
          "id": new Date().getTime(),
          "title": form.value.title,
          "stage": form.value.stage,
          "project": form.value.project || false,
          "score": Number(form.value.score)
        }
        addCard(newCard)
      })
      .catch(err => {
        err.inner.forEach(error => {
          errors.value[error.path] = error.message;
        });
      });
}

function deleteCard(card: Card) {
  let index = cards.value!.map(card => {
    return card.id;
  }).indexOf(card.id);
  cards.value?.splice(index, 1);
  window.localStorage.setItem('cards', JSON.stringify(cards.value))
  toast.add({severity: 'info', summary: 'Удалено', detail: `Карточка "${card.title}" удалена!`, life: 3000});
}

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

$color-white: #fff;
$color-grey: #7D8CA1;
$color-text: #38393D;
$color-primary: #7CABE3;
$color-label: #71747C;
$color-bg: #D5DCE5;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #38393D;
}

.input {
  background: #F0F3F8;
  border-radius: 4px;
  box-shadow: none;
  padding: 8px 8px 8px 12px;
}

.stage {
  width: 320px;
  padding: 12px;
  background: #D5DCE5;
}

.stage__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.p-tooltip-text {
  padding: 4px;
  font-size: 10px;
}

.p-toast-message {
  padding: 12px;

}

.p-toast-message-text {
  margin-left: 8px;
}

.p-inline-message {
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
}

.p-inline-message svg {
  display: none;
}

.p-inline-message-text {
  font-size: 12px;
}

.p-dataview .p-dataview-header {
  background: inherit;
  border: none;
}

.p-dataview .p-dataview-footer {
  background: inherit;
  border: none;
  margin-top: 12px;
}

.stage__header-sort {
  display: flex;
  align-items: center;
  gap: 1px;
}


.stage__header--title {
  padding-left: 12px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: #7D8CA1;
    top: calc(50% - 2px);
    left: 0;
  }
}

.stage__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stage__footer {
  margin-top: 12px;
}

.stage__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #BAC4D0;
  height: 120px;
  border-radius: 4px;
  color: #7D8CA1;
  font-size: 13px;
}

.input--short {
  width: 80px;
}

.modal {
  width: 420px;
  padding: 30px;
}

.skeleton {
  background: #D5DCE5;
}

.p-dropdown-item {
  padding: 4px 12px;
}

.skeleton--stage {
  min-width: 320px;
  height: 580px;
}

.heading--h1 {
  font-size: 32px;
}

.heading--h2 {
  font-size: 15px;
}

.heading--h2-modal {
  font-size: 20px;
}

.heading__label {
  margin-top: 4px;
  font-size: 12px;
  color: #71747C;
}

.p-dropdown-label {
  display: flex;
  align-items: center;
}

.p-dataview-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: inherit;
}

.modal__body {
  margin-top: 20px;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form__group-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form__controls {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 40px;
}

.form__group-label {
  font-size: 12px;
  color: #71747C;
}

.heading--h3 {
  font-size: 14px;
}


.container {
  max-width: 1340px;
  margin: 0 auto;
  padding: 24px;
}

.button {
  border-radius: 4px;
  padding: 8px 20px;
  border: none;
  cursor: pointer;
}

.p-button {
  border-radius: 4px;
  padding: 8px 20px;
  border: none;
  cursor: pointer;
}

.p-button-icon-only {
  padding: 0;
}

.button--primary {
  background: $color-primary;
  color: $color-white;
}

.button--primary-wrapper {
  background: $color-primary;
  color: $color-white;
}

.button--primary-wrapper .p-button {
  background: none;
  border: none;
}

.p-menuitem-content {
  padding: 8px 24px;
}

.p-button-label {
  background: inherit;
}

.button--opacity {
  background: inherit;
  color: #7D8CA1;
}

.button--add {
  width: 100%;
  color: #7D8CA1;
  background: inherit;
}

.button--icon {
  width: 18px;
  min-width: 18px;
  height: 18px;
  padding: 0;
  background: inherit;

  &:hover {
    img {
      opacity: 1;
    }
  }
}

.button--icon img {
  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
  transition: .24s;
  opacity: .64;
}

.button--icon-drag {
  cursor: grab;
}


.stages {
  margin-top: 20px;
}

.stages__list {
  display: flex;
  gap: 20px;
  width: 100%;
  overflow-x: scroll;
  align-items: flex-start;
  padding-bottom: 16px;
}

.stages__list-empty {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7D8CA1;
  font-size: 13px;
  border-radius: 4px;
  border: 1px dashed #7D8CA1;
}

.stock {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  color: #7D8CA1;
  background: #E5E9EF;
  border: 1px solid #D2DAE4;
  width: max-content;
}

</style>
