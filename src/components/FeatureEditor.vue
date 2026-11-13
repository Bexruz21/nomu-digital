<script setup>
import { reactive, ref } from 'vue'
import Dialog from './Dialog.vue'
import Icon from './Icon.vue'
import { labels } from '../features.js'
import { dateKey, statuses } from '../data.js'
import { t, tr } from '../i18n.js'
import { validateFeature } from '../workspace.js'
const props=defineProps({config:Object,record:Object,profile:Object,brand:Object})
const emit=defineEmits(['save','close'])
const draft=reactive(Object.fromEntries(props.config.fields.map(field=>[field.key,field.type==='number'?0:field.type==='date'?dateKey():field.type==='color'?props.brand?.color||'#9377ff':field.options?.[0]||''])))
Object.assign(draft,props.record||{})
if(!props.record && props.config.id==='assets') {draft.headline=props.profile.name;draft.body=props.profile.offer}
if(!props.record && props.config.id==='brandkits') {draft.voice=props.profile.voice;draft.font='Arial'}
const error=ref(''),loading=ref(false)
const label=value=>t(labels[value]||statuses[value]?.label||value)
async function upload(event) {
  const file=event.target.files[0]
  if(!file) return
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>1024*1024){error.value=tr('PNG, JPG yoki WebP tanlang, 1 MB gacha.','Выберите PNG, JPG или WebP до 1 МБ.','Choose PNG, JPG or WebP up to 1 MB.');return}
  loading.value=true
  try {draft.image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})} catch {error.value=tr('Fayl o‘qilmadi.','Не удалось прочитать файл.','Could not read file.')} finally {loading.value=false}
}
function save() {
  error.value=''
  try { validateFeature(props.config.id,draft);emit('save',{...draft},()=>emit('close')) } catch(e) {error.value=e.message}
}
</script>
<template>
  <Dialog wide :title="tr(record?'Yozuvni tahrirlash':'Yangi yozuv',record?'Редактировать запись':'Новая запись',record?'Edit record':'New record')" :subtitle="t(config.label)" @close="emit('close')">
    <form class="dialog-body record-form" @submit.prevent="save">
      <div class="form-grid feature-fields">
        <label v-for="field in config.fields" :key="field.key" class="field" :class="{'span-2': ['textarea','image'].includes(field.type)}">
          <span>{{ t(field.label) }} <small v-if="field.key==='title'">*</small></span>
          <textarea v-if="field.type==='textarea'" v-model="draft[field.key]" :rows="field.key==='html'?7:3" :maxlength="field.key==='html'?50000:12000" :spellcheck="field.key!=='html'"></textarea>
          <select v-else-if="field.type==='select'" v-model="draft[field.key]"><option v-for="option in field.options" :key="option" :value="option">{{label(option)}}</option></select>
          <template v-else-if="field.type==='image'"><input type="file" accept="image/png,image/jpeg,image/webp" @change="upload"/><img v-if="draft.image" class="upload-preview" :src="draft.image" :alt="draft.title"/><button v-if="draft.image" class="button button-text" type="button" @click="draft.image=''">{{tr('Rasmni olib tashlash','Убрать изображение','Remove image')}}</button></template>
          <input v-else-if="field.type==='number'" v-model.number="draft[field.key]" type="number" min="0" max="1000000000" step="0.01" required/>
          <input v-else v-model="draft[field.key]" :type="field.type" :required="field.key==='title'||field.type==='date'" :maxlength="field.key==='title'?110:1000" :autofocus="field.key==='title'"/>
        </label>
      </div>
      <p v-if="error" class="field-error" role="alert">{{error}}</p>
      <div class="dialog-actions"><button class="button button-secondary" type="button" @click="emit('close')">{{tr('Bekor qilish','Отмена','Cancel')}}</button><button class="button button-primary" :disabled="loading"><Icon name="check" :size="16"/>{{tr('Saqlash','Сохранить','Save')}}</button></div>
    </form>
  </Dialog>
</template>
