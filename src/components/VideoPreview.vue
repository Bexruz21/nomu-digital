<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { tr } from '../i18n.js'
import Icon from './Icon.vue'
const props=defineProps({item:Object,profile:Object,color:String})
const emit=defineEmits(['notify'])
const canvas=ref(null),playing=ref(false),recording=ref(false),progress=ref(0)
const duration=computed(()=>Math.min(60,Math.max(3,Number(props.item.duration)||15)))
const scenes=computed(()=>[props.item.title,...String(props.item.script||'').split('\n').filter(Boolean),props.profile.name].slice(0,8))
let animation,started,recorder,stream,disposed=false
function paint(seconds=0){
  const surface=canvas.value;if(!surface)return
  const ctx=surface.getContext('2d'),w=surface.width,h=surface.height
  ctx.fillStyle='#101229';ctx.fillRect(0,0,w,h)
  const gradient=ctx.createRadialGradient(w*(.8+Math.sin(seconds)*.06),h*.15,10,w*.8,h*.15,w)
  gradient.addColorStop(0,props.color||'#9377ff');gradient.addColorStop(1,'#101229');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h)
  ctx.strokeStyle='#ffffff22';ctx.lineWidth=2;ctx.beginPath();ctx.arc(w*.9,h*.1,w*.55+Math.sin(seconds)*35,0,Math.PI*2);ctx.stroke()
  ctx.fillStyle='#ffffff';ctx.font='bold 25px Arial';ctx.fillText(props.profile.name.slice(0,36),50,80)
  const index=Math.min(scenes.value.length-1,Math.floor(seconds/duration.value*scenes.value.length))
  const local=(seconds/(duration.value/scenes.value.length))%1;ctx.globalAlpha=Math.min(1,local*8+.15)
  ctx.font='bold 42px Arial';const words=String(scenes.value[index]).split(/\s+/);const lines=[];let line=''
  for(const word of words){if(ctx.measureText(line+' '+word).width>w-100&&line){lines.push(line);line=word}else line+=(line?' ':'')+word}if(line)lines.push(line)
  lines.slice(0,11).forEach((line,i)=>ctx.fillText(line,50,h*.35+i*53));ctx.globalAlpha=1
  ctx.font='20px Arial';ctx.fillStyle='#ddd4ff';ctx.fillText('Marketlane · '+(index+1)+' / '+scenes.value.length,50,h-70)
  ctx.fillStyle='#ffffff44';ctx.fillRect(50,h-43,w-100,3);ctx.fillStyle='#ffffff';ctx.fillRect(50,h-43,(w-100)*seconds/duration.value,3)
}
function stop(){cancelAnimationFrame(animation);playing.value=false;if(recorder&&recorder.state!=='inactive')recorder.stop();else stream?.getTracks().forEach(track=>track.stop())}
function frame(now){const seconds=Math.min(duration.value,(now-started)/1000);progress.value=seconds;paint(seconds);if(recording.value)stream?.getVideoTracks()[0]?.requestFrame?.();if(seconds<duration.value)animation=requestAnimationFrame(frame);else stop()}
function play(){stop();progress.value=0;playing.value=true;started=performance.now();animation=requestAnimationFrame(frame)}
async function exportVideo(){
  if(!canvas.value.captureStream||typeof MediaRecorder==='undefined')return emit('notify',tr('Bu brauzer video eksportini qo‘llamaydi.','Браузер не поддерживает экспорт видео.','This browser does not support video export.'))
  const mime=['video/webm;codecs=vp8','video/webm;codecs=vp9','video/webm'].find(type=>MediaRecorder.isTypeSupported(type))
  if(!mime)return emit('notify',tr('WebM formati qo‘llanmaydi.','Формат WebM не поддерживается.','WebM is not supported.'))
  stop();await nextTick();paint(0);stream=canvas.value.captureStream(0);const chunks=[]
  try{
    recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1500000});recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)}
    recorder.onstop=()=>{recording.value=false;stream?.getTracks().forEach(track=>track.stop());if(disposed||progress.value<duration.value-.1)return;const blob=new Blob(chunks,{type:'video/webm'});if(blob.size<1024)return emit('notify',tr('Brauzer video kadrlarini yozolmadi. Boshqa brauzerda sinang yoki TXT ssenariyni yuklang.','Браузер не записал кадры. Попробуйте другой браузер или скачайте TXT-сценарий.','The browser could not record video frames. Try another browser or download the TXT storyboard.'));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='marketlane-storyboard.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
    recorder.onerror=()=>{recording.value=false;stop();emit('notify',tr('Video eksportida xato.','Ошибка экспорта видео.','Video export failed.'))}
    recording.value=true;recorder.start(100);stream.getVideoTracks()[0]?.requestFrame?.();progress.value=0;playing.value=true;started=performance.now();animation=requestAnimationFrame(frame)
  }catch{stream?.getTracks().forEach(track=>track.stop());recording.value=false;emit('notify',tr('Video eksportini boshlab bo‘lmadi.','Не удалось начать экспорт.','Could not start video export.'))}
}
onMounted(()=>paint(.2))
watch(()=>props.item,()=>{stop();progress.value=0;nextTick(()=>paint(.2))})
onUnmounted(()=>{disposed=true;stop()})
</script>
<template>
  <section class="video-studio"><canvas ref="canvas" width="608" height="1080" :aria-label="tr('Storyboard video maketi','Видеомакет раскадровки','Storyboard video mockup')"></canvas><div class="video-controls"><div><span class="eyebrow">9:16 · {{duration}}s</span><h3>{{tr('Harakatli storyboard','Анимированная раскадровка','Animated storyboard')}}</h3><p>{{tr('Matn va ranglardan brauzerda yaratilgan ovozsiz video maket. AI video generatsiyasi emas.','Беззвучный видеомакет из текста и цветов, созданный в браузере. Это не AI-генерация видео.','A silent video mockup made from text and colors in the browser. This is not AI video generation.')}}</p></div><div class="heading-actions"><button class="button button-secondary" :disabled="recording" @click="playing?stop():play()"><Icon name="play" :size="16"/>{{playing?tr('To‘xtatish','Остановить','Stop'):tr('Ko‘rish','Смотреть','Play')}}</button><button class="button button-primary" :disabled="recording" @click="exportVideo"><Icon name="download" :size="16"/>{{recording?Math.floor(progress)+' / '+duration+'s':'WebM'}}</button><button v-if="recording" class="button button-secondary" @click="stop">{{tr('Bekor qilish','Отмена','Cancel')}}</button></div></div></section>
</template>
<style scoped>
.video-studio{display:grid;grid-template-columns:minmax(120px,210px) 1fr;gap:22px;align-items:center}.video-studio canvas{width:100%;border-radius:12px;border:1px solid var(--line);background:#101229}.video-controls{display:grid;gap:20px}.video-controls h3{font-size:19px;letter-spacing:-.03em;margin:10px 0}.video-controls p{font-size:12px;line-height:1.7;color:var(--muted)}@container workspace (max-width:550px){.video-studio{grid-template-columns:1fr}.video-studio canvas{max-width:220px;margin:auto}}
</style>
