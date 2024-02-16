<template>
  <article class="card">
    <div class="card__header">
      <div class="card__header-group">
        <h3 class="heading heading--h3">
          <slot name="title"></slot>
        </h3>
        <div class="card__header-controls">
          <slot name="controls"></slot>
        </div>
      </div>
      <slot name="drag"></slot>
    </div>
    <div class="card__body">
      <slot name="body">

      </slot>
    </div>
    <div class="card__footer">
      <slot name="footer">

      </slot>
    </div>
  </article>
</template>