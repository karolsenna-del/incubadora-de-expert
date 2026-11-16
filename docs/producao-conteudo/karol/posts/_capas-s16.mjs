import fs from 'fs';import os from 'os';import path from 'path';import {execFileSync} from 'child_process';
const H=os.homedir(),T=path.join(H,'.carrossel-arcane','templates'),DL=path.join(H,'Downloads');
const POSTS='C:/Users/karol/OneDrive/Documentos/Incubadora-de-expert/docs/producao-conteudo/karol/posts';
const CHROME=fs.readdirSync(path.join(H,'AppData/Local/ms-playwright')).filter(d=>d.startsWith('chromium-')).map(d=>path.join(H,'AppData/Local/ms-playwright',d,'chrome-win64','chrome.exe')).find(fs.existsSync)||'C:\Program Files\Google\Chrome\Application\chrome.exe';
const O='<b style="color:#F05A28">',C='</b>';
const capas=[
 {post:'rota100k-s16-seg-checklist-antes-da-vitalicia',t:'stats-hero',NUMERO:'5',CONTEXTO:'perguntas antes de comprar <strong>mais uma vitalícia na Black</strong>'},
 {post:'rota100k-s16-ter-armadilha-e-defesa',t:'foto-frase',foto:'Minhas fotos/2.png',HEADLINE:'Fórmula pronta nunca combinou com você?',SUBLINE:`5 armadilhas na hora de escolher curso ou mentoria. ${O}E a pergunta que te protege.${C}`},
 {post:'rota100k-s16-qua-comparar-propostas',t:'capa-marca',HEADLINE:'Medo de escolher errado?<br><strong><span style="color:#F7F7F5">5</span> pontos pra comparar em qualquer proposta.</strong>'},
 {post:'rota100k-s16-qui-calendario-ate-31-12',t:'foto-frase',foto:'Minhas-fotos-4/18.png',HEADLINE:'Ainda não é o momento de criar o seu método?',SUBLINE:`O plano pra ${O}criar e vender até 31/12${C}. Uma tarefa por semana.`},
 {post:'rota100k-s16-sex-ordem-pra-investir',t:'stats-hero',NUMERO:'6',CONTEXTO:'Gastou e não vendeu? <strong>A ordem certa pra investir</strong> no começo do digital'},
 {post:'rota100k-s16-sab-antes-de-apagar-o-video',t:'capa-marca',HEADLINE:'Achou seu vídeo amador e vai apagar?<br><strong>Confere esses 5 pontos antes.</strong>'},
 {post:'rota100k-s16-dom-criterios-da-semana',t:'foto-frase',foto:'Minhas-fotos-5/1.png',HEADLINE:'Queria começar com segurança?',SUBLINE:`6 decisões até 31/12 e ${O}a pergunta que te protege${C} em cada uma.`},
];
const only=process.argv[2];
for(const c of capas){ if(only&&!c.post.includes(only))continue;
 const b=path.join(os.tmpdir(),'capa-'+c.post);fs.rmSync(b,{recursive:true,force:true});fs.cpSync(path.join(T,c.t),b,{recursive:true});
 let h=fs.readFileSync(path.join(b,'template.html'),'utf8');
 for(const k of ['HEADLINE','SUBLINE','NUMERO','CONTEXTO'])h=h.replaceAll(`{{${k}}}`,c[k]||'');
 if(c.foto){fs.copyFileSync(path.join(DL,c.foto),path.join(b,'image.png'));
  h=h.replace('</head>','<style>.overlay{background:linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 68%)!important}.photo{background-position:center top!important}</style></head>');}
 // auto-fit headline
 h=h.replace('</body>',`<script>const e=document.querySelector('.headline');if(e){let s=parseFloat(getComputedStyle(e).fontSize);const lim=${c.t==='foto-frase'?330:820};while(e.offsetHeight>lim&&s>40){s-=2;e.style.fontSize=s+'px';}}</script></body>`);
 fs.writeFileSync(path.join(b,'index.html'),h);
 const raw=path.join(b,'raw.png'),out=path.join(DL,c.post,'slide-01.png');
 execFileSync(CHROME,['--headless','--disable-gpu','--hide-scrollbars','--no-sandbox','--window-size=1098,1446','--virtual-time-budget=6000',`--screenshot=${raw}`,'file:///'+path.join(b,'index.html').split(path.sep).join('/')],{stdio:'ignore'});
 execFileSync('ffmpeg',['-y','-i',raw,'-vf','crop=1080:1350:0:0',out],{stdio:'ignore'});
 fs.writeFileSync(path.join(POSTS,c.post,'capa.json'),JSON.stringify(c,null,1));
 console.log('ok',c.post);
}
