(() => {
  'use strict';
  const KEY = 'sentence-builder-library-v1';
  const app = document.getElementById('app');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ORIGINAL_BANK = {
    give: [['gives','gave','will give'],['a gift to her mom','food to the dog','a book to the boy','a flower to the teacher','water to the cat']],
    speak: [['speaks','spoke','will speak'],['English','Chinese','softly','to the people','to his grandma','to the class']],
    question: [['asks','answers','has'],['a question','the teacher a question','her mom a question','an easy question','a hard question']],
    battery: [['puts','changes','checks','charges','buys'],['a battery in the toy car','the battery in the clock','the battery on her phone','a new battery','a small battery']]
  };
  function slotConfig(w,e) {
    const original=ORIGINAL_BANK[w.id];
    return e.parts.map((part,i)=>({label:e.labels?.[i] || (original && e.parts.length===3 ? ['Who? 人物','Doing what? 动作','What? 内容'][i] : `词块 ${i+1}`),options:e.options?.[i]?.length ? e.options[i] : [...new Set([part,...(original && e.parts.length===3 ? (i===0?['The girl','The boy','The teacher','My mom','My dad','The man','The woman','I']:original[i-1]) : w.examples.filter(x=>x.parts.length===e.parts.length).map(x=>x.parts[i]))])]}));
  }
  const id = () => 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10);
  const defaults = Object.entries(window.SEED_WORDS).map(([key,w]) => ({id:key,word:w.word,zh:w.zh,pos:w.pos,ipa:w.ipa,category:'示范单词',examples:w.sentences.map(s=>({parts:[s.who,s.doing,s.what],zh:s.zh,scene:s.scene})),draft:'',learned:false}));
  let words = defaults, search = '', category = '', notice = '', storageOK = true;
  function validate(data) {
    if (!Array.isArray(data) || data.length > 5000) throw Error('单词库格式不正确，或超过 5000 个单词。');
    const ids = new Set();
    const str = (s,max=1000) => typeof s === 'string' && s.length <= max;
    return data.map(w=>{
      if (!w || !str(w.id,100) || !w.id || ids.has(w.id) || !str(w.word,100) || !w.word.trim() || !str(w.zh) || !str(w.pos,100) || !str(w.category,100) || !Array.isArray(w.examples) || !w.examples.length || w.examples.length>50) throw Error('有单词缺少必要内容，或编号重复。');
      ids.add(w.id);
      const examples=w.examples.map(e=>{
        if(!e || !Array.isArray(e.parts) || !e.parts.length || e.parts.length>30 || e.parts.some(p=>!str(p,500)||!p.trim()) || !str(e.zh)) throw Error('例句格式不正确。每句需 1–30 个词块。');
        if(e.labels!==undefined && (!Array.isArray(e.labels)||e.labels.length!==e.parts.length||e.labels.some(x=>!str(x,100))))throw Error('词块名称格式不正确。');
        if(e.options!==undefined && (!Array.isArray(e.options)||e.options.length!==e.parts.length||e.options.some(a=>!Array.isArray(a)||a.length>100||a.some(x=>!str(x,500)||!x.trim()))))throw Error('候选词格式不正确，每个词块最多 100 个候选词。');
        return {parts:e.parts.map(p=>p.trim()),zh:e.zh,scene:str(e.scene,50)?e.scene:'',...(e.labels?{labels:e.labels}:{}),...(e.options?{options:e.options}:{})};
      });
      return {id:w.id,word:w.word.trim(),zh:w.zh,pos:w.pos,ipa:str(w.ipa,100)?w.ipa:'',category:w.category,examples,draft:str(w.draft,5000)?w.draft:'',learned:w.learned===true};
    });
  }
  try { const raw=localStorage.getItem(KEY); if(raw!==null) words=validate(JSON.parse(raw).words); }
  catch(e) { storageOK=false; notice='无法读取本机单词库，当前显示示范。请先导出或检查浏览器设置，避免覆盖原数据。'; }
  function save(next) {
    try { localStorage.setItem(KEY,JSON.stringify({version:1,words:next})); words=next; storageOK=true; return true; }
    catch(e) { alert('保存失败：浏览器可能禁止保存或空间不足。请先导出备份，当前修改尚未保存。'); return false; }
  }
  function update(w) { return save(words.map(x=>x.id===w.id?w:x)); }
  function speak(text) {
    if(!('speechSynthesis' in window)) return alert('此浏览器不支持朗读，请使用设备上支持语音的浏览器。');
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=.8;
    u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error)) alert('朗读暂不可用，请检查设备的英语语音设置。');}; speechSynthesis.speak(u);
  }
  const sentence = e => {const t=e.parts.join(' '); return /[.!?。！？]$/.test(t)?t:t+'.';};
  const pic = e => e.scene && Object.hasOwn(SCENES,e.scene) ? SCENES[e.scene]() : '<div class="letter-art" aria-hidden="true">Aa<span>Every word tells a story<br>每个单词，都能组成新故事</span></div>';
  const button=(text,action,cls='ghost')=>`<button class="btn ${cls}" type="button" data-action="${action}">${text}</button>`;
  function shell(body) { app.innerHTML=`<div class="page">${body}</div>`; }
  function home() {
    app.onclick=null;
    document.title='Short Sentence Builder · 我的单词库';
    shell(`<div class="hero"><p class="eyebrow">MY WORD GARDEN · 我的单词花园</p><h1>Make a <span>Short Sentence!</span></h1><p>每天一个新单词，慢慢长成自己的句子库。</p></div>
    <div class="actions">${button('＋ 添加单词','add','')}${button('导出备份','export')}${button('导入单词','import')}</div>
    <p class="save-note" role="status">${esc(notice || (storageOK?'内容保存在当前浏览器 · 建议定期导出备份':'当前浏览器保存不可用，请导出备份'))}</p>
    <section class="library-tools"><label>搜索单词<input id="search" placeholder="英文、中文或分类" value="${esc(search)}"></label><label>分类<select id="category"><option value="">全部分类</option>${[...new Set(words.map(w=>w.category||'未分类'))].sort().map(c=>`<option ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><span id="count"></span></section><div class="grid" id="cards"></div><p class="save-note">无需账号或付费接口。释义和例句由你填写；朗读使用设备自带语音。</p><input id="file" type="file" accept=".json,application/json" hidden>`);
    const refresh=()=>{
      const found=words.filter(w=>(!category || (w.category||'未分类')===category) && `${w.word} ${w.zh} ${w.category}`.toLowerCase().includes(search.toLowerCase().trim()));
      document.getElementById('count').textContent=`${found.length} 个单词 · ${words.filter(w=>w.learned).length} 个已掌握`;
      document.getElementById('cards').innerHTML=found.map((w,i)=>`<a class="card" href="#word=${encodeURIComponent(w.id)}" style="--c:${['#ef476f','#3b82f6','#8b5cf6','#22a661'][i%4]}"><div class="thumb">${pic(w.examples[0])}</div><div class="info"><div class="w">${esc(w.word)}</div><div class="i">${esc(w.zh)}</div><p>${esc(w.category||'未分类')} · ${w.examples.length} 个例句 ${w.learned?'· ✓ 已掌握':''}</p></div></a>`).join('') || '<p class="empty">还没有符合条件的单词。点击「添加单词」开始吧。</p>';
    }; refresh();
    document.getElementById('search').oninput=e=>{search=e.target.value; refresh();};
    document.getElementById('category').onchange=e=>{category=e.target.value;refresh();};
    document.getElementById('file').onchange=async e=>{
      const file=e.target.files[0]; if(!file)return;
      try {
        if(file.size>10*1024*1024)throw Error('文件过大，请选择小于 10MB 的备份。');
        const data=JSON.parse(await file.text()); if(data.version!==1)throw Error('请选择本网站导出的第 1 版 JSON 备份。');
        const incoming=validate(data.words), existing=new Set(words.map(w=>w.id));
        const merged=[...words,...incoming.map(w=>existing.has(w.id)?{...w,id:id()}:w)];
        if(merged.length>5000)throw Error('合并后超过 5000 个单词。');
        if(!incoming.length)throw Error('备份中没有单词。');
        if(!confirm(`将导入 ${incoming.length} 个单词，保留现有内容；相同编号会作为新副本添加。继续吗？`))return;
        if(save(merged)){notice=`已导入 ${incoming.length} 个单词。`;home();}
      }catch(err){alert('未导入：'+err.message);} finally{e.target.value='';}
    };
  }
  function exportData() {
    const blob=new Blob([JSON.stringify({version:1,words},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`我的单词库-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function editor(existing) {
    app.onclick=null;
    const w=existing||{word:'',zh:'',pos:'noun 名词',category:'',ipa:'',examples:[{parts:[''],zh:''}]};
    shell(`<div class="top"><a class="pill" href="#">← 返回单词库</a></div><div class="hero"><h1>${existing?'编辑':'添加'}<span>单词</span></h1><p>填写自己的内容，免费创建新的练习。</p></div><form id="edit" class="panel"><div class="form-grid">${[['word','英文单词或短语',100],['zh','中文意思',1000],['category','分类（选填）',100],['ipa','音标（选填）',100]].map(([k,label,max])=>`<label>${label}<input name="${k}" maxlength="${max}" value="${esc(w[k])}" ${['word','zh'].includes(k)?'required':''}></label>`).join('')}<label>词性<select name="pos">${['noun 名词','verb 动词','adjective 形容词','adverb 副词','phrase 短语','other 其他'].map(p=>`<option ${w.pos===p?'selected':''}>${p}</option>`).join('')}</select></label></div><h2>例句与词块</h2><p>用 / 分隔要练习的词块，中文翻译另填。至少保留一个例句。<br>例如形容词 happy：<strong>The girl / is / happy</strong><br>例如短语 in the park：<strong>We / play / in the park</strong><br>词块数量自由；请检查例句的拼写和语法，网站不会自动纠错。</p><div id="examples"></div>${button('＋ 增加例句','example')}<div class="actions"><button class="btn" type="submit">保存单词</button><a class="pill alt" href="#">取消</a></div><p id="form-error" role="alert"></p></form>`);
    const rows=document.getElementById('examples');
    const add=e=>{const row=document.createElement('fieldset'); row.className='example-row';row.innerHTML=`<legend>例句</legend><label>英文词块（用 / 分隔）<textarea class="parts-input" required maxlength="5000" placeholder="The girl / is / happy">${esc(e.parts.join(' / '))}</textarea></label><label>中文翻译<textarea class="translation" required maxlength="1000">${esc(e.zh)}</textarea></label><label>词块名称（选填，用 / 分隔，与上方词块一一对应）<input class="slot-labels" maxlength="3000" placeholder="Who? 人物 / Doing what? 动作 / What? 内容" value="${esc(e.parts.some(p=>p.trim())?slotConfig(w,e).map(x=>x.label).join(' / '):'')}"></label><label>下方候选词（每行对应一个词块，同一行的候选词用 | 分隔）<textarea class="slot-options" rows="5" maxlength="50000" placeholder="The girl | The boy | My mom&#10;is | feels&#10;happy | sad | excited">${esc(e.parts.some(p=>p.trim())?slotConfig(w,e).map(x=>x.options.join(' | ')).join('\n'):'')}</textarea></label><p class="save-note">候选词由老师按句型设置。留空则使用本词其他同结构例句中的词块；组合后请留意主谓一致与时态。</p><button type="button" class="remove">移除此例句</button>`;row.querySelector('.remove').onclick=()=>{if(rows.children.length===1)return alert('请至少保留一个例句。');row.remove();};rows.append(row);};
    w.examples.forEach(add);
    app.querySelector('[data-action="example"]').onclick=()=>{if(rows.children.length>=50)return alert('每个单词最多 50 个例句。');add({parts:[''],zh:''});};
    document.getElementById('edit').onsubmit=e=>{
      e.preventDefault();const form=new FormData(e.target);
      const examples=[...rows.children].map((r,i)=>{const parts=r.querySelector('.parts-input').value.split('/').map(s=>s.trim()).filter(Boolean);const old=w.examples[i];const labelsText=r.querySelector('.slot-labels').value.trim();const optionsText=r.querySelector('.slot-options').value.trim();const labels=labelsText?labelsText.split('/').map(x=>x.trim()):parts.map((_,i)=>`词块 ${i+1}`);const options=optionsText?optionsText.split('\n').map(line=>[...new Set(line.split('|').map(x=>x.trim()).filter(Boolean))]):parts.map(()=>[]);return {parts,labels,options,zh:r.querySelector('.translation').value.trim(),scene:old && parts.join(' ')===old.parts.join(' ')?old.scene:''};});
      const next={...w,id:existing?existing.id:id(),...Object.fromEntries(form),word:form.get('word').trim(),zh:form.get('zh').trim(),category:form.get('category').trim(),examples,learned:existing?.learned||false,draft:existing?.draft||''};
      try{validate([next]);if(!next.zh)throw Error('请填写中文意思。');if(save(existing?words.map(x=>x.id===next.id?next:x):[...words,next])){location.hash='word='+encodeURIComponent(next.id);wordPage(next);}}catch(err){document.getElementById('form-error').textContent=err.message;}
    };
  }
  function wordPage(w) {
    document.title=w.word+' · 句子练习';let current=0,pool=[],chosen=[];
    shell(`<div class="top"><a class="pill" href="#">← 我的单词库</a><div>${button('编辑','edit')}${button('删除','delete')}</div></div><div class="wordcard"><button class="word" id="hear">${esc(w.word)} ♪</button><div class="meta"><div class="ipa">${esc(w.ipa)}</div><div class="pos">${esc(w.pos)}</div><div class="zh-word">${esc(w.zh)}</div></div></div><div class="pic" id="pic"></div><div class="tabs">${w.examples.map((e,i)=>`<button class="tab" data-example="${i}">例句 ${i+1}</button>`).join('')}</div><div class="boxes" id="boxes"></div><div class="sentence" id="sentence"></div><div class="zh" id="translation"></div><div class="actions">${button('♪ 朗读例句','read','')}${button('隐藏中文','translate')}${button(w.learned?'✓ 已掌握':'标记已掌握','learned')}</div><section class="build replace-build"><h2>Your turn! 轮到你造句</h2><p class="sub">自己写，或者点下方候选词填入词块。替换词语，试着组成新句子。</p><div class="bcols" id="replace-slots"></div><div class="sentence mine" id="replace-sentence" aria-live="polite"></div><div class="actions">${button('♪ 朗读新句子','replace-read','')}${button('填入当前例句','replace-fill','blue')}${button('清空词块','replace-clear')}</div><p class="save-note">可替换词块自由组合；请和老师一起检查主谓一致、时态和意思是否合适。</p></section><section class="build"><h2>排一排，组成句子</h2><p class="sub">依次点击词块。点击已选词块可以退回，完成后检查顺序。</p><div class="chips practice-pool" id="pool"></div><div id="answer" class="answer" aria-label="已选词块"></div><div class="actions">${button('检查答案','check','')}${button('重新练习','reset')}</div><p class="feedback" id="feedback" role="status"></p><h2>试着写自己的句子</h2><label class="draft-label">自由造句<textarea id="draft" maxlength="5000" placeholder="用这个单词写一个新句子…">${esc(w.draft)}</textarea></label><p class="save-note" id="draft-status">输入后自动保存；自由造句不提供语法评分。</p><div class="actions">${button('♪ 朗读我的句子','draft-read','')}</div></section>`);
    const $=s=>document.getElementById(s);
    function draw(){
      $('pool').innerHTML=pool.map(i=>`<button class="chip2" data-pool="${i}" style="--c:#3b82f6" ${chosen.includes(i)?'disabled':''}>${esc(w.examples[current].parts[i])}</button>`).join('');
      $('answer').innerHTML=chosen.map((i,n)=>`<button class="chip2" data-chosen="${n}" style="--c:#22a661">${esc(w.examples[current].parts[i])} ×</button>`).join('')||'<span>选中的词块会出现在这里</span>';
      $('feedback').textContent='';
    }
    function reset(){chosen=[];pool=w.examples[current].parts.map((_,i)=>i);for(let i=pool.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}draw();}
    function replacementText(){const parts=[...$('replace-slots').querySelectorAll('textarea')].map(t=>t.value.trim()).filter(Boolean);if(!parts.length)return '';const t=sentence({parts});return t.charAt(0).toUpperCase()+t.slice(1);}
    function refreshReplacement(){const t=replacementText();$('replace-sentence').textContent=t||'Your sentence will show here · 你的句子会出现在这里';$('replace-sentence').classList.toggle('placeholder',!t);$('replace-slots').querySelectorAll('[data-replace]').forEach(b=>b.classList.toggle('on',$('replace-'+b.dataset.replace).value.trim()===b.dataset.value));}
    function buildReplacement(){const example=w.examples[current];$('replace-slots').innerHTML=slotConfig(w,example).map((slot,i)=>`<div class="bcol"><div class="slot" style="--c:${['#3b82f6','#22a661','#d89b12','#8b5cf6'][i%4]}"><label class="lab" for="replace-${i}">${esc(slot.label)}</label><textarea id="replace-${i}" maxlength="500" rows="3" placeholder="…" aria-label="${esc(slot.label)}"></textarea></div><div class="chips" style="--c:${['#3b82f6','#22a661','#d89b12','#8b5cf6'][i%4]}">${slot.options.map(v=>`<button class="chip2" type="button" data-replace="${i}" data-value="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>`).join('')+'<div class="bcol stopcol"><div class="box stop" style="--c:#64748b;--i:0"><span class="lab">Full stop<small>句号</small></span><span class="val">.</span></div></div>';$('replace-slots').oninput=refreshReplacement;refreshReplacement();}
    function show(i){current=i;const e=w.examples[i];$('pic').innerHTML=pic(e);$('boxes').innerHTML=e.parts.map((p,i)=>`<button class="box" data-part="${i}" style="--c:${['#3b82f6','#22a661','#d89b12','#8b5cf6'][i%4]};--i:0"><span class="lab">词块 ${i+1}</span><span class="val">${esc(p)}</span></button>`).join('');$('sentence').textContent=sentence(e);$('translation').textContent=e.zh;app.querySelectorAll('[data-example]').forEach(t=>t.classList.toggle('on',+t.dataset.example===i));reset();buildReplacement();}
    $('hear').onclick=()=>speak(w.word);
    $('draft').oninput=()=>{const next={...w,draft:$('draft').value};if(update(next)){w.draft=next.draft;$('draft-status').textContent='已保存到当前浏览器 · 自由造句不提供语法评分。';}else $('draft-status').textContent='保存失败，请复制句子或导出备份。';};
    app.onclick=e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.replace!==undefined){$('replace-'+b.dataset.replace).value=b.dataset.value;refreshReplacement();speak(b.dataset.value);}
      if(b.dataset.example!==undefined)show(+b.dataset.example);
      if(b.dataset.part!==undefined)speak(w.examples[current].parts[+b.dataset.part]);
      if(b.dataset.pool!==undefined){chosen.push(+b.dataset.pool);draw();}
      if(b.dataset.chosen!==undefined){chosen.splice(+b.dataset.chosen,1);draw();}
      switch(b.dataset.action){
        case 'edit':editor(w);break;
        case 'delete':if(confirm(`删除「${w.word}」及其例句？建议先导出备份。`)&&save(words.filter(x=>x.id!==w.id)))location.hash='';break;
        case 'read':speak(sentence(w.examples[current]));break;
        case 'translate':$('translation').hidden=!$('translation').hidden;b.textContent=$('translation').hidden?'显示中文':'隐藏中文';break;
        case 'learned':{const next={...w,learned:!w.learned};if(update(next)){w.learned=next.learned;b.textContent=w.learned?'✓ 已掌握':'标记已掌握';}break;}
        case 'replace-read':{const t=replacementText();if(t)speak(t);else $('replace-0').focus();break;}
        case 'replace-fill':w.examples[current].parts.forEach((p,i)=>$('replace-'+i).value=p);refreshReplacement();break;
        case 'replace-clear':$('replace-slots').querySelectorAll('textarea').forEach(t=>t.value='');refreshReplacement();$('replace-0').focus();break;
        case 'reset':reset();break;
        case 'check':{const parts=w.examples[current].parts;const correct=chosen.length===parts.length&&chosen.every((v,i)=>parts[v]===parts[i]);$('feedback').textContent=correct?'✓ 太棒了！顺序正确。':'再试一次：对照上方例句，检查词块是否齐全、顺序是否正确。';break;}
        case 'draft-read':if($('draft').value.trim())speak($('draft').value);else $('draft').focus();break;
      }
    };show(0);
  }
  function route(){app.onclick=null;if('speechSynthesis'in window)speechSynthesis.cancel();let key;try{key=new URLSearchParams(location.hash.slice(1)).get('word');}catch{} const legacy=location.pathname.split('/').pop().replace('.html','');if(!location.hash&&words.some(w=>w.id===legacy))key=legacy;const w=words.find(w=>w.id===key);if(w)wordPage(w);else home();window.scrollTo(0,0);}
  app.addEventListener('click',e=>{if(e.target.closest('a[href="#"]')){e.preventDefault();location.hash='';home();return;}const action=e.target.closest('[data-action]')?.dataset.action;if(action==='add')editor();if(action==='export')exportData();if(action==='import')document.getElementById('file').click();});
  window.addEventListener('hashchange',route);route();
})();
