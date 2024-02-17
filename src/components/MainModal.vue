<template>
  <Dialog class="modal" @hide="closeModal" v-model:visible="visible" modal :draggable="false">
    <template #header>
      <div class="modal__header" v-if="currentModal">
        <h2 class="heading heading--h2-modal">
          {{ currentModal.title }}
        </h2>
        <div class="heading__label">
          {{ currentModal.label }}
        </div>
      </div>
    </template>
    <div class="modal__body" v-if="currentModal">
      <form action="" class="form__group" @submit.prevent="currentModal.formAction()">
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
        <div class="form__group-item" v-if="currentModal.type === 'page'">
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
          <Button v-for="(button, key) in currentModal.buttons" :key="key"
                  :class="button.classList"
                  @click.prevent="button.action">
            {{ button.title }}
          </Button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {closeModal, currentModal, visible} from "../../scripts/modal";
import {form, errors, validate} from "../../scripts/form";
import {currentProjects} from "../../scripts/projects";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InlineMessage from "primevue/inlinemessage";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import {currentStages} from "../../scripts/stages";

</script>