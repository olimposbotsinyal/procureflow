import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{a as t,c as n,d as r,f as i,i as a,l as o,m as s,n as c,o as l,p as u,r as d,s as f,t as p,u as m}from"./react-DKvhXJgS.js";import{n as h,t as g}from"./vendor-CxvnSKf9.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var _=e(s(),1),v=e(u(),1),y=(0,_.createContext)(void 0);function b(){let e=(0,_.useContext)(y);if(!e)throw Error(`useAuth, AuthProvider içinde kullanılmalı.`);return e}var x=c();function S(){let{user:e,loading:n}=b(),r=o();return n?(0,x.jsx)(`div`,{children:`Yükleniyor...`}):e?(0,x.jsx)(l,{}):(0,x.jsx)(t,{to:`/login`,replace:!0,state:{from:r}})}var C={super_admin:[`view:dashboard`,`view:admin`,`view:reports`,`manage:users`],admin:[`view:dashboard`,`view:admin`,`view:reports`,`manage:users`],manager:[`view:dashboard`,`view:reports`],buyer:[`view:dashboard`],user:[`view:dashboard`]};function w(e,t){return C[e]?.includes(t)??!1}var T=[{label:`Dashboard`,to:`/dashboard`,permission:`view:dashboard`},{label:`Teklifler`,to:`/quotes`,permission:`view:dashboard`},{label:`Admin`,to:`/admin`,permission:`view:admin`},{label:`Raporlar`,to:`/reports`,permission:`view:reports`}];function E(e){return T.find(t=>w(e,t.permission))?.to??`/dashboard`}function D({permission:e,redirectTo:n=`/403`}){let{user:r,loading:i}=b(),a=o();return i?(0,x.jsx)(`div`,{style:{padding:24},children:`Yetki kontrol ediliyor...`}):r?w(r.role,e)?(0,x.jsx)(l,{}):(0,x.jsx)(t,{to:n,replace:!0,state:{deniedFrom:a.pathname,fallbackTo:E(r.role)}}):(0,x.jsx)(t,{to:`/login`,replace:!0,state:{from:a}})}var O={success:e=>p.success(e),error:e=>p.error(e),info:e=>p(e)};function k(){let{user:e,logout:t}=b(),n=m(),[r,i]=(0,_.useState)(!1);function o(){t(),O.info(`Çıkış yapıldı.`),n(`/login`,{replace:!0}),i(!1)}function s(){n(`/profile`),i(!1)}let c=e?T.filter(t=>w(e.role,t.permission)):[];return(0,x.jsxs)(`div`,{style:{fontFamily:`Arial`,minHeight:`100vh`,background:`#f7f7f8`},children:[(0,x.jsxs)(`header`,{style:{height:64,background:`#111827`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`0 20px`,position:`relative`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,gap:14,alignItems:`center`},children:[(0,x.jsx)(`strong`,{children:`ProcureFlow`}),c.map(e=>(0,x.jsx)(a,{to:e.to,style:{color:`#d1d5db`,textDecoration:`none`},children:e.label},e.to))]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`,position:`relative`},children:[(0,x.jsxs)(`button`,{onClick:()=>i(!r),style:{background:`#1f2937`,border:`1px solid #374151`,color:`#d1d5db`,padding:`8px 12px`,borderRadius:6,cursor:`pointer`,fontSize:14},children:[`👤 `,e?.email]}),r&&(0,x.jsx)(`div`,{style:{position:`absolute`,top:64,right:0,backgroundColor:`#fff`,border:`1px solid #e5e7eb`,borderRadius:8,boxShadow:`0 10px 15px -3px rgba(0,0,0,0.1)`,zIndex:10,minWidth:200},children:(0,x.jsxs)(`div`,{style:{padding:8},children:[(0,x.jsx)(`button`,{onClick:s,style:{display:`block`,width:`100%`,textAlign:`left`,padding:`12px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,color:`#1f2937`,borderRadius:4,transition:`background 0.2s`},onMouseEnter:e=>e.currentTarget.style.background=`#f3f4f6`,onMouseLeave:e=>e.currentTarget.style.background=`none`,children:`👤 Profilim`}),(0,x.jsx)(`button`,{onClick:o,style:{display:`block`,width:`100%`,textAlign:`left`,padding:`12px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,color:`#ef4444`,borderRadius:4,transition:`background 0.2s`},onMouseEnter:e=>e.currentTarget.style.background=`#fee2e2`,onMouseLeave:e=>e.currentTarget.style.background=`none`,children:`🚪 Çıkış Yap`})]})}),r&&(0,x.jsx)(`div`,{onClick:()=>i(!1),style:{position:`fixed`,top:0,left:0,right:0,bottom:0,zIndex:5}})]})]}),(0,x.jsx)(`main`,{style:{padding:24,maxWidth:1100,margin:`0 auto`},children:(0,x.jsx)(l,{})})]})}var A=`pf_access_token`,j=`access_token`,M=`refresh_token`,N=`supplier_access_token`;function P(e){let t=sessionStorage.getItem(e);if(t)return t;let n=localStorage.getItem(e);return n?(sessionStorage.setItem(e,n),localStorage.removeItem(e),n):null}function F(){return P(N)||P(A)||P(j)}function I(e){sessionStorage.setItem(N,e)}function L(){return P(N)}function R(){return!!P(N)}function z(){sessionStorage.removeItem(A),sessionStorage.removeItem(j),sessionStorage.removeItem(M),sessionStorage.removeItem(N),localStorage.removeItem(A),localStorage.removeItem(j),localStorage.removeItem(M),localStorage.removeItem(N)}function B(){sessionStorage.removeItem(N),localStorage.removeItem(N)}function V(){let{user:e,loading:n}=b(),r=o();return n?null:R()?(0,x.jsx)(t,{to:`/supplier/dashboard`,replace:!0}):e?(0,x.jsx)(t,{to:E(e.role),replace:!0}):(0,x.jsx)(t,{to:`/login`,replace:!0,state:{from:r}})}function ee(){let e=m(),t=o(),{login:n}=b(),[r,i]=(0,_.useState)(``),[a,s]=(0,_.useState)(``),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(!1);async function f(i){i.preventDefault(),l(null),d(!0);try{await n(r,a);let i=t.state?.from?.pathname;e(i||`/dashboard`,{replace:!0})}catch(e){l(e instanceof Error?e.message:`Giriş başarısız.`)}finally{d(!1)}}return(0,x.jsxs)(`div`,{style:{maxWidth:360,margin:`60px auto`},children:[(0,x.jsx)(`h1`,{children:`Giriş Yap`}),(0,x.jsxs)(`form`,{onSubmit:f,children:[(0,x.jsxs)(`div`,{style:{marginBottom:12},children:[(0,x.jsx)(`label`,{htmlFor:`email`,children:`E-posta`}),(0,x.jsx)(`input`,{id:`email`,name:`email`,type:`email`,autoComplete:`email`,value:r,onChange:e=>i(e.target.value),required:!0,style:{width:`100%`}})]}),(0,x.jsxs)(`div`,{style:{marginBottom:12},children:[(0,x.jsx)(`label`,{htmlFor:`password`,children:`Şifre`}),(0,x.jsx)(`input`,{id:`password`,name:`password`,type:`password`,autoComplete:`current-password`,value:a,onChange:e=>s(e.target.value),required:!0,style:{width:`100%`}})]}),c&&(0,x.jsx)(`p`,{style:{color:`crimson`,marginTop:8},children:c}),(0,x.jsx)(`button`,{type:`submit`,disabled:u,style:{width:`100%`},children:u?`Giriş yapılıyor...`:`Giriş Yap`})]})]})}var H=`pf_access_token`,te=`refresh_token`;function ne(e){let t=sessionStorage.getItem(e);if(t)return t;let n=localStorage.getItem(e);return n?(sessionStorage.setItem(e,n),localStorage.removeItem(e),n):null}function U(){return ne(H)}function re(e){sessionStorage.setItem(H,e)}function W(){return ne(te)}function ie(e){sessionStorage.setItem(te,e)}function ae(){sessionStorage.removeItem(te),localStorage.removeItem(te)}function oe(){sessionStorage.removeItem(H),localStorage.removeItem(H),ae()}var se=`https://api.buyerasistans.com.tr/api/v1`,G=g.create({baseURL:se,withCredentials:!0}),ce=null;async function le(){let e=W();if(!e)return null;try{let t=`${se}/auth/refresh`,n=await g.post(t,{refresh_token:e},{withCredentials:!0}),r=n.data?.access_token,i=n.data?.refresh_token;return!r||!i?null:(re(r),ie(i),r)}catch{return null}}async function ue(){return ce||=le().finally(()=>{ce=null}),ce}G.interceptors.request.use(e=>{if(e.url?.includes(`/auth/login`)||e.url?.includes(`/supplier/register`)||e.url?.includes(`/supplier/login`))return console.log(`[HTTP] Public endpoint detected - NOT adding token`),e;let t=F();return t?(e.headers=e.headers??{},e.headers.Authorization=`Bearer ${t}`,console.log(`[HTTP] ✅ Token eklendi: ${t.substring(0,20)}...`)):console.log(`[HTTP] ⚠️ Token bulunamadı!`),console.log(`[HTTP] 📤 ${e.method?.toUpperCase()} ${e.url}`,{headers:{Authorization:e.headers?.Authorization?`Bearer ***`:`NONE`,"Content-Type":e.headers?.[`Content-Type`]},data:e.data}),e}),G.interceptors.response.use(e=>(console.log(`[HTTP] ✅ ${e.status} ${e.config.url}`,e.data),e),async e=>{let t=e?.response?.status,n=e?.config?.url??``,r=e?.response?.data,i=e?.config;if(console.error(`[HTTP] ❌ ${t} ${n}`,{statusCode:t,statusText:e?.response?.statusText,errorMessage:r?.detail||r?.message||e?.message,fullError:r}),t===401){let e=n.includes(`/auth/login`)||n.includes(`/auth/me`)||n.includes(`/auth/refresh`)||n.includes(`/auth/logout`)||n.includes(`/supplier/register`)||n.includes(`/supplier/login`);if(!R()&&!e&&i&&!i._retry){i._retry=!0;let e=await ue();if(e)return i.headers=i.headers??{},i.headers.Authorization=`Bearer ${e}`,G(i)}z(),sessionStorage.removeItem(`pf_user`),localStorage.removeItem(`pf_user`);let t=window.location.pathname.includes(`/supplier/`),r=window.location.pathname===`/login`||window.location.pathname===`/supplier/login`;!e&&!r&&(t?window.location.assign(`/supplier/login`):window.location.assign(`/login`))}return Promise.reject(e)});async function de(e,t){try{let n=(await G.post(`/auth/login`,{email:e,password:t})).data;if(!n?.access_token||!n?.refresh_token)throw Error(`Login yanıtında token bilgisi eksik.`);return console.log(`[AUTH] Login başarılı, token alındı:`,n),{accessToken:n.access_token,refreshToken:n.refresh_token,user:n.user??null}}catch(e){throw g.isAxiosError(e)&&e.response?.status===401?Error(`E-posta veya şifre hatalı.`):(console.error(`[AUTH] Login hatası:`,e),Error(`Giriş sırasında bir sorun oluştu.`))}}async function fe(e,t){try{let n=(await G.post(`/supplier/login`,{email:e,password:t})).data;if(!n?.access_token)throw Error(`Tedarikçi login yanıtında access_token yok.`);return console.log(`[SUPPLIER_AUTH] Login başarılı:`,n),oe(),sessionStorage.removeItem(`pf_user`),localStorage.removeItem(`pf_user`),I(n.access_token),n.access_token}catch(e){throw g.isAxiosError(e)&&e.response?.status===401?Error(`E-posta veya şifre hatalı.`):(console.error(`[SUPPLIER_AUTH] Login hatası:`,e),Error(`Giriş sırasında bir sorun oluştu.`))}}async function pe(){let e=await G.get(`/auth/me`);return console.log(`[AUTH] /me endpoint'den kullanıcı bilgisi alındı:`,e.data),e.data}async function me(e){let t=await G.post(`/auth/refresh`,{refresh_token:e});if(!t.data?.access_token||!t.data?.refresh_token)throw Error(`Refresh yanıtında token bilgisi eksik.`);return{accessToken:t.data.access_token,refreshToken:t.data.refresh_token}}async function he(){try{let e=W();if(!e)return;await G.post(`/auth/logout`,{refresh_token:e})}catch{}}var ge=h.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`,_e=h.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
  text-align: center;

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  p {
    font-size: 18px;
    opacity: 0.9;
    max-width: 400px;
    line-height: 1.6;
  }
`,ve=h.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`,ye=h.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;

  h2 {
    font-size: 28px;
    margin-bottom: 10px;
    color: #1f2937;
    font-weight: 600;
  }

  p {
    color: #6b7280;
    margin-bottom: 30px;
    font-size: 14px;
  }
`,be=h.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,xe=h.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,Se=h.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`,Ce=h.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`,we=h.button`
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`,Te=h.div`
  padding: 12px;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #dc2626;
  margin-bottom: 10px;
`,Ee=h.div`
  padding: 12px;
  background-color: #dcfce7;
  color: #166534;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #22c55e;
  margin-bottom: 10px;
`;function De(){let e=m(),[t,n]=(0,_.useState)({email:``,password:``}),[r,i]=(0,_.useState)(!1),[a,o]=(0,_.useState)(null),[s,c]=(0,_.useState)(``);(0,_.useEffect)(()=>{R()&&e(`/supplier/dashboard`,{replace:!0})},[e]);let l=e=>{let{name:t,value:r}=e.target;n(e=>({...e,[t]:r})),o(null)};return(0,x.jsxs)(ge,{children:[(0,x.jsx)(_e,{children:(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h1`,{children:`Tedarikçi Portalı`}),(0,x.jsx)(`p`,{children:`Tekliflerinizi yönetin, proje detaylarını görün ve sözleşmelerinizi takip edin.`})]})}),(0,x.jsx)(ve,{children:(0,x.jsxs)(ye,{children:[(0,x.jsx)(`h2`,{children:`Giriş Yapın`}),(0,x.jsx)(`p`,{children:`Tedarikçi hesabınızla giriş yaparak panele erişin`}),(0,x.jsxs)(be,{onSubmit:async n=>{if(n.preventDefault(),o(null),c(``),!t.email){o({field:`email`,message:`E-posta gerekli`});return}if(!t.password){o({field:`password`,message:`Şifre gerekli`});return}i(!0);try{await fe(t.email,t.password),c(`Giriş başarılı! Yönlendiriliyorsunuz...`),e(`/supplier/dashboard`,{replace:!0})}catch(e){console.error(`Login error:`,e),o({message:e?.message||`Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol ediniz.`})}finally{i(!1)}},children:[a&&(0,x.jsx)(Te,{children:a.message}),s&&(0,x.jsx)(Ee,{children:s}),(0,x.jsxs)(xe,{children:[(0,x.jsx)(Se,{htmlFor:`email`,children:`E-posta Adresi`}),(0,x.jsx)(Ce,{type:`email`,id:`email`,name:`email`,value:t.email,onChange:l,placeholder:`ornek@tedarikci.com`,disabled:r,required:!0})]}),(0,x.jsxs)(xe,{children:[(0,x.jsx)(Se,{htmlFor:`password`,children:`Şifre`}),(0,x.jsx)(Ce,{type:`password`,id:`password`,name:`password`,value:t.password,onChange:l,placeholder:`••••••••`,disabled:r,required:!0})]}),(0,x.jsx)(we,{type:`submit`,disabled:r,children:r?`Giriş yapılıyor...`:`Giriş Yap`})]})]})})]})}var Oe=h.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`,ke=h.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;

  h1 {
    margin: 0 0 10px 0;
    font-size: 28px;
    color: #333;
  }

  .subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 14px;
  }
`,Ae=h.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }
`,je=h.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`,Me=h.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,Ne=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`,Pe=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`,Fe=h.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;function Ie(){let[e]=i(),t=m(),n=e.get(`token`),[r,a]=(0,_.useState)(!0),[o,s]=(0,_.useState)(!1),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)({company_name:``,user_name:``,email:``}),[h,v]=(0,_.useState)({password:``,password_confirm:``});return(0,_.useEffect)(()=>{if(R()){console.log(`[REGISTER] Already have supplier token, redirecting to dashboard`),t(`/supplier/dashboard`,{replace:!0});return}if(!n){l(`Geçersiz kayıt bağlantısı`),a(!1);return}(async()=>{try{console.log(`[REGISTER] Calling validate endpoint with token:`,n);let e=await g.get(`https://api.buyerasistans.com.tr/api/v1/api/v1/supplier/register/validate`,{params:{token:n}});if(console.log(`[REGISTER] Validate response:`,e.data),!e.data?.valid){console.log(`[REGISTER] Valid = false, showing error`),l(e.data?.message||`Geçersiz veya süresi dolmuş bağlantı`),a(!1);return}console.log(`[REGISTER] Valid = true, showing form`),p({company_name:e.data.supplier_name||``,user_name:e.data.supplier_user_name||``,email:e.data.email||``}),a(!1)}catch(e){console.error(`[REGISTER] Validate error:`,e),l(`Geçersiz veya süresi dolmuş bağlantı`),a(!1)}})()},[n,t]),r?(0,x.jsx)(Oe,{children:(0,x.jsx)(ke,{children:(0,x.jsx)(Fe,{children:`⏳ Veriler yükleniyor...`})})}):(0,x.jsx)(Oe,{children:(0,x.jsxs)(ke,{children:[(0,x.jsx)(`h1`,{children:`🎉 Hoş Geldiniz!`}),(0,x.jsx)(`div`,{className:`subtitle`,children:`ProcureFlow Tedarikçi Portalı`}),c&&(0,x.jsxs)(Ne,{children:[`❌ `,c]}),u&&(0,x.jsxs)(Pe,{children:[`✅ `,u]}),!u&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(`div`,{style:{marginBottom:`20px`,fontSize:`13px`,color:`#666`},children:[(0,x.jsxs)(`p`,{style:{margin:`0 0 8px 0`},children:[(0,x.jsx)(`strong`,{children:`📦 Firma:`}),` `,f.company_name]}),(0,x.jsxs)(`p`,{style:{margin:`0 0 8px 0`},children:[(0,x.jsx)(`strong`,{children:`👤 Yetkili:`}),` `,f.user_name]}),(0,x.jsxs)(`p`,{style:{margin:`0`},children:[(0,x.jsx)(`strong`,{children:`📧 E-mail:`}),` `,f.email]})]}),(0,x.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),!h.password){l(`Şifre boş olamaz`);return}if(h.password!==h.password_confirm){l(`Şifreler eşleşmiyor`);return}if(h.password.length<8){l(`Şifre en az 8 karakter olmalıdır`);return}try{s(!0),l(null),console.log(`[REGISTER] Posting to /supplier/register with token:`,n?.substring(0,20)+`...`);let e=await G.post(`/supplier/register`,{token:n,password:h.password});if(console.log(`[REGISTER] Response received:`,e.status,e.data),e.data?.access_token)console.log(`[REGISTER] access_token found, saving to session`),I(e.data.access_token);else{console.error(`[REGISTER] ERROR: access_token NOT in response!`,e.data),l(`Kayıt başarılı, ancak token alınamadı`);return}d(`Kayıt başarılı! Panele yönlendiriliyorsunuz...`),setTimeout(()=>{console.log(`[REGISTER] Navigating to /supplier/dashboard`),t(`/supplier/dashboard`,{replace:!0})},1e3)}catch(e){console.error(`[REGISTER] Catch error:`,e),l(`Kayıt sırasında hata oluştu: `+String(e))}finally{s(!1)}},children:[(0,x.jsxs)(Ae,{children:[(0,x.jsx)(`label`,{htmlFor:`password`,children:`Şifre *`}),(0,x.jsx)(je,{id:`password`,type:`password`,value:h.password,onChange:e=>v({...h,password:e.target.value}),placeholder:`En az 8 karakter`,required:!0,disabled:o})]}),(0,x.jsxs)(Ae,{children:[(0,x.jsx)(`label`,{htmlFor:`password_confirm`,children:`Şifre Tekrarı *`}),(0,x.jsx)(je,{id:`password_confirm`,type:`password`,value:h.password_confirm,onChange:e=>v({...h,password_confirm:e.target.value}),placeholder:`Şifreyi tekrar girin`,required:!0,disabled:o})]}),(0,x.jsx)(Me,{type:`submit`,disabled:o,children:o?`⏳ Kaydediliyor...`:`✅ Kaydı Tamamla`})]})]})]})})}async function Le(){return(await G.get(`/suppliers/profile`)).data}async function Re(e){return(await G.put(`/suppliers/profile`,e)).data}async function ze(e){let t=new FormData;return t.append(`file`,e),{logo_url:(await G.post(`/suppliers/profile/logo`,t,{headers:{"Content-Type":`multipart/form-data`}})).data.logo_url}}async function Be(e,t){let n=new FormData;return n.append(`file`,t),(await G.post(`/suppliers/profile/documents/${e}`,n,{headers:{"Content-Type":`multipart/form-data`}})).data.document}async function Ve(e){return(await G.get(`/suppliers/profile/documents`,{params:e?{category:e}:void 0})).data.documents??[]}async function He(){return(await G.get(`/suppliers/profile/contracts`)).data.contracts??[]}async function Ue(e){return(await G.post(`/suppliers/profile/email-change/request`,{new_email:e})).data}async function We(e,t){return(await G.post(`/suppliers/profile/email-change/confirm`,{token:e,new_password:t})).data}async function Ge(){return(await G.get(`/suppliers/profile/email-change/status`)).data}async function Ke(e,t){return(await G.put(`/suppliers/profile/users/${e}`,t)).data}async function qe(e){return(await G.delete(`/suppliers/profile/users/${e}`)).data}async function Je(){return(await G.get(`/suppliers/profile/guarantees`)).data.guarantees??[]}async function Ye(e){return(await G.get(`/suppliers/profile/finance-summary`,{params:e})).data}async function Xe(e){let t=new FormData;return t.append(`title`,e.title),t.append(`amount`,String(e.amount)),e.contract_id&&t.append(`contract_id`,String(e.contract_id)),e.invoice_number&&t.append(`invoice_number`,e.invoice_number),e.invoice_date&&t.append(`invoice_date`,e.invoice_date),e.currency&&t.append(`currency`,e.currency),e.notes&&t.append(`notes`,e.notes),e.file&&t.append(`file`,e.file),(await G.post(`/suppliers/profile/finance/invoices`,t,{headers:{"Content-Type":`multipart/form-data`}})).data}async function Ze(e){return(await G.post(`/suppliers/profile/finance/payments`,e)).data}async function Qe(e){let t=new FormData;return t.append(`title`,e.title),e.contract_id&&t.append(`contract_id`,String(e.contract_id)),e.description&&t.append(`description`,e.description),t.append(`file`,e.file),(await G.post(`/suppliers/profile/finance/photos`,t,{headers:{"Content-Type":`multipart/form-data`}})).data}async function $e(e,t){return(await G.put(`/suppliers/profile/finance/invoices/${e}`,t)).data}async function et(e){return(await G.delete(`/suppliers/profile/finance/invoices/${e}`)).data}async function tt(e,t){return(await G.put(`/suppliers/profile/finance/payments/${e}`,t)).data}async function nt(e){return(await G.delete(`/suppliers/profile/finance/payments/${e}`)).data}async function rt(e,t){return(await G.put(`/suppliers/profile/finance/photos/${e}`,t)).data}async function it(e){return(await G.delete(`/suppliers/profile/finance/photos/${e}`)).data}var at=h.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 40px 20px;
`,ot=h.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 32px;
    color: #1f2937;
    margin: 0;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    font-size: 16px;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &.profile {
      background-color: #667eea;
      color: white;

      &:hover {
        background-color: #5568d3;
      }
    }

    &.logout {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }
  }
`,st=h.div`
  max-width: 1200px;
  margin: 0 auto;
`,ct=h.div`
  margin-bottom: 40px;

  h2 {
    font-size: 20px;
    color: #1f2937;
    margin: 0 0 20px 0;
    font-weight: 600;
  }
`,lt=h.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`,ut=h.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  h3 {
    font-size: 18px;
    color: #1f2937;
    margin: 0 0 12px 0;
    font-weight: 600;
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #6b7280;

    span {
      display: flex;
      align-items: center;
      gap: 8px;

      strong {
        color: #1f2937;
      }
    }
  }

  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
    background-color: #dbeafe;
    color: #0c4a6e;

    &.pending {
      background-color: #fef3c7;
      color: #78350f;
    }

    &.submitted {
      background-color: #d1fae5;
      color: #065f46;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;

    &.primary {
      background-color: #667eea;
      color: white;

      &:hover {
        background-color: #5568d3;
      }
    }

    &.secondary {
      background-color: #e5e7eb;
      color: #374151;

      &:hover {
        background-color: #d1d5db;
      }
    }
  }
`,dt=h.div`
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;

  .icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    color: #1f2937;
    margin: 0 0 10px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`,ft=h.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 16px;
  color: #6b7280;
`;function pt(){let e=m(),[t,n]=(0,_.useState)([]),[r,i]=(0,_.useState)(!0),[a,o]=(0,_.useState)(null),[s,c]=(0,_.useState)(`-`),[l,u]=(0,_.useState)(`-`),[d,f]=(0,_.useState)(null),p=(0,_.useCallback)(async()=>{try{i(!0),o(null),n((await G.get(`/suppliers/dashboard/projects`)).data||[])}catch(e){console.error(`Error loading projects:`,e);let t=`Projeler yüklenirken hata oluştu`;if(typeof e==`object`&&e&&`response`in e){let n=e.response;n?.data?.detail&&(t=n.data.detail)}o(t)}finally{i(!1)}},[]),h=(0,_.useCallback)(async()=>{try{let e=await Le();if(c(e.supplier.company_name||`Firma`),u(`${e.user.name} (${e.user.email})`),e.supplier.logo_url){let t=`https://api.buyerasistans.com.tr/api/v1`?.replace(`/api/v1`,``)||`http://127.0.0.1:8000`;f(e.supplier.logo_url.startsWith(`http`)?e.supplier.logo_url:t+e.supplier.logo_url)}}catch{c(`Firma`),u(`Tedarikci kullanicisi`)}},[]);(0,_.useEffect)(()=>{if(!L()){window.location.href=`/supplier/login`;return}p(),h()},[p,h]);let g=e=>{alert(`⏰ Proje #${e} detayları çok yakında kullanılabilir olacak!`)},v=e=>{alert(`⏰ Proje #${e} için teklif gönderme fonksiyonu çok yakında kullanılabilir olacak!`)};return r?(0,x.jsx)(at,{children:(0,x.jsx)(ft,{children:`⏳ Projeler yükleniyor...`})}):(0,x.jsxs)(at,{children:[(0,x.jsxs)(ot,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[d&&(0,x.jsx)(`img`,{src:d,alt:`Firma logosu`,style:{height:52,maxWidth:140,objectFit:`contain`,borderRadius:8,background:`#fff`,padding:`4px 8px`,border:`1px solid #e5e7eb`}}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h1`,{children:`📊 Tedarikçi Paneli`}),(0,x.jsxs)(`p`,{children:[l,` - `,s]})]})]}),(0,x.jsxs)(`div`,{className:`actions`,children:[(0,x.jsx)(`button`,{className:`profile`,onClick:()=>{e(`/supplier/workspace?tab=offers`)},children:`📬 Tekliflerim`}),(0,x.jsx)(`button`,{className:`profile`,onClick:()=>{e(`/supplier/profile`)},children:`👤 Profilim`}),(0,x.jsx)(`button`,{className:`logout`,onClick:()=>{console.log(`[LOGOUT] Supplier çıkış yapıyor...`),z(),sessionStorage.removeItem(`pf_user`),localStorage.removeItem(`pf_user`),e(`/supplier/login`,{replace:!0})},children:`🚪 Çıkış`})]})]}),(0,x.jsxs)(st,{children:[a&&(0,x.jsx)(ct,{children:(0,x.jsx)(`div`,{style:{background:`#fee2e2`,color:`#991b1b`,padding:`16px`,borderRadius:`8px`,marginBottom:`20px`},children:a})}),(0,x.jsxs)(ct,{children:[(0,x.jsx)(`h2`,{children:`📦 Size Atanan Projeler`}),t.length===0?(0,x.jsxs)(dt,{children:[(0,x.jsx)(`div`,{className:`icon`,children:`📭`}),(0,x.jsx)(`h3`,{children:`Henüz proje atanmamış`}),(0,x.jsx)(`p`,{children:`Size proje atandığında burada gösterilecektir`})]}):(0,x.jsx)(lt,{children:t.map(e=>(0,x.jsxs)(ut,{children:[(0,x.jsx)(`h3`,{children:e.name}),(0,x.jsx)(`div`,{className:`status-badge pending`,children:e.quote_submitted?`📬 Teklif Gönderildi`:`📝 Teklif Bekleniyor`}),(0,x.jsxs)(`div`,{className:`project-meta`,children:[e.description&&(0,x.jsxs)(`span`,{children:[(0,x.jsx)(`strong`,{children:`📋`}),` `,e.description.substring(0,50),`...`]}),e.budget&&(0,x.jsxs)(`span`,{children:[(0,x.jsx)(`strong`,{children:`💰`}),` Bütçe:`,` `,new Intl.NumberFormat(`tr-TR`,{style:`currency`,currency:`TRY`}).format(e.budget)]})]}),(0,x.jsxs)(`div`,{className:`actions`,children:[(0,x.jsx)(`button`,{className:`primary`,disabled:!0,onClick:()=>v(e.id),title:`Çok yakında kullanılabilir`,children:e.quote_submitted?`📝 Teklifi Düzenle`:`📝 Teklif Gönder`}),(0,x.jsx)(`button`,{className:`secondary`,disabled:!0,onClick:()=>g(e.id),title:`Çok yakında kullanılabilir`,children:`👁️ Detaylar`})]})]},e.id))})]}),(0,x.jsxs)(ct,{children:[(0,x.jsx)(`h2`,{children:`📞 Destek`}),(0,x.jsx)(`div`,{style:{background:`white`,padding:`20px`,borderRadius:`12px`},children:(0,x.jsxs)(`p`,{children:[`Sorularınız veya sorunlarınız için lütfen`,(0,x.jsx)(`strong`,{children:` info@olimposyapi.com `}),`adresine e-posta gönderin.`]})})]})]})]})}function mt({text:e=`Yükleniyor...`}){return(0,x.jsx)(`div`,{style:{padding:24,fontFamily:`Arial`},children:(0,x.jsx)(`p`,{children:e})})}async function ht(e=1,t=10,n){let r=n===`submitted`?`sent`:n,i=new URLSearchParams({page:e.toString(),size:t.toString()});return r&&i.append(`status_filter`,r),(await G.get(`/quotes?${i}`)).data}async function gt(e){return(await G.get(`/quotes/${e}`)).data}async function _t(e){return(await G.post(`/quotes/`,e)).data}async function vt(e,t){return(await G.put(`/quotes/${e}/items`,t)).data}async function yt(e,t){return(await G.put(`/quotes/${e}`,t)).data}async function bt(e){await G.delete(`/quotes/${e}`)}async function xt(e,t){return(await G.post(`/quotes/${e}/submit`,t||{})).data}async function St(e,t){return(await G.post(`/quotes/${e}/approve`,t||{})).data}async function Ct(e,t){return(await G.post(`/quotes/${e}/reject`,t||{})).data}async function wt(e){return(await G.get(`/quotes/${e}/status-history`)).data}async function Tt(e){return(await G.get(`/quotes/${e}/suppliers`)).data}async function Et(e,t,n){return(await G.post(`/quotes/${e}/request-revision/${t}?reason=${encodeURIComponent(n)}`)).data}async function Dt(e,t,n){return(await G.post(`/quotes/${e}/submit-revision`,{supplier_quote_id:t,revised_prices:n})).data}var Ot={draft:`Taslak`,submitted:`Onaya Gönderildi`,approved:`Onaylandı`,rejected:`Reddedildi`},kt={draft:`#f3f4f6`,submitted:`#fef3c7`,approved:`#d1fae5`,rejected:`#fee2e2`};function At({quoteId:e,projectId:t,suppliers:n,onClose:r,onSent:i}){let[a,o]=(0,_.useState)(`all`),[s,c]=(0,_.useState)([]),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)(null),p=(0,_.useMemo)(()=>{let e=new Set;return n.forEach(t=>{t.category&&e.add(t.category)}),[`all`,...Array.from(e).sort((e,t)=>e.localeCompare(t,`tr`))]},[n]),m=(0,_.useMemo)(()=>{let e=n.filter(e=>e.is_active);return a===`all`?e:e.filter(e=>(e.category||``)===a)},[n,a]),h=e=>{c(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])};return(0,x.jsx)(`div`,{onClick:r,style:{position:`fixed`,inset:0,background:`rgba(0,0,0,0.45)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1200,padding:`16px`},children:(0,x.jsxs)(`div`,{onClick:e=>e.stopPropagation(),style:{width:`min(760px, 100%)`,maxHeight:`85vh`,overflow:`auto`,background:`#fff`,borderRadius:`10px`,border:`1px solid #e5e7eb`,padding:`18px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,x.jsx)(`h3`,{style:{margin:0},children:`Teklifi Tedarikçilere Gönder`}),(0,x.jsx)(`button`,{onClick:r,style:{border:`none`,background:`transparent`,fontSize:`18px`,cursor:`pointer`},children:`✕`})]}),(0,x.jsxs)(`div`,{style:{fontSize:`13px`,color:`#4b5563`,marginBottom:`12px`},children:[`Proje ID: `,t,` - Sadece bu projeye eklenen tedarikçiler listelenir.`]}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`,marginBottom:`12px`},children:p.map(e=>(0,x.jsx)(`button`,{type:`button`,onClick:()=>o(e),style:{border:`1px solid #d1d5db`,borderRadius:`999px`,padding:`6px 10px`,cursor:`pointer`,background:a===e?`#2563eb`:`#fff`,color:a===e?`#fff`:`#1f2937`,fontSize:`12px`,fontWeight:600},children:e===`all`?`Tüm Kategoriler`:e},e))}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginBottom:`10px`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:()=>{c(e=>{let t=new Set(e);return m.forEach(e=>t.add(e.supplier_id)),Array.from(t)})},style:{border:`1px solid #d1d5db`,borderRadius:`6px`,padding:`6px 10px`,cursor:`pointer`,background:`#fff`},children:`Görünenleri Seç`}),(0,x.jsx)(`button`,{type:`button`,onClick:()=>c([]),style:{border:`1px solid #d1d5db`,borderRadius:`6px`,padding:`6px 10px`,cursor:`pointer`,background:`#fff`},children:`Seçimi Temizle`})]}),d&&(0,x.jsx)(`div`,{style:{background:`#fee2e2`,color:`#991b1b`,padding:`10px`,borderRadius:`6px`,marginBottom:`10px`},children:d}),(0,x.jsx)(`div`,{style:{display:`grid`,gap:`8px`,marginBottom:`12px`},children:m.length===0?(0,x.jsx)(`div`,{style:{color:`#6b7280`,fontSize:`13px`,padding:`8px`},children:`Bu filtrede tedarikçi yok.`}):m.map(e=>(0,x.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,border:`1px solid #e5e7eb`,borderRadius:`8px`,padding:`10px`,cursor:`pointer`},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:s.includes(e.supplier_id),onChange:()=>h(e.supplier_id)}),(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`},children:[(0,x.jsx)(`strong`,{style:{fontSize:`14px`},children:e.supplier_name}),(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#6b7280`},children:e.supplier_email}),(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#6b7280`},children:e.category||`Kategori yok`})]})]},e.id))}),(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:r,style:{padding:`8px 14px`,borderRadius:`6px`,border:`1px solid #d1d5db`,background:`#fff`,cursor:`pointer`},children:`İptal`}),(0,x.jsx)(`button`,{type:`button`,onClick:async()=>{if(s.length===0){f(`En az bir tedarikçi seçiniz.`);return}try{u(!0),f(null),await G.post(`/quotes/${e}/send-to-suppliers`,s),i(),r()}catch(e){f((typeof e==`object`&&e&&`response`in e&&typeof e.response?.data?.detail==`string`?e.response?.data?.detail:null)||(e instanceof Error?e.message:`Teklif gönderilemedi`))}finally{u(!1)}},disabled:l||s.length===0,style:{padding:`8px 14px`,borderRadius:`6px`,border:`none`,background:l?`#9ca3af`:`#2563eb`,color:`#fff`,cursor:l?`not-allowed`:`pointer`,fontWeight:700},children:l?`Gönderiliyor...`:`Gönder (${s.length})`})]})]})})}function jt(e){let t=String(e).toLowerCase();return t===`approved`?`approved`:t===`rejected`?`rejected`:t===`submitted`||t===`sent`||t===`pending`||t===`responded`?`submitted`:`draft`}function Mt(){let e=m(),[t,n]=(0,_.useState)([]),[r,i]=(0,_.useState)(!0),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(1),[u,d]=(0,_.useState)(0),[f,p]=(0,_.useState)(``),[h,g]=(0,_.useState)(null),[v,y]=(0,_.useState)([]),b=(0,_.useCallback)(async()=>{try{i(!0),s(null);let e=await ht(c,10,f||void 0);n(e.items),d(e.total)}catch(e){s(e instanceof Error?e.message:`Teklif yüklenemedi`)}finally{i(!1)}},[c,f]);(0,_.useEffect)(()=>{b()},[b]);let S=async e=>{if(window.confirm(`Bu teklifi silmek istediğinize emin misiniz?`))try{await bt(e),await b()}catch(e){s(e instanceof Error?e.message:`Teklif silinemedi`)}},C=async e=>{try{let t=await G.get(`/suppliers/projects/${e.project_id}/suppliers`);y(Array.isArray(t.data)?t.data:[]),g(e)}catch(e){s(e instanceof Error?e.message:`Projeye ekli tedarikçiler yüklenemedi`)}};return r?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:20},children:`Yükleniyor...`}):(0,x.jsxs)(`div`,{style:{padding:`16px`},children:[h&&(0,x.jsx)(At,{quoteId:h.id,projectId:Number(h.project_id||0),suppliers:v,onClose:()=>g(null),onSent:async()=>{g(null),await b()}}),(0,x.jsxs)(`div`,{style:{marginBottom:`20px`},children:[(0,x.jsxs)(`h3`,{children:[`Teklifler (`,u,`)`]}),(0,x.jsxs)(`div`,{style:{marginBottom:`16px`,display:`flex`,gap:`8px`},children:[(0,x.jsxs)(`select`,{value:f,onChange:e=>{p(e.target.value),l(1)},style:{padding:`8px`,borderRadius:`4px`,border:`1px solid #ddd`},children:[(0,x.jsx)(`option`,{value:``,children:`Tüm Durumlar`}),(0,x.jsx)(`option`,{value:`draft`,children:`Taslak`}),(0,x.jsx)(`option`,{value:`sent`,children:`Gönderildi`}),(0,x.jsx)(`option`,{value:`approved`,children:`Onaylandı`}),(0,x.jsx)(`option`,{value:`rejected`,children:`Reddedildi`})]}),(0,x.jsx)(a,{to:`/quotes/create`,style:{textDecoration:`none`},children:(0,x.jsx)(`button`,{style:{padding:`8px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`+ Yeni Teklif`})})]}),o&&(0,x.jsx)(`div`,{style:{color:`red`,padding:`8px`,background:`#fee2e2`,borderRadius:`4px`},children:o}),t.length===0?(0,x.jsx)(`p`,{style:{textAlign:`center`,color:`#999`},children:`Teklif bulunamadı`}):(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`14px`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`,borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Başlık`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`right`},children:`Tutar`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Durum`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Ver`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`center`},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:t.map(t=>{let n=jt(t.status);return(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`},children:[(0,x.jsx)(`td`,{style:{padding:`12px`},children:t.title}),(0,x.jsx)(`td`,{style:{padding:`12px`,textAlign:`right`,fontWeight:`bold`},children:(t.total_amount||t.amount||0).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})}),(0,x.jsx)(`td`,{style:{padding:`12px`},children:(0,x.jsx)(`span`,{style:{padding:`4px 8px`,borderRadius:`4px`,background:kt[n],fontSize:`12px`,fontWeight:`bold`},children:Ot[n]})}),(0,x.jsx)(`td`,{style:{padding:`12px`,fontSize:`12px`},children:new Date(t.created_at).toLocaleDateString(`tr-TR`)}),(0,x.jsx)(`td`,{style:{padding:`12px`,textAlign:`center`},children:(0,x.jsxs)(`div`,{style:{display:`inline-flex`,gap:`8px`,alignItems:`center`},children:[(0,x.jsx)(a,{to:`/quotes/${t.id}`,style:{color:`#3b82f6`,textDecoration:`none`,fontWeight:`bold`},children:`Görüntüle`}),(0,x.jsx)(`button`,{onClick:()=>e(`/quotes/${t.id}/edit`),style:{border:`none`,background:`transparent`,color:`#0f766e`,cursor:`pointer`,fontWeight:700},children:`Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>S(t.id),style:{border:`none`,background:`transparent`,color:`#dc2626`,cursor:`pointer`,fontWeight:700},children:`Sil`}),(0,x.jsx)(`button`,{onClick:()=>C(t),style:{border:`none`,background:`transparent`,color:`#1d4ed8`,cursor:`pointer`,fontWeight:700},children:`Gönder`}),(String(t.status).toLowerCase()===`sent`||String(t.status).toLowerCase()===`responded`)&&(0,x.jsx)(`button`,{onClick:()=>e(`/quotes/${t.id}`),style:{border:`none`,background:`transparent`,color:`#7c3aed`,cursor:`pointer`,fontWeight:700},children:`Göster`})]})})]},t.id)})})]})}),u>10&&(0,x.jsxs)(`div`,{style:{marginTop:`16px`,display:`flex`,justifyContent:`center`,gap:`8px`},children:[(0,x.jsx)(`button`,{onClick:()=>l(e=>Math.max(1,e-1)),disabled:c===1,style:{padding:`8px 12px`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:c===1?`not-allowed`:`pointer`,opacity:c===1?.5:1},children:`Önceki`}),(0,x.jsxs)(`span`,{style:{padding:`8px 12px`},children:[`Sayfa `,c,` / `,Math.ceil(u/10)]}),(0,x.jsx)(`button`,{onClick:()=>l(e=>Math.min(Math.ceil(u/10),e+1)),disabled:c>=Math.ceil(u/10),style:{padding:`8px 12px`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:c>=Math.ceil(u/10)?`not-allowed`:`pointer`,opacity:c>=Math.ceil(u/10)?.5:1},children:`Sonraki`})]})]})]})}async function Nt(){return(await G.get(`/admin/companies`)).data}async function Pt(e){return(await G.post(`/admin/companies`,e)).data}async function Ft(e,t){return(await G.put(`/admin/companies/${e}`,t)).data}async function It(e){await G.delete(`/admin/companies/${e}`)}async function Lt(){return(await G.get(`/admin/roles`)).data}async function Rt(e){return(await G.post(`/admin/roles`,e)).data}async function zt(e,t){return(await G.put(`/admin/roles/${e}`,t)).data}async function Bt(e){await G.delete(`/admin/roles/${e}`)}async function Vt(){return(await G.get(`/admin/permissions`)).data}async function Ht(){return(await G.get(`/admin/departments`)).data}async function Ut(e){return(await G.post(`/admin/departments`,e)).data}async function Wt(e,t){return(await G.put(`/admin/departments/${e}`,t)).data}async function Gt(e){await G.delete(`/admin/departments/${e}`)}async function Kt(){return(await G.get(`/admin/projects`)).data}async function qt(){return(await G.get(`/admin/users`)).data}async function Jt(e){return(await G.post(`/admin/users`,e)).data}async function Yt(e,t){return(await G.put(`/admin/users/${e}`,t)).data}async function Xt(e){await G.delete(`/admin/users/${e}`)}async function Zt(e){return(await G.get(`/suppliers/${e}/management`)).data}async function Qt(e,t){return(await G.put(`/suppliers/${e}/management`,t)).data}async function $t(e,t){return(await G.post(`/suppliers/${e}/guarantees`,t)).data}async function en(e,t,n){return(await G.put(`/suppliers/${e}/guarantees/${t}`,n)).data}async function tn(e,t){return(await G.delete(`/suppliers/${e}/guarantees/${t}`)).data}async function nn(e,t,n){return(await G.put(`/suppliers/${e}/users/${t}`,n)).data}async function rn(e,t){return(await G.delete(`/suppliers/${e}/users/${t}`)).data}async function an(e,t){return(await G.post(`/suppliers/${e}/users/${t}/set-default`)).data}async function on(e,t){return(await G.post(`/suppliers/${e}/users`,t)).data}async function sn(e,t){return(await G.get(`/suppliers/${e}/documents`,{params:t?{category:t}:void 0})).data.documents??[]}async function cn(e,t){return(await G.delete(`/suppliers/${e}/documents/${t}`)).data}async function ln(e,t,n){let r=new FormData;return r.append(`file`,n),(await G.post(`/suppliers/${e}/documents/${t}`,r,{headers:{"Content-Type":`multipart/form-data`}})).data.document}async function un(e,t){let n=new FormData;n.append(`to_email`,t.to_email),n.append(`subject`,t.subject),n.append(`body`,t.body),t.cc&&n.append(`cc`,t.cc);for(let e of t.attachments||[])n.append(`attachments`,e);return(await G.post(`/suppliers/${e}/contact-email`,n,{headers:{"Content-Type":`multipart/form-data`}})).data}async function dn(e,t){return(await G.get(`/suppliers/${e}/finance-summary`,{params:t})).data}async function fn(e,t){let n=new FormData;return n.append(`title`,t.title),n.append(`amount`,String(t.amount)),t.contract_id&&n.append(`contract_id`,String(t.contract_id)),t.invoice_number&&n.append(`invoice_number`,t.invoice_number),t.invoice_date&&n.append(`invoice_date`,t.invoice_date),t.currency&&n.append(`currency`,t.currency),t.notes&&n.append(`notes`,t.notes),t.file&&n.append(`file`,t.file),(await G.post(`/suppliers/${e}/finance/invoices`,n,{headers:{"Content-Type":`multipart/form-data`}})).data}async function pn(e,t){return(await G.post(`/suppliers/${e}/finance/payments`,t)).data}async function mn(e,t){let n=new FormData;return n.append(`title`,t.title),t.contract_id&&n.append(`contract_id`,String(t.contract_id)),t.description&&n.append(`description`,t.description),n.append(`file`,t.file),(await G.post(`/suppliers/${e}/finance/photos`,n,{headers:{"Content-Type":`multipart/form-data`}})).data}async function hn(e,t,n){return(await G.put(`/suppliers/${e}/finance/invoices/${t}`,n)).data}async function gn(e,t){return(await G.delete(`/suppliers/${e}/finance/invoices/${t}`)).data}async function _n(e,t,n){return(await G.put(`/suppliers/${e}/finance/payments/${t}`,n)).data}async function vn(e,t){return(await G.delete(`/suppliers/${e}/finance/payments/${t}`)).data}async function yn(e,t,n){return(await G.put(`/suppliers/${e}/finance/photos/${t}`,n)).data}async function bn(e,t){return(await G.delete(`/suppliers/${e}/finance/photos/${t}`)).data}async function xn(e=10){return(await G.get(`/suppliers/finance-mismatches`,{params:{limit:e}})).data}async function Sn(){return(await G.get(`/supplier-quotes/price-rules`)).data}async function Cn(e){return(await G.put(`/supplier-quotes/price-rules`,e)).data}function wn(){let{user:e,logout:t}=b(),[n,r]=(0,_.useState)([]);return(0,_.useEffect)(()=>{(e?.role===`admin`||e?.role===`super_admin`)&&xn(5).then(e=>r(e.items)).catch(()=>{})},[e?.role]),e?(0,x.jsxs)(`div`,{style:{fontFamily:`Arial`},children:[(0,x.jsxs)(`div`,{style:{maxWidth:760,margin:`32px auto`,padding:16},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{style:{margin:`0 0 8px 0`},children:`Dashboard`}),(0,x.jsxs)(`p`,{style:{margin:`4px 0`,color:`#666`,fontSize:`14px`},children:[`Hoşgeldin, `,e.email,` (`,e.role,`)`]})]}),(0,x.jsx)(`button`,{onClick:t,style:{padding:`8px 12px`,borderRadius:8,border:`1px solid #d1d5db`,background:`#fff`,cursor:`pointer`},children:`Çıkış Yap`})]}),(e.role===`admin`||e.role===`super_admin`)&&(0,x.jsx)(`div`,{style:{background:`#f0f4ff`,padding:`12px`,borderRadius:`8px`,marginBottom:`20px`},children:(0,x.jsx)(a,{to:`/admin/quotes`,style:{color:`#3b82f6`,textDecoration:`none`,fontWeight:`bold`},children:`→ Tüm Teklifleri Yönet (Admin)`})}),n.length>0&&(0,x.jsxs)(`div`,{style:{marginBottom:20},children:[(0,x.jsx)(`h3`,{style:{margin:`0 0 10px 0`,fontSize:15,color:`#991b1b`},children:`⚠️ Finans Uyarıları`}),(0,x.jsx)(`div`,{style:{display:`grid`,gap:8},children:n.map(e=>(0,x.jsxs)(`div`,{style:{background:`#fef2f2`,border:`1px solid #fca5a5`,borderRadius:8,padding:`10px 14px`,display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,gap:12},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontWeight:600,fontSize:14,color:`#991b1b`},children:(0,x.jsx)(a,{to:`/admin/suppliers/${e.supplier_id}`,style:{color:`#991b1b`,textDecoration:`underline`},children:e.supplier_name})}),(0,x.jsx)(`div`,{style:{fontSize:12,color:`#7f1d1d`,marginTop:2},children:e.alerts.join(` • `)})]}),(0,x.jsxs)(`div`,{style:{fontSize:11,color:`#b91c1c`,textAlign:`right`,flexShrink:0},children:[(0,x.jsxs)(`div`,{children:[`Sözleşme: `,e.totals.contract_total.toLocaleString(`tr-TR`)]}),(0,x.jsxs)(`div`,{children:[`Fatura: `,e.totals.invoice_total.toLocaleString(`tr-TR`)]}),(0,x.jsxs)(`div`,{children:[`Ödeme: `,e.totals.payment_total.toLocaleString(`tr-TR`)]})]})]},e.supplier_id))})]})]}),(0,x.jsx)(Mt,{})]}):(0,x.jsx)(mt,{text:`Kullanıcı bilgileri yükleniyor...`})}async function Tn(){return(await G.get(`/admin/projects`)).data}async function En(e){return(await G.post(`/admin/projects`,e)).data}async function Dn(e,t){return(await G.put(`/admin/projects/${e}`,t)).data}async function On(e){return(await G.delete(`/admin/projects/${e}`)).data}async function kn(e,t){let n=new FormData;return n.append(`file`,t),(await G.post(`/admin/projects/${e}/files`,n,{headers:{"Content-Type":`multipart/form-data`}})).data}async function An(e){return(await G.get(`/admin/projects/${e}/files`)).data}async function jn(e){return(await G.delete(`/admin/files/${e}`)).data}async function Mn(e){return(await G.get(`/suppliers/projects/${e}/suppliers`)).data}var K={backdrop:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0,0,0,0.5)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:9999,padding:`20px`},container:{backgroundColor:`white`,borderRadius:`8px`,width:`100%`,maxWidth:`600px`,maxHeight:`90vh`,overflow:`auto`,boxShadow:`0 10px 40px rgba(0,0,0,0.2)`},header:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,paddingBottom:`12px`,borderBottom:`1px solid #e0e0e0`,padding:`16px 20px`,backgroundColor:`#f5f5f5`},title:{margin:0,fontSize:`18px`,fontWeight:`bold`},closeButton:{background:`none`,border:`none`,fontSize:`24px`,cursor:`pointer`,color:`#666`},content:{padding:`20px`},errorMessage:{backgroundColor:`#ffebee`,border:`1px solid #ff6b6b`,color:`#d32f2f`,padding:`12px`,borderRadius:`4px`,marginBottom:`16px`,fontSize:`13px`},grid:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`,marginBottom:`12px`},input:{width:`100%`,padding:`8px 12px`,border:`1px solid #ccc`,borderRadius:`4px`,fontSize:`14px`,fontFamily:`inherit`,boxSizing:`border-box`},label:{display:`block`,fontSize:`13px`,fontWeight:600,marginBottom:`4px`,color:`#333`},fullWidth:{marginBottom:`12px`},textarea:{width:`100%`,padding:`8px 12px`,border:`1px solid #ccc`,borderRadius:`4px`,fontSize:`14px`,fontFamily:`inherit`,boxSizing:`border-box`,resize:`none`},checkboxLabel:{display:`flex`,alignItems:`center`,gap:`8px`,fontSize:`13px`},checkbox:{width:`16px`,height:`16px`,cursor:`pointer`},footer:{display:`flex`,gap:`10px`,borderTop:`1px solid #e0e0e0`,paddingTop:`16px`},primaryButton:{flex:1,padding:`12px 16px`,backgroundColor:`#2196F3`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`14px`},primaryButtonDisabled:{flex:1,padding:`12px 16px`,backgroundColor:`#ccc`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`not-allowed`,fontWeight:`bold`,fontSize:`14px`},secondaryButton:{flex:1,padding:`12px 16px`,backgroundColor:`#e0e0e0`,color:`#333`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`14px`},dangerButton:{flex:1,padding:`12px 16px`,backgroundColor:`#f44336`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`14px`}};function Nn({isOpen:e,onClose:t,onSuccess:n}){let[r,i]=(0,_.useState)([]),[a,o]=(0,_.useState)(!1),[s,c]=(0,_.useState)(``),[l,u]=(0,_.useState)(``),[d,f]=(0,_.useState)(``),[p,m]=(0,_.useState)(),[h,v]=(0,_.useState)(`merkez`),[y,b]=(0,_.useState)(``),[S,C]=(0,_.useState)(``),[w,T]=(0,_.useState)(``),[E,D]=(0,_.useState)(``),[O,k]=(0,_.useState)(),[A,j]=(0,_.useState)(!0);(0,_.useEffect)(()=>{e&&r.length===0&&M()},[e,r.length]);async function M(){try{i(await Nt())}catch(e){c(`Firmalar yüklenemedi: `+String(e))}}async function N(e){e.preventDefault(),c(``),o(!0);try{if(!l.trim())throw Error(`Proje adı gerekli`);if(!d.trim())throw Error(`Proje kodu gerekli`);if(!p)throw Error(`Firma seçimi gerekli`);await En({name:l,code:d,company_id:p,project_type:h,manager_name:y||void 0,manager_phone:S||void 0,address:E||void 0,budget:O||void 0,is_active:A}),n(),t(),P()}catch(e){c(e instanceof Error?e.message:`Proje oluşturulamadı`),g.isAxiosError(e)?console.error(`[PROJECT] API Error:`,{status:e.response?.status,data:e.response?.data,message:e.message}):console.error(`[PROJECT] Error:`,e)}finally{o(!1)}}function P(){u(``),f(``),m(void 0),v(`merkez`),b(``),C(``),T(``),D(``),k(void 0),j(!0),c(``)}return e?(0,x.jsx)(`div`,{style:K.backdrop,children:(0,x.jsxs)(`div`,{style:K.container,children:[(0,x.jsxs)(`div`,{style:K.header,children:[(0,x.jsx)(`h2`,{style:K.title,children:`➕ Yeni Proje Oluştur`}),(0,x.jsx)(`button`,{onClick:t,style:K.closeButton,children:`✕`})]}),(0,x.jsxs)(`form`,{onSubmit:N,style:K.content,children:[s&&(0,x.jsx)(`div`,{style:K.errorMessage,children:s}),(0,x.jsxs)(`div`,{style:K.grid,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Adı *`}),(0,x.jsx)(`input`,{type:`text`,value:l,onChange:e=>u(e.target.value),placeholder:`örn: Pizza Max Merkez`,style:K.input})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Kodu *`}),(0,x.jsx)(`input`,{type:`text`,value:d,onChange:e=>f(e.target.value),placeholder:`örn: PM-001`,style:K.input})]})]}),(0,x.jsxs)(`div`,{style:K.grid,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Firma *`}),(0,x.jsxs)(`select`,{value:p||``,onChange:e=>m(e.target.value?parseInt(e.target.value):void 0),style:K.input,children:[(0,x.jsx)(`option`,{value:``,children:`Firma seçin...`}),r.map(e=>(0,x.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Tipi`}),(0,x.jsxs)(`select`,{value:h,onChange:e=>v(e.target.value),style:K.input,children:[(0,x.jsx)(`option`,{value:`merkez`,children:`🏢 Merkez`}),(0,x.jsx)(`option`,{value:`franchise`,children:`🍕 Franchise`})]})]})]}),(0,x.jsxs)(`div`,{style:K.grid,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Yetkilisi`}),(0,x.jsx)(`input`,{type:`text`,value:y,onChange:e=>b(e.target.value),placeholder:`Ad Soyad`,style:K.input})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Telefon`}),(0,x.jsx)(`input`,{type:`tel`,value:S,onChange:e=>C(e.target.value),placeholder:`+90 555 123 4567`,style:K.input})]})]}),(0,x.jsxs)(`div`,{style:K.fullWidth,children:[(0,x.jsx)(`label`,{style:K.label,children:`Yetkili E-mail`}),(0,x.jsx)(`input`,{type:`email`,value:w,onChange:e=>T(e.target.value),placeholder:`yetkili@example.com`,style:K.input})]}),(0,x.jsxs)(`div`,{style:K.fullWidth,children:[(0,x.jsx)(`label`,{style:K.label,children:`Adres`}),(0,x.jsx)(`textarea`,{value:E,onChange:e=>D(e.target.value),placeholder:`Proje adresi...`,rows:2,style:K.textarea}),E&&(0,x.jsx)(`div`,{style:{width:`100%`,height:`200px`,borderRadius:`8px`,overflow:`hidden`,border:`1px solid #ddd`,marginTop:`8px`},children:(0,x.jsx)(`iframe`,{width:`100%`,height:`100%`,style:{border:0},loading:`lazy`,allowFullScreen:!0,src:`https://www.google.com/maps/embed/v1/place?key=AIzaSyBaXW3jHmQX3Q6K5Z9Y0L2M0N1O2P3Q4R&q=${encodeURIComponent(E)}`})})]}),(0,x.jsxs)(`div`,{style:K.fullWidth,children:[(0,x.jsx)(`label`,{style:K.label,children:`Bütçe (TL)`}),(0,x.jsx)(`input`,{type:`number`,value:O||``,onChange:e=>k(e.target.value?parseFloat(e.target.value):void 0),placeholder:`0.00`,step:`0.01`,min:`0`,style:K.input})]}),(0,x.jsx)(`div`,{style:{...K.fullWidth,marginBottom:`16px`},children:(0,x.jsxs)(`label`,{style:K.checkboxLabel,children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:A,onChange:e=>j(e.target.checked),style:K.checkbox}),(0,x.jsx)(`span`,{children:`Projeyi aktif olarak oluştur`})]})}),(0,x.jsxs)(`div`,{style:K.footer,children:[(0,x.jsx)(`button`,{type:`submit`,disabled:a,style:a?K.primaryButtonDisabled:K.primaryButton,children:a?`⏳ Kaydediliyor...`:`✅ Proje Oluştur`}),(0,x.jsx)(`button`,{type:`button`,onClick:t,style:K.secondaryButton,children:`❌ İptal`})]})]})]})}):null}function Pn(){let[e,t]=(0,_.useState)([]),[n,r]=(0,_.useState)([]),[i,o]=(0,_.useState)(!0),[s,c]=(0,_.useState)(!1),[l,u]=(0,_.useState)(``);(0,_.useEffect)(()=>{d()},[]);async function d(){try{o(!0);let[e,n]=await Promise.all([Tn(),Nt()]);t(e),r(n)}catch(e){console.error(`Veriler yüklenemedi:`,e)}finally{o(!1)}}async function f(n){if(confirm(`Projeyi silmek istediğinize emin misiniz?`))try{await On(n),t(e.filter(e=>e.id!==n))}catch(e){console.error(`Proje silme hatası:`,e)}}let p=e=>n.find(t=>t.id===e)?.name||`Firma yok`,m=e.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())||e.code.toLowerCase().includes(l.toLowerCase()));return i?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`},children:`Yükleniyor...`}):(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`,gap:`12px`},children:[(0,x.jsx)(`input`,{type:`text`,placeholder:`Proje adı veya kodu ara...`,value:l,onChange:e=>u(e.target.value),style:{flex:`1`,padding:`10px 12px`,border:`1px solid #d1d5db`,borderRadius:`6px`,fontSize:`14px`}}),(0,x.jsx)(`button`,{onClick:()=>c(!0),style:{padding:`10px 16px`,backgroundColor:`#3b82f6`,color:`white`,border:`none`,borderRadius:`6px`,fontWeight:`bold`,cursor:`pointer`,fontSize:`14px`},onMouseEnter:e=>e.currentTarget.style.backgroundColor=`#2563eb`,onMouseLeave:e=>e.currentTarget.style.backgroundColor=`#3b82f6`,children:`➕ Yeni Proje`})]}),m.length>0?(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0`},children:m.map(e=>(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`150px 1fr 120px 150px auto`,gap:`16px`,padding:`16px`,alignItems:`center`,borderBottom:`1px solid #e5e7eb`,backgroundColor:`#fff`,transition:`background-color 0.2s`},onMouseEnter:e=>e.currentTarget.style.backgroundColor=`#f9fafb`,onMouseLeave:e=>e.currentTarget.style.backgroundColor=`#fff`,children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`span`,{style:{display:`inline-block`,backgroundColor:n.find(t=>t.id===e.company_id)?.color||`#3b82f6`,color:`white`,padding:`6px 12px`,borderRadius:`6px`,fontSize:`12px`,fontWeight:`600`,wordBreak:`break-word`},children:p(e.company_id)})}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:{margin:`0`,fontSize:`14px`,fontWeight:`600`,color:`#1f2937`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:e.name}),(0,x.jsxs)(`p`,{style:{margin:`4px 0 0 0`,fontSize:`12px`,color:`#6b7280`},children:[`Kod: `,e.code]})]}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`span`,{style:{display:`inline-block`,backgroundColor:e.project_type===`franchise`?`#f3e8ff`:`#dcfce7`,color:e.project_type===`franchise`?`#9333ea`:`#16a34a`,padding:`4px 8px`,borderRadius:`4px`,fontSize:`12px`,fontWeight:`600`},children:e.project_type===`franchise`?`🍕 Franchise`:`🏢 Merkez`})}),(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`8px`},children:[(0,x.jsx)(`span`,{style:{fontSize:`13px`,color:`#374151`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,flex:`1`},children:e.manager_name||`-`}),e.manager_phone&&(0,x.jsx)(`a`,{href:`tel:${e.manager_phone}`,style:{padding:`4px 8px`,backgroundColor:`#22c55e`,color:`white`,borderRadius:`4px`,textDecoration:`none`,fontSize:`12px`,fontWeight:`600`,cursor:`pointer`,border:`none`,flexShrink:0,transition:`background-color 0.2s`},title:e.manager_phone,onMouseEnter:e=>e.currentTarget.style.backgroundColor=`#16a34a`,onMouseLeave:e=>e.currentTarget.style.backgroundColor=`#22c55e`,children:`☎️`})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,justifyContent:`flex-end`},children:[(0,x.jsx)(a,{to:`/admin/projects/${e.id}`,style:{padding:`6px 12px`,backgroundColor:`#3b82f6`,color:`white`,textDecoration:`none`,borderRadius:`4px`,fontSize:`12px`,fontWeight:`600`,border:`none`,cursor:`pointer`,transition:`background-color 0.2s`},onMouseEnter:e=>e.currentTarget.style.backgroundColor=`#2563eb`,onMouseLeave:e=>e.currentTarget.style.backgroundColor=`#3b82f6`,children:`Detaylar`}),(0,x.jsx)(`button`,{onClick:()=>f(e.id),style:{padding:`6px 12px`,backgroundColor:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,fontWeight:`600`,cursor:`pointer`,transition:`background-color 0.2s`},onMouseEnter:e=>e.currentTarget.style.backgroundColor=`#dc2626`,onMouseLeave:e=>e.currentTarget.style.backgroundColor=`#ef4444`,children:`🗑️`})]})]},e.id))}):(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`,color:`#6b7280`,backgroundColor:`#f3f4f6`,borderRadius:`8px`,border:`1px solid #e5e7eb`},children:l?`Sonuç bulunamadı`:`Henüz proje oluşturulmamış`}),(0,x.jsx)(Nn,{isOpen:s,onClose:()=>c(!1),onSuccess:()=>{d(),c(!1)}})]})}function Fn(){let[e,t]=(0,_.useState)([]),[n,r]=(0,_.useState)([]),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)([]),[u,d]=(0,_.useState)({name:``,description:``,parent_id:void 0,is_active:!0}),[f,p]=(0,_.useState)(!0),[m,h]=(0,_.useState)(null);(0,_.useEffect)(()=>{g()},[]);async function g(){try{p(!0);let[e,n]=await Promise.all([Lt(),Vt()]);t(e),r(n)}catch(e){h(String(e))}finally{p(!1)}}let v=async()=>{if(!u.name.trim()){alert(`Rol adı gereklidir`);return}try{await Rt({name:u.name,description:u.description,parent_id:u.parent_id,permission_ids:c}),await g(),d({name:``,description:``,parent_id:void 0,is_active:!0}),l([]),a(!1)}catch(e){alert(`Rol ekleme hatası: `+String(e))}},y=async e=>{try{await zt(e,{name:u.name,description:u.description,parent_id:u.parent_id!==void 0&&u.parent_id!==null?u.parent_id:void 0,is_active:u.is_active,permission_ids:c}),await g(),s(null),d({name:``,description:``,parent_id:void 0,is_active:!0}),l([])}catch(e){alert(`Rol güncelleme hatası: `+String(e))}},b=async e=>{if(confirm(`Bu rolü silmek istediğinize emin misiniz?`))try{await Bt(e),await g()}catch(e){alert(`Silme hatası: `+String(e))}},S=e=>{s(e.id),d({name:e.name,description:e.description||``,parent_id:e.parent_id||void 0,is_active:e.is_active}),l(e.permissions.map(e=>e.id))},C=()=>{s(null),d({name:``,description:``,parent_id:void 0,is_active:!0}),l([])},w=e=>{l(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])};if(f)return(0,x.jsx)(`div`,{style:{padding:20},children:`Yükleniyor...`});return(0,x.jsxs)(`div`,{children:[m&&(0,x.jsx)(`div`,{style:{padding:12,background:`#fecaca`,color:`#dc2626`,borderRadius:4,marginBottom:20},children:m}),(0,x.jsx)(`div`,{style:{marginBottom:20},children:(0,x.jsx)(`button`,{onClick:()=>{a(!i),s(null),d({name:``,description:``,parent_id:void 0,is_active:!0}),l([])},style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:i?`❌ İptal`:`➕ Yeni Rol`})}),(i||o!==null)&&(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,marginBottom:20,border:`1px solid #ddd`},children:[(0,x.jsx)(`h3`,{children:o?`Rolü Düzenle`:`Yeni Rol Ekle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginBottom:12},children:[(0,x.jsx)(`input`,{type:`text`,placeholder:`Rol Adı`,value:u.name,onChange:e=>d({...u,name:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsx)(`input`,{type:`text`,placeholder:`Açıklama`,value:u.description,onChange:e=>d({...u,description:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}})]}),(0,x.jsxs)(`div`,{style:{marginBottom:12},children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:8,fontWeight:`bold`},children:`Parent Rol (Hiyerarşi):`}),(0,x.jsxs)(`select`,{value:u.parent_id||``,onChange:e=>d({...u,parent_id:e.target.value?parseInt(e.target.value):void 0}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`,width:`100%`,maxWidth:300},children:[(0,x.jsx)(`option`,{value:``,children:`Yok (Root Role)`}),e.filter(e=>e.id!==o).map(e=>(0,x.jsxs)(`option`,{value:e.id,children:[`  `.repeat(e.hierarchy_level),` `,e.name]},e.id))]})]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:8,fontWeight:`bold`},children:`İzinler:`}),(0,x.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gap:8,maxHeight:350,overflowY:`auto`,padding:12,background:`white`,border:`1px solid #ddd`,borderRadius:4},children:n.map(e=>(0,x.jsxs)(`label`,{style:{display:`flex`,alignItems:`flex-start`,gap:8,cursor:`pointer`,padding:`8px`,borderRadius:`4px`,backgroundColor:`#f0f0f0`},title:e.tooltip||e.description||``,children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:c.includes(e.id),onChange:()=>w(e.id),style:{cursor:`pointer`,width:18,height:18,marginTop:2,flexShrink:0}}),(0,x.jsxs)(`div`,{style:{flex:1,fontSize:13},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#333`},children:e.description||e.name}),e.tooltip&&(0,x.jsx)(`div`,{style:{fontSize:11,color:`#666`,marginTop:2},children:e.tooltip})]})]},e.id))})]}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:8},children:o?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:()=>y(o),style:{padding:`8px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Güncelle`}),(0,x.jsx)(`button`,{onClick:C,style:{padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:v,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Ekle`}),(0,x.jsx)(`button`,{onClick:()=>{a(!1),d({name:``,description:``,parent_id:void 0,is_active:!0}),l([])},style:{padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})})]}),(0,x.jsxs)(`div`,{style:{marginTop:32},children:[(0,x.jsx)(`h3`,{style:{marginBottom:16},children:`Rol Hiyerarşisi`}),(0,x.jsx)(`div`,{style:{marginLeft:0},children:T(null).map(t=>(0,x.jsx)(In,{role:t,allRoles:e,onEdit:S,onDelete:b},t.id))})]}),e.length===0&&(0,x.jsx)(`div`,{style:{padding:20,textAlign:`center`,color:`#999`},children:`Hiç rol yoktur. Yeni bir rol oluşturun.`})]});function T(t=null){return e.filter(e=>e.parent_id===t).sort((e,t)=>e.hierarchy_level-t.hierarchy_level)}}function In({role:e,allRoles:t,onEdit:n,onDelete:r}){let[i,a]=(0,_.useState)(!0),o=t.filter(t=>t.parent_id===e.id),s=o.length>0;return(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,padding:`12px 8px`,backgroundColor:e.is_active?`#f9fafb`:`#fee2e2`,borderLeft:`4px solid ${e.is_active?`#3b82f6`:`#dc2626`}`,marginBottom:4,borderRadius:`0 4px 4px 0`,marginLeft:`${e.hierarchy_level*20}px`},children:[s&&(0,x.jsx)(`button`,{onClick:()=>a(!i),style:{background:`none`,border:`none`,cursor:`pointer`,padding:0,width:24,fontSize:16},children:i?`▼`:`▶`}),!s&&(0,x.jsx)(`div`,{style:{width:24}}),(0,x.jsxs)(`div`,{style:{flex:1},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#333`},children:e.name}),(0,x.jsxs)(`div`,{style:{fontSize:12,color:`#666`},children:[e.description,` `,e.permissions.length>0&&`(${e.permissions.length} izin)`]})]}),(0,x.jsx)(`span`,{style:{padding:`4px 12px`,background:e.is_active?`#d1fae5`:`#fee2e2`,color:e.is_active?`#065f46`:`#991b1b`,borderRadius:`4px`,fontSize:`12px`},children:e.is_active?`Aktif`:`Pasif`}),(0,x.jsx)(`button`,{onClick:()=>n(e),style:{padding:`4px 12px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12},children:`Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>r(e.id),style:{padding:`4px 12px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12},children:`Sil`})]}),i&&o.map(e=>(0,x.jsx)(In,{role:e,allRoles:t,onEdit:n,onDelete:r},e.id))]})}function Ln(e,t){return typeof e==`object`&&e&&`response`in e&&typeof e.response?.data?.detail==`string`?e.response?.data?.detail||t:e instanceof Error?e.message:t}var Rn=h.div`
  padding: 20px;
  min-height: 400px;
  background-color: #fff;
`,zn=h.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
  }
`,Bn=h.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`,Vn=h.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`,Hn=h.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #dbe3ee;
  background: #f8fafc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,Un=h.form`
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`,q=h.div`
  display: flex;
  flex-direction: column;
`,J=h.label`
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
`,Y=h.input`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,Wn=h.textarea`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,Gn=h.div`
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;

  button {
    flex: 1;
  }
`,Kn=h.button`
  padding: 6px 12px;
  font-size: 12px;
  background-color: ${e=>e.variant===`danger`?`#ef4444`:`#10b981`};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`,qn=h.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Jn=h.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  h3 {
    margin-top: 0;
  }
`,Yn=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,Xn=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;function Zn(){let e=m(),[t,n]=(0,_.useState)([]),[r,i]=(0,_.useState)(!1),[a,o]=(0,_.useState)(null),[s,c]=(0,_.useState)(null),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)(!1),[p,h]=(0,_.useState)({company_name:``,company_title:``,tax_number:``,phone:``,email:``,website:``,address:``,city:``,postal_code:``,notes:``,category:``}),[g]=(0,_.useState)(null),[v,y]=(0,_.useState)(!1),[b,S]=(0,_.useState)(!1),[C,w]=(0,_.useState)([]),[T,E]=(0,_.useState)(!1),[D,O]=(0,_.useState)(null),[k,A]=(0,_.useState)(!1),[j,M]=(0,_.useState)({name:``,email:``,phone:``}),[N,P]=(0,_.useState)({name:``,email:``,phone:``}),[F,I]=(0,_.useState)({company_name:``,company_title:``,tax_number:``,phone:``,email:``,website:``,address:``,city:``,postal_code:``,category:``,notes:``}),L=e=>e?e.startsWith(`http`)?e:`http://127.0.0.1:8000${e}`:null,R=(0,_.useCallback)(async()=>{try{i(!0),o(null),console.log(`[SuppliersTab] Loading suppliers...`);let e=await G.get(`/suppliers`);console.log(`[SuppliersTab] Suppliers loaded:`,e.data),n(e.data)}catch(e){let t=Ln(e,`Tedarikçiler yüklenemedi`);console.error(`[SuppliersTab] Error loading suppliers:`,t,e),o(`❌ Tedarikçiler yüklenemedi: ${t}`)}finally{i(!1)}},[]);(0,_.useEffect)(()=>{console.log(`[SuppliersTab] Component mounted, loading suppliers...`),R()},[R]);let z=(0,_.useCallback)(async e=>{try{E(!0),w((await G.get(`/suppliers/${e}/users`)).data)}catch(e){console.error(`Error loading supplier users:`,e),w([])}finally{E(!1)}},[]),B=e=>{O(e),M({name:e.name,email:e.email,phone:e.phone||``}),A(!0)},V=async e=>{if(e.preventDefault(),!(!g||!D))try{f(!0),o(null),await G.put(`/suppliers/${g.id}/users/${D.id}`,{name:j.name,email:j.email,phone:j.phone}),c(`Kullanıcı başarıyla güncellendi`),A(!1),z(g.id),setTimeout(()=>c(null),3e3)}catch(e){o(Ln(e,`Güncelleme hatası`))}finally{f(!1)}},ee=async e=>{if(!g){o(`Tedarikçi seçili değil`);return}if(confirm(`Bu kullanıcıyı silmek istediğinizden emin misiniz?`))try{o(null),console.log(`[SuppliersTab] Deleting user:`,e,`from supplier:`,g.id);let t=await G.delete(`/suppliers/${g.id}/users/${e}`);console.log(`[SuppliersTab] Delete response:`,t.data),c(`Kullanıcı başarıyla silindi`),await z(g.id),setTimeout(()=>c(null),3e3)}catch(e){let t=Ln(e,`Silme hatası`);console.error(`[SuppliersTab] Delete error:`,t,e),o(`❌ Silme hatası: ${t}`)}},H=async e=>{if(g)try{o(null),await G.post(`/suppliers/${g.id}/users/${e}/set-default`),c(`Varsayılan yetkili güncellendi`),await z(g.id),setTimeout(()=>c(null),3e3)}catch(e){o(`❌ ${Ln(e,`Varsayılan yetkili güncellenemedi`)}`)}};async function te(e){e.preventDefault();try{f(!0),await G.post(`/suppliers`,p),c(`Tedarikçi başarıyla eklendi`),u(!1),h({company_name:``,company_title:``,tax_number:``,phone:``,email:``,website:``,address:``,city:``,postal_code:``,notes:``,category:``}),R(),setTimeout(()=>c(null),3e3)}catch(e){o(Ln(e,`Tedarikçi eklenemedi`))}finally{f(!1)}}async function ne(e){if(confirm(`Bu tedarikçiyi silmek istediğinizden emin misiniz?`))try{await G.delete(`/suppliers/${e}`),c(`Tedarikçi başarıyla silindi`),R(),setTimeout(()=>c(null),3e3)}catch(e){o(Ln(e,`Tedarikçi silinemedi`))}}async function U(e){if(e.preventDefault(),e.stopPropagation(),g)try{f(!0),o(null),console.log(`[SuppliersTab] Adding supplier user:`,N);let e={name:N.name,email:N.email,phone:N.phone},t=await G.post(`/suppliers/${g.id}/users`,e);console.log(`[SuppliersTab] Added supplier user:`,t.data),c(`✅ Kullanıcı eklendi. Davet emaili gönderilmeye çalışıldı. (SMTP ayarlarını kontrol edin)`),y(!1),P({name:``,email:``,phone:``}),await R(),setTimeout(()=>c(null),5e3)}catch(e){let t=Ln(e,`Kullanıcı ekleme hatası`);console.error(`[SuppliersTab] Supplier User Add Error:`,t,e),o(`❌ ${t}`)}finally{f(!1)}}async function re(e){if(e.preventDefault(),e.stopPropagation(),g)try{f(!0),o(null);let e={company_name:F.company_name,company_title:F.company_title,tax_number:F.tax_number,phone:F.phone,email:F.email,website:F.website,address:F.address,city:F.city,postal_code:F.postal_code,category:F.category,notes:F.notes};await G.put(`/suppliers/${g.id}`,e),c(`Tedarikçi başarıyla güncellendi`),S(!1),I({company_name:``,company_title:``,tax_number:``,phone:``,email:``,website:``,address:``,city:``,postal_code:``,category:``,notes:``}),R(),setTimeout(()=>c(null),3e3)}catch(e){let t=Ln(e,`Güncelleme hatası`);console.error(`Supplier Update Error:`,e),o(t)}finally{f(!1)}}return r?(0,x.jsx)(Rn,{style:{textAlign:`center`,padding:`40px`,color:`#666`},children:`⏳ Tedarikçiler yükleniyor...`}):(0,x.jsxs)(Rn,{children:[a&&(0,x.jsxs)(Xn,{children:[`❌ `,a]}),s&&(0,x.jsxs)(Yn,{children:[`✅ `,s]}),(0,x.jsxs)(zn,{children:[(0,x.jsx)(`h2`,{children:`Tedarikçiler`}),(0,x.jsx)(Bn,{onClick:()=>u(!l),children:l?`İptal`:`+ Yeni Tedarikçi`})]}),l&&(0,x.jsxs)(Un,{onSubmit:te,children:[(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Şirket Adı`}),(0,x.jsx)(Y,{type:`text`,required:!0,value:p.company_name,onChange:e=>h({...p,company_name:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Ünvanı`}),(0,x.jsx)(Y,{type:`text`,value:p.company_title,onChange:e=>h({...p,company_title:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Vergi Numarası`}),(0,x.jsx)(Y,{type:`text`,value:p.tax_number,onChange:e=>h({...p,tax_number:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Telefon *`}),(0,x.jsx)(Y,{type:`tel`,required:!0,value:p.phone,onChange:e=>h({...p,phone:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`E-mail *`}),(0,x.jsx)(Y,{type:`email`,required:!0,value:p.email,onChange:e=>h({...p,email:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Web Sitesi`}),(0,x.jsx)(Y,{type:`url`,value:p.website,onChange:e=>h({...p,website:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Adres`}),(0,x.jsx)(Wn,{rows:3,value:p.address,onChange:e=>h({...p,address:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Şehir`}),(0,x.jsx)(Y,{type:`text`,value:p.city,onChange:e=>h({...p,city:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Posta Kodu`}),(0,x.jsx)(Y,{type:`text`,value:p.postal_code,onChange:e=>h({...p,postal_code:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Kategori`}),(0,x.jsxs)(`select`,{value:p.category,onChange:e=>h({...p,category:e.target.value}),style:{padding:`8px`,border:`1px solid #d1d5db`,borderRadius:`4px`,fontSize:`14px`},children:[(0,x.jsx)(`option`,{value:``,children:`-- Seç --`}),(0,x.jsx)(`option`,{value:`Yazılım`,children:`💻 Yazılım`}),(0,x.jsx)(`option`,{value:`Donanım`,children:`🖥️ Donanım`}),(0,x.jsx)(`option`,{value:`Hizmet`,children:`🔧 Hizmet`}),(0,x.jsx)(`option`,{value:`Danışmanlık`,children:`📋 Danışmanlık`}),(0,x.jsx)(`option`,{value:`Muhasebe`,children:`📊 Muhasebe`}),(0,x.jsx)(`option`,{value:`İnsan Kaynakları`,children:`👥 İnsan Kaynakları`})]})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Notlar`}),(0,x.jsx)(Wn,{rows:3,value:p.notes,onChange:e=>h({...p,notes:e.target.value})})]}),(0,x.jsxs)(Gn,{children:[(0,x.jsx)(Bn,{type:`submit`,disabled:d,children:d?`Ekleniyor...`:`Tedarikçi Ekle`}),(0,x.jsx)(Bn,{type:`button`,onClick:()=>u(!1),style:{backgroundColor:`#6b7280`},children:`İptal`})]})]}),(0,x.jsxs)(Vn,{children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{children:`Logo`}),(0,x.jsx)(`th`,{children:`Firma Adı`}),(0,x.jsx)(`th`,{children:`E-mail`}),(0,x.jsx)(`th`,{children:`Telefon`}),(0,x.jsx)(`th`,{children:`Kategori`}),(0,x.jsx)(`th`,{children:`Şehir`}),(0,x.jsx)(`th`,{children:`Puan`}),(0,x.jsx)(`th`,{children:`Durum`}),(0,x.jsx)(`th`,{children:`İşlemler`})]})}),(0,x.jsx)(`tbody`,{children:t.map(t=>(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{children:(0,x.jsx)(Hn,{children:L(t.logo_url)?(0,x.jsx)(`img`,{src:L(t.logo_url)||``,alt:`${t.company_name} logosu`}):(0,x.jsx)(`span`,{style:{fontSize:`16px`},children:`🏢`})})}),(0,x.jsx)(`td`,{children:t.company_name}),(0,x.jsx)(`td`,{children:t.email}),(0,x.jsx)(`td`,{children:t.phone}),(0,x.jsx)(`td`,{children:t.category||`-`}),(0,x.jsx)(`td`,{children:t.city||`-`}),(0,x.jsxs)(`td`,{children:[`⭐ `,t.reference_score||`0`]}),(0,x.jsx)(`td`,{children:t.is_verified?`✅ Doğrulanmış`:`⏳ Beklemede`}),(0,x.jsxs)(`td`,{children:[(0,x.jsx)(Kn,{variant:`success`,onClick:()=>e(`/admin/suppliers/${t.id}`),children:`Tedarikçiyi Görüntüle`}),` `,(0,x.jsx)(Kn,{variant:`danger`,onClick:()=>ne(t.id),children:`Sil`})]})]},t.id))})]}),b&&g&&(0,x.jsx)(qn,{onClick:e=>{e.target===e.currentTarget&&S(!1)},children:(0,x.jsxs)(Jn,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,x.jsxs)(`h3`,{style:{margin:0},children:[`Tedarikçiyi Düzenle - `,g.company_name]}),(0,x.jsx)(`button`,{onClick:()=>S(!1),style:{background:`none`,border:`none`,fontSize:`24px`,cursor:`pointer`,color:`#6b7280`},children:`×`})]}),a&&(0,x.jsxs)(Xn,{children:[`❌ `,a]}),(0,x.jsxs)(Un,{onSubmit:re,children:[(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Şirket Adı *`}),(0,x.jsx)(Y,{type:`text`,required:!0,value:F.company_name,onChange:e=>I({...F,company_name:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Ünvanı`}),(0,x.jsx)(Y,{type:`text`,value:F.company_title,onChange:e=>I({...F,company_title:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Vergi Numarası`}),(0,x.jsx)(Y,{type:`text`,value:F.tax_number,onChange:e=>I({...F,tax_number:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Telefon`}),(0,x.jsx)(Y,{type:`tel`,value:F.phone,onChange:e=>I({...F,phone:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`E-mail`}),(0,x.jsx)(Y,{type:`email`,value:F.email,onChange:e=>I({...F,email:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Web Sitesi`}),(0,x.jsx)(Y,{type:`url`,value:F.website,onChange:e=>I({...F,website:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Adres`}),(0,x.jsx)(Wn,{rows:3,value:F.address,onChange:e=>I({...F,address:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Şehir`}),(0,x.jsx)(Y,{type:`text`,value:F.city,onChange:e=>I({...F,city:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Posta Kodu`}),(0,x.jsx)(Y,{type:`text`,value:F.postal_code,onChange:e=>I({...F,postal_code:e.target.value})})]}),(0,x.jsxs)(q,{children:[(0,x.jsx)(J,{children:`Kategori`}),(0,x.jsxs)(`select`,{value:F.category,onChange:e=>I({...F,category:e.target.value}),style:{padding:`8px`,border:`1px solid #d1d5db`,borderRadius:`4px`,fontSize:`14px`},children:[(0,x.jsx)(`option`,{value:``,children:`-- Seç --`}),(0,x.jsx)(`option`,{value:`Yazılım`,children:`💻 Yazılım`}),(0,x.jsx)(`option`,{value:`Donanım`,children:`🖥️ Donanım`}),(0,x.jsx)(`option`,{value:`Hizmet`,children:`🔧 Hizmet`}),(0,x.jsx)(`option`,{value:`Danışmanlık`,children:`📋 Danışmanlık`}),(0,x.jsx)(`option`,{value:`Muhasebe`,children:`📊 Muhasebe`}),(0,x.jsx)(`option`,{value:`İnsan Kaynakları`,children:`👥 İnsan Kaynakları`})]})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Notlar`}),(0,x.jsx)(Wn,{rows:3,value:F.notes,onChange:e=>I({...F,notes:e.target.value})})]}),(0,x.jsxs)(Gn,{children:[(0,x.jsx)(Bn,{type:`submit`,disabled:d,children:d?`Kaydediliyor...`:`Değişiklikleri Kaydet`}),(0,x.jsx)(Bn,{type:`button`,onClick:()=>S(!1),style:{backgroundColor:`#6b7280`},children:`İptal`})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:`30px`,paddingTop:`20px`,borderTop:`1px solid #ddd`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`15px`},children:[(0,x.jsxs)(`h4`,{style:{margin:0},children:[`Firma Kullanıcıları (`,C.length,`)`]}),(0,x.jsx)(Bn,{onClick:()=>y(!0),style:{padding:`6px 12px`,fontSize:`12px`},children:`+ Kullanıcı Ekle`})]}),T?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`20px`,color:`#666`},children:`Yükleniyor...`}):C.length===0?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`20px`,color:`#999`},children:`Kullanıcı bulunamadı`}):(0,x.jsxs)(Vn,{children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`left`},children:`Ad`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`left`},children:`Email`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`left`},children:`Telefon`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`center`},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:C.map(e=>(0,x.jsxs)(`tr`,{children:[(0,x.jsxs)(`td`,{style:{padding:`10px`},children:[e.name,` `,e.is_default?`⭐`:``]}),(0,x.jsxs)(`td`,{style:{padding:`10px`},children:[e.email,e.email_verified?` ✅`:` ⏳`]}),(0,x.jsx)(`td`,{style:{padding:`10px`},children:e.phone||`-`}),(0,x.jsxs)(`td`,{style:{padding:`10px`,textAlign:`center`},children:[!e.is_default&&(0,x.jsx)(Kn,{variant:`success`,onClick:()=>H(e.id),style:{marginRight:`5px`,backgroundColor:`#f59e0b`},children:`Varsayılan Yap`}),(0,x.jsx)(Kn,{variant:`success`,onClick:()=>B(e),style:{marginRight:`5px`},disabled:!!e.is_default,children:`Düzenle`}),(0,x.jsx)(Kn,{variant:`danger`,onClick:()=>ee(e.id),disabled:!!e.is_default,children:`Sil`})]})]},e.id))})]})]})]})}),v&&g&&(0,x.jsx)(qn,{onClick:e=>{e.target===e.currentTarget&&y(!1)},children:(0,x.jsxs)(Jn,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,x.jsxs)(`h3`,{style:{margin:0},children:[`Kullanıcı Ekle - `,g.company_name]}),(0,x.jsx)(`button`,{onClick:()=>y(!1),style:{background:`none`,border:`none`,fontSize:`24px`,cursor:`pointer`,color:`#6b7280`},children:`×`})]}),a&&(0,x.jsxs)(Xn,{children:[`❌ `,a]}),(0,x.jsx)(`p`,{style:{color:`#6b7280`,fontSize:`14px`,marginBottom:`20px`},children:`Magic link (sihirli bağlantı) kendisinin email adresine gönderilecektir.`}),(0,x.jsxs)(Un,{onSubmit:U,children:[(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Adı *`}),(0,x.jsx)(Y,{type:`text`,required:!0,value:N.name,onChange:e=>P({...N,name:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`E-mail *`}),(0,x.jsx)(Y,{type:`email`,required:!0,value:N.email,onChange:e=>P({...N,email:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Telefon`}),(0,x.jsx)(Y,{type:`tel`,value:N.phone,onChange:e=>P({...N,phone:e.target.value})})]}),(0,x.jsxs)(Gn,{children:[(0,x.jsx)(Bn,{type:`submit`,disabled:d,children:d?`⏳ Gönderiliyor...`:`✅ Email'i Gönder`}),(0,x.jsx)(Bn,{type:`button`,onClick:()=>y(!1),style:{backgroundColor:`#6b7280`},children:`❌ İptal`})]})]})]})}),k&&g&&D&&(0,x.jsx)(qn,{onClick:e=>{e.target===e.currentTarget&&A(!1)},children:(0,x.jsxs)(Jn,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,x.jsxs)(`h3`,{style:{margin:0},children:[`Kullanıcıyı Düzenle - `,D.name]}),(0,x.jsx)(`button`,{onClick:()=>A(!1),style:{background:`none`,border:`none`,fontSize:`24px`,cursor:`pointer`,color:`#6b7280`},children:`×`})]}),a&&(0,x.jsxs)(Xn,{children:[`❌ `,a]}),(0,x.jsxs)(Un,{onSubmit:V,children:[(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Ad *`}),(0,x.jsx)(Y,{type:`text`,required:!0,value:j.name,onChange:e=>M({...j,name:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Email *`}),(0,x.jsx)(Y,{type:`email`,required:!0,value:j.email,onChange:e=>M({...j,email:e.target.value})})]}),(0,x.jsxs)(q,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(J,{children:`Telefon`}),(0,x.jsx)(Y,{type:`tel`,value:j.phone,onChange:e=>M({...j,phone:e.target.value})})]}),(0,x.jsxs)(Gn,{children:[(0,x.jsx)(Bn,{type:`submit`,disabled:d,children:d?`Kaydediliyor...`:`Değişiklikleri Kaydet`}),(0,x.jsx)(Bn,{type:`button`,onClick:()=>A(!1),style:{backgroundColor:`#6b7280`},children:`İptal`})]})]})]})})]})}var Qn=(0,_.createContext)({settings:null,loading:!1,error:null,updateSettings:async()=>{},refreshSettings:async()=>{}});function $n(){let e=(0,_.useContext)(Qn);if(!e)throw Error(`useSettings must be used within a SettingsProvider`);return e}async function er(){return(await G.get(`/advanced-settings/email`)).data}async function tr(e){return(await G.put(`/advanced-settings/email`,e)).data}async function nr(e){return(await G.post(`/advanced-settings/email/test`,{to_email:e})).data}async function rr(){return(await G.get(`/advanced-settings/logging`)).data}async function ir(e){return(await G.put(`/advanced-settings/logging`,e)).data}async function ar(){return(await G.get(`/advanced-settings/backup`)).data}async function or(e){return(await G.put(`/advanced-settings/backup`,e)).data}async function sr(){return(await G.post(`/advanced-settings/backup/trigger`)).data}async function cr(){return(await G.get(`/advanced-settings/notifications`)).data}async function lr(e){return(await G.put(`/advanced-settings/notifications`,e)).data}async function ur(){return(await G.get(`/advanced-settings/api-keys`)).data}async function dr(e){return(await G.post(`/advanced-settings/api-keys`,{name:e})).data}async function fr(e){return(await G.delete(`/advanced-settings/api-keys/${e}`)).data}var pr=()=>{let[e,t]=(0,_.useState)(`email`),[n,r]=(0,_.useState)(!1),[i,a]=(0,_.useState)(null),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)({}),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)({}),[m,h]=(0,_.useState)(null),[g,v]=(0,_.useState)({}),[y,b]=(0,_.useState)(null),[S,C]=(0,_.useState)({}),[w,T]=(0,_.useState)([]),[E,D]=(0,_.useState)(``);(0,_.useEffect)(()=>{O()},[]);let O=async()=>{try{let e=U();console.log(`[AdvancedSettingsTab] 🔍 Token kontrol:`,e?`✅ ${e.substring(0,30)}...`:`❌ Token yok!`),r(!0),console.log(`[AdvancedSettingsTab] 🔄 Ayarlar yükleniyor...`);let[t,n,i,a,o]=await Promise.all([er(),rr(),ar(),cr(),ur()]);s(t),l(t),d(n),p(n),h(i),v(i),b(a),C(a),T(o)}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Ayarlar yükleme hatası`})}finally{r(!1)}},k=async()=>{try{r(!0),s(await tr(c)),a({type:`success`,text:`Email ayarları kaydedildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Kaydetme hatası`})}finally{r(!1)}},A=async()=>{if(!c.from_email){a({type:`error`,text:`Test emaili gönderebilmek için from_email adresi gerekli`});return}try{r(!0),await nr(c.from_email),a({type:`success`,text:`Test e-maili gönderildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Test e-maili gönderilemedi`})}finally{r(!1)}},j=async()=>{try{r(!0),d(await ir(f)),a({type:`success`,text:`Logging ayarları kaydedildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Kaydetme hatası`})}finally{r(!1)}},M=async()=>{try{r(!0),h(await or(g)),a({type:`success`,text:`Yedekleme ayarları kaydedildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Kaydetme hatası`})}finally{r(!1)}},N=async()=>{try{r(!0),await sr(),a({type:`success`,text:`Yedekleme başlatıldı`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Yedekleme başlatılamadı`})}finally{r(!1)}},P=async()=>{try{r(!0),b(await lr(S)),a({type:`success`,text:`Bildirim ayarları kaydedildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`Kaydetme hatası`})}finally{r(!1)}},F=async()=>{if(!E.trim()){a({type:`error`,text:`API anahtarı adı gerekli`});return}try{r(!0);let e=await dr(E);T([...w,e]),D(``),a({type:`success`,text:`API anahtarı oluşturuldu`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`API anahtarı oluşturulamadı`})}finally{r(!1)}},I=async e=>{if(confirm(`API anahtarını iptal etmek istediğinize emin misiniz?`))try{r(!0),await fr(e),T(w.filter(t=>t.id!==e)),a({type:`success`,text:`API anahtarı iptal edildi`})}catch(e){a({type:`error`,text:e instanceof Error?e.message:`İptal işlemi başarısız`})}finally{r(!1)}},L=t=>({padding:`8px 16px`,border:`none`,background:e===t?`#3b82f6`:`transparent`,color:e===t?`white`:`#666`,cursor:`pointer`,fontWeight:e===t?`bold`:`normal`,borderRadius:4});return(0,x.jsxs)(`div`,{style:{display:`grid`,gap:20},children:[i&&(0,x.jsxs)(`div`,{style:{padding:12,marginBottom:20,borderRadius:8,backgroundColor:i.type===`success`?`#d1fae5`:`#fee2e2`,color:i.type===`success`?`#065f46`:`#991b1b`,border:`1px solid ${i.type===`success`?`#6ee7b7`:`#fca5a5`}`},children:[i.type===`success`?`✅`:`❌`,` `,i.text]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:20,overflowX:`auto`,paddingBottom:8},children:[(0,x.jsx)(`button`,{style:L(`email`),onClick:()=>t(`email`),children:`📧 Email`}),(0,x.jsx)(`button`,{style:L(`logging`),onClick:()=>t(`logging`),children:`📊 Logging`}),(0,x.jsx)(`button`,{style:L(`backup`),onClick:()=>t(`backup`),children:`💾 Yedekleme`}),(0,x.jsx)(`button`,{style:L(`notifications`),onClick:()=>t(`notifications`),children:`🔔 Bildirimler`}),(0,x.jsx)(`button`,{style:L(`api-keys`),onClick:()=>t(`api-keys`),children:`🔑 API Anahtarları`})]}),e===`email`&&o&&(0,x.jsxs)(`div`,{style:{backgroundColor:`#fff`,padding:20,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h3`,{children:`📧 Email / SMTP Ayarları`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginTop:16},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`SMTP Host`}),(0,x.jsx)(`input`,{type:`text`,value:c.smtp_host||``,onChange:e=>l({...c,smtp_host:e.target.value}),placeholder:`smtp.gmail.com`,style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`SMTP Port`}),(0,x.jsx)(`input`,{type:`number`,value:c.smtp_port||587,onChange:e=>l({...c,smtp_port:parseInt(e.target.value)}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`SMTP Username`}),(0,x.jsx)(`input`,{type:`text`,value:c.smtp_username||``,onChange:e=>l({...c,smtp_username:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`SMTP Password`}),(0,x.jsx)(`input`,{type:`password`,value:c.smtp_password||``,onChange:e=>l({...c,smtp_password:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`From Email`}),(0,x.jsx)(`input`,{type:`email`,value:c.from_email||``,onChange:e=>l({...c,from_email:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`From Name`}),(0,x.jsx)(`input`,{type:`text`,value:c.from_name||``,onChange:e=>l({...c,from_name:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:12,marginTop:12},children:[(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:c.use_tls||!1,onChange:e=>l({...c,use_tls:e.target.checked})}),`TLS Kullan`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:c.use_ssl||!1,onChange:e=>l({...c,use_ssl:e.target.checked})}),`SSL Kullan`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:c.enable_email_notifications||!1,onChange:e=>l({...c,enable_email_notifications:e.target.checked})}),`Email Bildirimlerini Etkinleştir`]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:16},children:[(0,x.jsx)(`button`,{onClick:k,disabled:n,style:{padding:`8px 16px`,backgroundColor:`#3b82f6`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Kaydediliyor...`:`Kaydet`}),(0,x.jsx)(`button`,{onClick:A,disabled:n,style:{padding:`8px 16px`,backgroundColor:`#8b5cf6`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Test Gönderiliyor...`:`Test Gönder`})]})]}),e===`logging`&&u&&(0,x.jsxs)(`div`,{style:{backgroundColor:`#fff`,padding:20,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h3`,{children:`📊 Logging Ayarları`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginTop:16},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Log Seviyesi`}),(0,x.jsxs)(`select`,{value:f.log_level||`INFO`,onChange:e=>p({...f,log_level:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4},children:[(0,x.jsx)(`option`,{children:`DEBUG`}),(0,x.jsx)(`option`,{children:`INFO`}),(0,x.jsx)(`option`,{children:`WARNING`}),(0,x.jsx)(`option`,{children:`ERROR`}),(0,x.jsx)(`option`,{children:`CRITICAL`})]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Log Saklama Günü`}),(0,x.jsx)(`input`,{type:`number`,value:f.log_retention_days||30,onChange:e=>p({...f,log_retention_days:parseInt(e.target.value)}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,marginTop:12},children:[(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:f.enable_file_logging||!1,onChange:e=>p({...f,enable_file_logging:e.target.checked})}),`Dosya Logging'i Etkinleştir`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:f.enable_database_logging||!1,onChange:e=>p({...f,enable_database_logging:e.target.checked})}),`Veritabanı Logging'i Etkinleştir`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:f.log_api_requests||!1,onChange:e=>p({...f,log_api_requests:e.target.checked})}),`API İstekleri Logla`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:f.log_user_actions||!1,onChange:e=>p({...f,log_user_actions:e.target.checked})}),`Kullanıcı İşlemlerini Logla`]})]}),(0,x.jsx)(`button`,{onClick:j,disabled:n,style:{marginTop:16,padding:`8px 16px`,backgroundColor:`#3b82f6`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Kaydediliyor...`:`Kaydet`})]}),e===`backup`&&m&&(0,x.jsxs)(`div`,{style:{backgroundColor:`#fff`,padding:20,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h3`,{children:`💾 Yedekleme Ayarları`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginTop:16},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Yedekleme Sıklığı`}),(0,x.jsxs)(`select`,{value:g.backup_frequency||`daily`,onChange:e=>v({...g,backup_frequency:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4},children:[(0,x.jsx)(`option`,{value:`hourly`,children:`Saatlik`}),(0,x.jsx)(`option`,{value:`every_2_hours`,children:`2 Saatte Bir`}),(0,x.jsx)(`option`,{value:`daily`,children:`Günlük`}),(0,x.jsx)(`option`,{value:`weekly`,children:`Haftalık`}),(0,x.jsx)(`option`,{value:`monthly`,children:`Aylık`})]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Yedekleme Saati`}),(0,x.jsx)(`input`,{type:`time`,value:g.backup_time||`02:00`,onChange:e=>v({...g,backup_time:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Yedekleme Konumu`}),(0,x.jsx)(`input`,{type:`text`,value:g.backup_location||``,onChange:e=>v({...g,backup_location:e.target.value}),placeholder:`/backups`,style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Son N Yedeklemeyi Sakla`}),(0,x.jsx)(`input`,{type:`number`,value:g.keep_last_n_backups||5,onChange:e=>v({...g,keep_last_n_backups:parseInt(e.target.value)}),style:{width:`100%`,padding:8,border:`1px solid #ddd`,borderRadius:4}})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,marginTop:12},children:[(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:g.enable_automatic_backup||!1,onChange:e=>v({...g,enable_automatic_backup:e.target.checked})}),`Otomatik Yedeklemeyi Etkinleştir`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:g.compress_backups||!1,onChange:e=>v({...g,compress_backups:e.target.checked})}),`Yedeklemeleri Sıkıştır`]}),(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:g.encrypt_backups||!1,onChange:e=>v({...g,encrypt_backups:e.target.checked})}),`Yedeklemeleri Şifrele`]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:16},children:[(0,x.jsx)(`button`,{onClick:M,disabled:n,style:{padding:`8px 16px`,backgroundColor:`#3b82f6`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Kaydediliyor...`:`Kaydet`}),(0,x.jsx)(`button`,{onClick:N,disabled:n,style:{padding:`8px 16px`,backgroundColor:`#10b981`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Başlatılıyor...`:`Şimdi Yedekle`})]})]}),e===`notifications`&&y&&(0,x.jsxs)(`div`,{style:{backgroundColor:`#fff`,padding:20,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h3`,{children:`🔔 Bildirim Ayarları`}),(0,x.jsxs)(`div`,{style:{marginTop:16},children:[(0,x.jsx)(`h4`,{children:`Teklif Bildirimleri`}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:8},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:S.notify_on_quote_created||!1,onChange:e=>C({...S,notify_on_quote_created:e.target.checked})}),`Teklif Oluşturulduğunda Bildir`]}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:8},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:S.notify_on_quote_response||!1,onChange:e=>C({...S,notify_on_quote_response:e.target.checked})}),`Teklif Yanıtı Alındığında Bildir`]}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:8},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:S.notify_on_quote_approved||!1,onChange:e=>C({...S,notify_on_quote_approved:e.target.checked})}),`Teklif Onaylandığında Bildir`]})]}),(0,x.jsxs)(`div`,{style:{marginTop:16},children:[(0,x.jsx)(`h4`,{children:`Sistem Bildirimleri`}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:8},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:S.notify_on_system_errors||!1,onChange:e=>C({...S,notify_on_system_errors:e.target.checked})}),`Sistem Hataları Hakkında Bildir`]}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:8},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:S.enable_daily_digest||!1,onChange:e=>C({...S,enable_daily_digest:e.target.checked})}),`Günlük Özet Etkinleştir`]})]}),(0,x.jsx)(`div`,{style:{marginTop:16,display:`flex`,gap:12},children:(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:{display:`block`,marginBottom:4,fontWeight:`600`},children:`Özet Saati`}),(0,x.jsx)(`input`,{type:`time`,value:S.digest_time||`09:00`,onChange:e=>C({...S,digest_time:e.target.value}),style:{padding:8,border:`1px solid #ddd`,borderRadius:4}})]})}),(0,x.jsx)(`button`,{onClick:P,disabled:n,style:{marginTop:16,padding:`8px 16px`,backgroundColor:`#3b82f6`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Kaydediliyor...`:`Kaydet`})]}),e===`api-keys`&&(0,x.jsxs)(`div`,{style:{backgroundColor:`#fff`,padding:20,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h3`,{children:`🔑 API Anahtarları`}),(0,x.jsxs)(`div`,{style:{marginTop:16},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:16},children:[(0,x.jsx)(`input`,{type:`text`,value:E,onChange:e=>D(e.target.value),placeholder:`API anahtarı adını girin`,style:{flex:1,padding:8,border:`1px solid #ddd`,borderRadius:4}}),(0,x.jsx)(`button`,{onClick:F,disabled:n,style:{padding:`8px 16px`,backgroundColor:`#10b981`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,opacity:n?.6:1},children:n?`Oluşturuluyor...`:`Yeni Anahtar`})]}),w.length>0?(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{textAlign:`left`,padding:8},children:`Ad`}),(0,x.jsx)(`th`,{style:{textAlign:`left`,padding:8},children:`Anahtar`}),(0,x.jsx)(`th`,{style:{textAlign:`left`,padding:8},children:`Durum`}),(0,x.jsx)(`th`,{style:{textAlign:`left`,padding:8},children:`Son Kullanıldı`}),(0,x.jsx)(`th`,{style:{textAlign:`center`,padding:8},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:w.map(e=>(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #ddd`},children:[(0,x.jsx)(`td`,{style:{padding:8},children:e.name}),(0,x.jsxs)(`td`,{style:{padding:8,fontFamily:`monospace`,fontSize:12},children:[e.key.substring(0,10),`...`]}),(0,x.jsx)(`td`,{style:{padding:8},children:e.is_active?`✅ Aktif`:`❌ Pasif`}),(0,x.jsx)(`td`,{style:{padding:8,fontSize:12},children:e.last_used_at?new Date(e.last_used_at).toLocaleDateString(`tr-TR`):`—`}),(0,x.jsx)(`td`,{style:{padding:8,textAlign:`center`},children:(0,x.jsx)(`button`,{onClick:()=>I(e.id),disabled:n,style:{padding:`4px 8px`,backgroundColor:`#ef4444`,color:`white`,border:`none`,borderRadius:4,cursor:`pointer`,fontSize:12,opacity:n?.6:1},children:`İptal Et`})})]},e.id))})]}):(0,x.jsx)(`p`,{style:{color:`#666`},children:`Henüz API anahtarı oluşturulmadı`})]})]})]})};function mr(e){return typeof e==`object`&&e&&`response`in e&&typeof e.response?.data?.detail==`string`&&e.response?.data?.detail||`Demo veri yükleme hatası`}var hr=()=>{let[e,t]=(0,_.useState)(!1),[n,r]=(0,_.useState)(null),[i,a]=(0,_.useState)(!1);return(0,x.jsxs)(`div`,{className:`space-y-6`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{className:`text-2xl font-bold text-gray-900`,children:`Demo Verileri Yönet`}),(0,x.jsx)(`p`,{className:`mt-1 text-sm text-gray-600`,children:`Sistem test verileriyle doldurulabilir. Yeni veriler eklenirse buraya eklenir.`})]}),n&&(0,x.jsxs)(`div`,{className:`p-4 rounded-lg border ${n.type===`success`?`bg-green-50 border-green-200 text-green-700`:`bg-red-50 border-red-200 text-red-700`}`,children:[n.type===`success`?`✅`:`❌`,` `,n.text]}),(0,x.jsxs)(`div`,{className:`bg-white rounded-lg shadow p-6 space-y-6`,children:[(0,x.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:[(0,x.jsxs)(`div`,{className:`bg-blue-50 border border-blue-200 rounded-lg p-4`,children:[(0,x.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{className:`font-semibold text-blue-900`,children:`👤 Personel`}),(0,x.jsxs)(`p`,{className:`text-sm text-blue-700 mt-1`,children:[`5 satın alma personeli`,(0,x.jsx)(`br`,{}),`(Uzman, Yönetici, Müdür, Direktör)`]})]}),(0,x.jsx)(`span`,{className:`text-3xl`,children:`5`})]}),(0,x.jsx)(`p`,{className:`text-xs text-blue-600 mt-3`,children:`🔐 Şifre: Test123!`})]}),(0,x.jsx)(`div`,{className:`bg-purple-50 border border-purple-200 rounded-lg p-4`,children:(0,x.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{className:`font-semibold text-purple-900`,children:`🏢 Departmanlar`}),(0,x.jsxs)(`p`,{className:`text-sm text-purple-700 mt-1`,children:[`5 departman`,(0,x.jsx)(`br`,{}),`(Personel rolleriyle eşleştirilmiş)`]})]}),(0,x.jsx)(`span`,{className:`text-3xl`,children:`5`})]})}),(0,x.jsx)(`div`,{className:`bg-yellow-50 border border-yellow-200 rounded-lg p-4`,children:(0,x.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{className:`font-semibold text-yellow-900`,children:`🏭 Firmalar`}),(0,x.jsxs)(`p`,{className:`text-sm text-yellow-700 mt-1`,children:[`5 firma ile renkli kodlar`,(0,x.jsx)(`br`,{}),`(Mor, Mavi, Sarı, Yeşil, Kırmızı)`]})]}),(0,x.jsx)(`span`,{className:`text-3xl`,children:`5`})]})}),(0,x.jsx)(`div`,{className:`bg-green-50 border border-green-200 rounded-lg p-4`,children:(0,x.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{className:`font-semibold text-green-900`,children:`📊 Projeler`}),(0,x.jsxs)(`p`,{className:`text-sm text-green-700 mt-1`,children:[`25 proje (5 per firma)`,(0,x.jsx)(`br`,{}),`@ 5.500.000 TL bütçe`]})]}),(0,x.jsx)(`span`,{className:`text-3xl`,children:`25`})]})})]}),(0,x.jsxs)(`div`,{className:`bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2`,children:[(0,x.jsxs)(`p`,{children:[`✅ `,(0,x.jsx)(`strong`,{children:`Tedarikçiler:`}),` 6 örnek tedarikçi (kategorileriyle)`]}),(0,x.jsxs)(`p`,{children:[`✅ `,(0,x.jsx)(`strong`,{children:`SMTP Ayarları:`}),` olimposyapi.com:465 (SSL)`]}),(0,x.jsxs)(`p`,{children:[`✅ `,(0,x.jsx)(`strong`,{children:`Proje Sorumlusu E-mail:`}),` serkaneryilmazz@gmail.com`]})]}),i?(0,x.jsxs)(`div`,{className:`border-t pt-4 bg-red-50 p-4 rounded-lg space-y-3`,children:[(0,x.jsx)(`p`,{className:`font-semibold text-red-700`,children:`⚠️ Onay Gereklidir`}),(0,x.jsx)(`p`,{className:`text-sm text-gray-700`,children:`Demo verilerini yükleyeceksiniz. Bu işlem hızlı ve güvenlidir. Zaten mevcut olan kayıtlar yeniden oluşturulmayacaktır.`}),(0,x.jsxs)(`div`,{className:`flex gap-3`,children:[(0,x.jsx)(`button`,{onClick:async()=>{try{t(!0),r(null),r({type:`success`,text:(await G.post(`/admin/load-demo-data`,{})).data.message||`Demo verileri başarıyla yüklendi`}),a(!1)}catch(e){r({type:`error`,text:mr(e)})}finally{t(!1)}},disabled:e,className:`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium`,children:e?`⏳ Yükleniyor...`:`✅ Evet, Yükle`}),(0,x.jsx)(`button`,{onClick:()=>a(!1),disabled:e,className:`px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-medium`,children:`❌ İptal`})]})]}):(0,x.jsxs)(`div`,{className:`border-t pt-4`,children:[(0,x.jsx)(`button`,{onClick:()=>a(!0),disabled:e,className:`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium`,children:e?`Yükleniyor...`:`📥 Demo Verileri Yükle`}),(0,x.jsx)(`p`,{className:`mt-2 text-xs text-gray-600`,children:`Bu işlem mevcut verileri etkilemeyecektir. Zaten mevcut kayıtlar atlanacaktır.`})]})]}),(0,x.jsxs)(`div`,{className:`bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm`,children:[(0,x.jsx)(`p`,{className:`font-semibold text-amber-900`,children:`💡 Nasıl Kullanılır?`}),(0,x.jsxs)(`ul`,{className:`mt-2 text-amber-800 space-y-1 list-disc list-inside`,children:[(0,x.jsxs)(`li`,{children:[`Yeni demo veri eklemek istediğinizde: `,(0,x.jsx)(`code`,{className:`bg-amber-100 px-1 rounded`,children:`create_projects_only.py`}),` gibi scripte ekleyin`]}),(0,x.jsx)(`li`,{children:`Scripti yazın ve buraya ekleyin`}),(0,x.jsxs)(`li`,{children:[`Backend endpointi `,(0,x.jsx)(`code`,{className:`bg-amber-100 px-1 rounded`,children:`/admin/load-demo-data`}),`'ya entegre edin`]}),(0,x.jsx)(`li`,{children:`Hesap ve şifreler: test@example.com / Test1234!`})]})]})]})},gr=()=>{let{settings:e,loading:t,error:n,updateSettings:r}=$n(),[i,a]=(0,_.useState)(`basic`),[o,s]=(0,_.useState)({app_name:``,maintenance_mode:!1,vat_rates:[1,10,20]}),[c,l]=(0,_.useState)(``),[u,d]=(0,_.useState)(!1),[f,p]=(0,_.useState)(null),[m,h]=(0,_.useState)(null),[g,v]=(0,_.useState)(!1),[y,b]=(0,_.useState)(null),[S,C]=(0,_.useState)(!1);(0,_.useEffect)(()=>{e&&s({app_name:e.app_name||``,maintenance_mode:e.maintenance_mode||!1,vat_rates:e.vat_rates&&e.vat_rates.length>0?e.vat_rates:[1,10,20]})},[e]),(0,_.useEffect)(()=>{i===`price_rules`&&!m&&!g&&(v(!0),Sn().then(e=>h(e)).catch(()=>b({type:`error`,text:`Fiyat kuralları yüklenemedi`})).finally(()=>v(!1)))},[i,m,g]);let w=e=>{let{name:t,value:n,type:r,checked:i}=e.target;s(e=>({...e,[t]:r===`checkbox`?i:n}))},T=async e=>{if(e.preventDefault(),!o.app_name.trim()){p({type:`error`,text:`Uygulama adı boş olamaz`});return}try{d(!0),p(null),await r({app_name:o.app_name,maintenance_mode:o.maintenance_mode,vat_rates:o.vat_rates}),p({type:`success`,text:`Ayarlar başarıyla kaydedildi`})}catch(e){p({type:`error`,text:e instanceof Error?e.message:`Kaydetme hatası`})}finally{d(!1)}},E=async e=>{if(e.preventDefault(),m)try{C(!0),b(null),h(await Cn({max_markup_percent:m.max_markup_percent,max_discount_percent:m.max_discount_percent,tolerance_amount:m.tolerance_amount,block_on_violation:m.block_on_violation})),b({type:`success`,text:`Fiyat kuralları kaydedildi`})}catch{b({type:`error`,text:`Fiyat kuralları kaydedilemedi`})}finally{C(!1)}};return t&&!e?(0,x.jsxs)(`div`,{className:`flex items-center justify-center p-8`,children:[(0,x.jsx)(`div`,{className:`animate-spin`,children:`⏳`}),(0,x.jsx)(`span`,{className:`ml-2`,children:`Ayarlar yükleniyor...`})]}):n&&!e?(0,x.jsxs)(`div`,{className:`p-4 bg-red-50 border border-red-200 rounded-lg text-red-700`,children:[(0,x.jsx)(`strong`,{children:`Hata:`}),` `,n]}):(0,x.jsxs)(`div`,{className:`space-y-6`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{className:`text-2xl font-bold text-gray-900`,children:`Sistem Ayarları`}),(0,x.jsx)(`p`,{className:`mt-1 text-sm text-gray-600`,children:`Uygulamanın ayarlarını yönetin`})]}),(0,x.jsxs)(`div`,{className:`flex gap-3 border-b-2 border-gray-200 pb-3 overflow-x-auto`,children:[(0,x.jsx)(`button`,{onClick:()=>a(`basic`),className:`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${i===`basic`?`bg-blue-600 text-white`:`bg-transparent text-gray-600 hover:text-gray-900`}`,children:`⚙️ Temel Ayarlar`}),(0,x.jsx)(`button`,{onClick:()=>a(`advanced`),className:`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${i===`advanced`?`bg-blue-600 text-white`:`bg-transparent text-gray-600 hover:text-gray-900`}`,children:`🔧 Gelişmiş Ayarlar`}),(0,x.jsx)(`button`,{onClick:()=>a(`demo`),className:`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${i===`demo`?`bg-green-600 text-white`:`bg-transparent text-gray-600 hover:text-gray-900`}`,children:`📥 Demo Verileri`}),(0,x.jsx)(`button`,{onClick:()=>a(`price_rules`),className:`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${i===`price_rules`?`bg-blue-600 text-white`:`bg-transparent text-gray-600 hover:text-gray-900`}`,children:`💰 Teklif Fiyat Kuralları`})]}),i===`basic`&&(0,x.jsxs)(x.Fragment,{children:[f&&(0,x.jsxs)(`div`,{className:`p-4 rounded-lg border ${f.type===`success`?`bg-green-50 border-green-200 text-green-700`:`bg-red-50 border-red-200 text-red-700`}`,children:[f.type===`success`?`✅`:`❌`,` `,f.text]}),(0,x.jsxs)(`form`,{onSubmit:T,className:`bg-white rounded-lg shadow p-6 space-y-6`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{htmlFor:`app_name`,className:`block text-sm font-medium text-gray-700`,children:`Uygulama Adı`}),(0,x.jsx)(`input`,{type:`text`,name:`app_name`,id:`app_name`,value:o.app_name,onChange:w,disabled:u,className:`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100`,placeholder:`ProcureFlow`}),(0,x.jsx)(`p`,{className:`mt-1 text-sm text-gray-500`,children:`Uygulamanın adı (örn: ProcureFlow, ProcureFlow Pro)`})]}),(0,x.jsxs)(`div`,{className:`border-t pt-6`,children:[(0,x.jsxs)(`div`,{className:`flex items-center`,children:[(0,x.jsx)(`input`,{type:`checkbox`,name:`maintenance_mode`,id:`maintenance_mode`,checked:o.maintenance_mode,onChange:w,disabled:u,className:`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:opacity-60`}),(0,x.jsx)(`label`,{htmlFor:`maintenance_mode`,className:`ml-2 block text-sm font-medium text-gray-700 cursor-pointer`,children:`Maintenance Modu`})]}),(0,x.jsx)(`p`,{className:`mt-2 text-sm text-gray-600`,children:o.maintenance_mode?(0,x.jsx)(`span`,{className:`text-orange-600`,children:`⚠️ Maintenance modu aktif. Sadece admin kullanıcılar sisteme erişebilir.`}):(0,x.jsx)(`span`,{children:`Maintenance modu kapalı. Tüm kullanıcılar sisteme erişebilir.`})})]}),e&&(0,x.jsx)(`div`,{className:`bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800`,children:(0,x.jsxs)(`ul`,{className:`space-y-1`,children:[(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`strong`,{children:`Son Güncelleme:`}),` `,e.updated_at?new Date(e.updated_at).toLocaleString(`tr-TR`):`—`]}),e.updated_by_id&&(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`strong`,{children:`Güncelleyen:`}),` Kullanıcı #`,e.updated_by_id]})]})}),(0,x.jsxs)(`div`,{className:`border-t pt-6`,children:[(0,x.jsx)(`div`,{className:`block text-sm font-medium text-gray-700 mb-2`,children:`KDV Oranları`}),(0,x.jsx)(`div`,{className:`flex flex-wrap gap-2 mb-3`,children:o.vat_rates.map(e=>(0,x.jsxs)(`div`,{className:`inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm`,children:[(0,x.jsxs)(`span`,{children:[`%`,e]}),(0,x.jsx)(`button`,{type:`button`,onClick:()=>s(t=>({...t,vat_rates:t.vat_rates.filter(t=>t!==e)})),className:`text-red-600 font-bold`,disabled:o.vat_rates.length<=1,title:`KDV oranını sil`,children:`×`})]},e))}),(0,x.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(`input`,{type:`number`,min:0,step:.01,value:c,onChange:e=>l(e.target.value),className:`px-3 py-2 border border-gray-300 rounded-md w-40`,placeholder:`Örn: 8`}),(0,x.jsx)(`button`,{type:`button`,onClick:()=>{let e=Number(c);!Number.isFinite(e)||e<0||(s(t=>t.vat_rates.includes(e)?t:{...t,vat_rates:[...t.vat_rates,e].sort((e,t)=>e-t)}),l(``))},className:`px-3 py-2 bg-blue-600 text-white rounded-md`,children:`KDV Ekle`})]}),(0,x.jsx)(`p`,{className:`mt-1 text-sm text-gray-500`,children:`Teklif kalemlerinde kullanılacak KDV oranlarını buradan yönetebilirsiniz.`})]}),(0,x.jsxs)(`div`,{className:`flex gap-3 pt-4 border-t`,children:[(0,x.jsx)(`button`,{type:`submit`,disabled:u||t,className:`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium`,children:u?`Kaydediliyor...`:`Değişiklikleri Kaydet`}),(0,x.jsx)(`button`,{type:`button`,disabled:u||t,onClick:()=>{e&&s({app_name:e.app_name,maintenance_mode:e.maintenance_mode,vat_rates:e.vat_rates&&e.vat_rates.length>0?e.vat_rates:[1,10,20]})},className:`px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium`,children:`Sıfırla`})]})]})]}),i===`advanced`&&(0,x.jsx)(pr,{}),i===`demo`&&(0,x.jsx)(hr,{}),i===`price_rules`&&(0,x.jsxs)(`div`,{className:`space-y-4`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{className:`text-lg font-semibold text-gray-900`,children:`Teklif Fiyat Kontrol Kuralları`}),(0,x.jsx)(`p`,{className:`text-sm text-gray-600 mt-1`,children:`Tedarikçilerin teklif fiyatları için geçerli olan kural eşiklerini tanımlayın. Baz fiyat olarak projedeki birim fiyat kullanılır.`})]}),y&&(0,x.jsxs)(`div`,{className:`p-3 rounded-lg border text-sm ${y.type===`success`?`bg-green-50 border-green-200 text-green-700`:`bg-red-50 border-red-200 text-red-700`}`,children:[y.type===`success`?`✅`:`❌`,` `,y.text]}),g&&(0,x.jsx)(`div`,{className:`text-sm text-gray-500`,children:`⏳ Yükleniyor...`}),m&&!g&&(0,x.jsxs)(`form`,{onSubmit:e=>void E(e),className:`bg-white rounded-lg shadow p-6 space-y-5`,children:[(0,x.jsxs)(`div`,{className:`grid grid-cols-1 gap-5 sm:grid-cols-2`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`block text-sm font-medium text-gray-700`,children:`Maksimum Artış (%)`}),(0,x.jsx)(`input`,{type:`number`,min:0,max:1e3,step:.1,value:m.max_markup_percent,onChange:e=>h({...m,max_markup_percent:parseFloat(e.target.value)||0}),className:`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-500 mt-1`,children:`Baz fiyatın en fazla bu kadar üzerinde teklif verilebilir.`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`block text-sm font-medium text-gray-700`,children:`Maksimum İndirim (%)`}),(0,x.jsx)(`input`,{type:`number`,min:0,max:100,step:.1,value:m.max_discount_percent,onChange:e=>h({...m,max_discount_percent:parseFloat(e.target.value)||0}),className:`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-500 mt-1`,children:`Baz fiyatın en fazla bu kadar altında teklif verilebilir.`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`block text-sm font-medium text-gray-700`,children:`Tolerans Tutarı (TL)`}),(0,x.jsx)(`input`,{type:`number`,min:0,step:1,value:m.tolerance_amount,onChange:e=>h({...m,tolerance_amount:parseFloat(e.target.value)||0}),className:`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-500 mt-1`,children:`Yüzde sınırına ek olarak sabit para birimi toleransı.`})]}),(0,x.jsxs)(`div`,{className:`flex items-start gap-3 pt-6`,children:[(0,x.jsx)(`input`,{type:`checkbox`,id:`block_on_violation`,checked:m.block_on_violation,onChange:e=>h({...m,block_on_violation:e.target.checked}),className:`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded`}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{htmlFor:`block_on_violation`,className:`text-sm font-medium text-gray-700 cursor-pointer`,children:`İhlalde Engelle`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-500 mt-0.5`,children:`Aktifse kural dışı fiyatlı teklifler kayıt edilemez. Pasifse sadece uyarı gösterilir.`})]})]})]}),m.updated_at&&(0,x.jsxs)(`p`,{className:`text-xs text-gray-400`,children:[`Son güncelleme: `,new Date(m.updated_at).toLocaleString(`tr-TR`)]}),(0,x.jsx)(`div`,{className:`pt-4 border-t`,children:(0,x.jsx)(`button`,{type:`submit`,disabled:S,className:`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium`,children:S?`Kaydediliyor...`:`Kuralları Kaydet`})})]})]})]})},_r=h.div`
  padding: 20px;
`,vr=h.div`
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #1f2937;
  }

  p {
    color: #6b7280;
    margin: 5px 0 0 0;
  }
`,yr=h.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`,br=h.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`,xr=h.h3`
  margin: 0;
  color: #1f2937;
  font-size: 16px;
`,Sr=h.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${e=>{switch(e.status){case`DRAFT`:return`#f3f4f6`;case`SENT`:return`#fef3c7`;case`PENDING`:return`#dbeafe`;case`RESPONDED`:return`#d1fae5`;case`APPROVED`:return`#86efac`;default:return`#f3f4f6`}}};
  color: ${e=>{switch(e.status){case`DRAFT`:return`#374151`;case`SENT`:return`#92400e`;case`PENDING`:return`#1e40af`;case`RESPONDED`:return`#065f46`;case`APPROVED`:return`#166534`;default:return`#374151`}}};
`,Cr=h.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
`,wr=h.div`
  display: flex;
  flex-direction: column;

  strong {
    color: #6b7280;
    font-weight: 500;
  }

  span {
    color: #1f2937;
    margin-top: 2px;
  }
`,Tr=h.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  margin-top: 12px;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,Er=h.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`,Dr=h.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  background-color: ${e=>e.variant===`danger`?`#ef4444`:`#10b981`};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`,Or=h.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;

  p {
    margin: 0;
  }
`,kr=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,Ar=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;function jr({apiUrl:e,authToken:t}){let[n,r]=(0,_.useState)([]),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)(``),[m,h]=(0,_.useState)(null),g=(0,_.useCallback)(async()=>{try{a(!0),s(null);let n=await fetch(`${e}/api/v1/approvals/user/pending`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw Error(`Onaylar yüklenemedi`);r(await n.json()||[])}catch(e){s(String(e))}finally{a(!1)}},[e,t]);(0,_.useEffect)(()=>{g()},[g]);let v=(0,_.useCallback)(async n=>{try{h(n);let r=await fetch(`${e}/api/v1/approvals/${n}/approve`,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/json`},body:JSON.stringify({comment:f||null})});if(!r.ok){let e=await r.json();throw Error(e.detail||`Onaylama başarısız`)}l(`✅ Teklif onaylandı`),d(null),p(``),g(),setTimeout(()=>l(null),3e3)}catch(e){s(String(e))}finally{h(null)}},[e,t,f,g]),y=(0,_.useCallback)(async n=>{if(!f.trim()){s(`Red nedeni yazmanız gerekir`);return}try{h(n);let r=await fetch(`${e}/api/v1/approvals/${n}/reject`,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/json`},body:JSON.stringify({comment:f})});if(!r.ok){let e=await r.json();throw Error(e.detail||`Red başarısız`)}l(`✅ Teklif reddedildi`),d(null),p(``),g(),setTimeout(()=>l(null),3e3)}catch(e){s(String(e))}finally{h(null)}},[e,t,f,g]);return i?(0,x.jsx)(_r,{children:`Yükleniyor...`}):(0,x.jsxs)(_r,{children:[(0,x.jsxs)(vr,{children:[(0,x.jsx)(`h2`,{children:`📋 Onay Bekleyen Teklifler`}),(0,x.jsxs)(`p`,{children:[n.length,` teklif onay beklemektedir`]})]}),o&&(0,x.jsxs)(kr,{children:[`❌ `,o]}),c&&(0,x.jsx)(Ar,{children:c}),n.length===0?(0,x.jsx)(Or,{children:(0,x.jsx)(`p`,{children:`✅ Onay bekleyen teklif yok`})}):n.map(e=>(0,x.jsxs)(yr,{children:[(0,x.jsxs)(br,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(xr,{children:e.quote_title}),(0,x.jsx)(`p`,{style:{margin:`5px 0 0 0`,fontSize:`13px`,color:`#6b7280`},children:e.company_name})]}),(0,x.jsx)(Sr,{status:e.quote_status,children:e.quote_status||`PENDING`})]}),(0,x.jsxs)(Cr,{children:[(0,x.jsxs)(wr,{children:[(0,x.jsx)(`strong`,{children:`Toplam Tutar`}),(0,x.jsxs)(`span`,{children:[`₺`,e.total_amount.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})]}),(0,x.jsxs)(wr,{children:[(0,x.jsx)(`strong`,{children:`Onay Seviyesi`}),(0,x.jsx)(`span`,{children:e.approval_level===1?`🔷 Yönetici`:`🔶 Direktör`})]}),(0,x.jsxs)(wr,{children:[(0,x.jsx)(`strong`,{children:`İstek Tarihi`}),(0,x.jsx)(`span`,{children:new Date(e.requested_at).toLocaleDateString(`tr-TR`)})]}),(0,x.jsxs)(wr,{children:[(0,x.jsx)(`strong`,{children:`Oluşturulma`}),(0,x.jsx)(`span`,{children:new Date(e.created_at).toLocaleDateString(`tr-TR`)})]})]}),u===e.approval_id?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Tr,{placeholder:`Onay veya red ile ilgili notu giriniz...`,value:f,onChange:e=>p(e.target.value)}),(0,x.jsxs)(Er,{children:[(0,x.jsx)(Dr,{variant:`success`,onClick:()=>v(e.quote_id),disabled:m!==null,children:m===e.quote_id?`⏳ İşleniyor...`:`✅ Onayla`}),(0,x.jsx)(Dr,{variant:`danger`,onClick:()=>y(e.quote_id),disabled:m!==null,children:m===e.quote_id?`⏳ İşleniyor...`:`❌ Reddet`}),(0,x.jsx)(Dr,{onClick:()=>{d(null),p(``)},style:{backgroundColor:`#6b7280`},children:`İptal`})]})]}):(0,x.jsx)(`button`,{onClick:()=>d(e.approval_id),style:{width:`100%`,padding:`10px`,backgroundColor:`#f3f4f6`,border:`1px solid #d1d5db`,borderRadius:`4px`,cursor:`pointer`,marginTop:`12px`,fontWeight:600,color:`#1f2937`},children:`Karar Ver →`})]},e.approval_id))]})}function Mr(){let{user:e}=b(),[t,n]=i(),[r,o]=(0,_.useState)(`companies`),[s,c]=(0,_.useState)([]),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)({email:``,full_name:``,password:``,role:``,approval_limit:1e5,department_id:void 0}),[p,m]=(0,_.useState)([]),[h,g]=(0,_.useState)(!1),[v,y]=(0,_.useState)({name:``,description:``}),[S,C]=(0,_.useState)([]),[w,T]=(0,_.useState)(!1),[E,D]=(0,_.useState)({name:``,is_active:!0,color:`#3b82f6`}),[O,k]=(0,_.useState)([]),[A,j]=(0,_.useState)(!0),[M,N]=(0,_.useState)(null);(0,_.useEffect)(()=>{P()},[]),(0,_.useEffect)(()=>{let e=t.get(`tab`);e&&[`companies`,`roles`,`departments`,`personnel`,`projects`,`suppliers`,`approvals`,`settings`].includes(e)&&o(e)},[t]);async function P(){try{j(!0);let[e,t,n,r]=await Promise.all([qt(),Ht(),Nt(),Lt()]);c(e),m(t),C(n),k(r)}catch(e){N(String(e))}finally{j(!1)}}if(e?.role!==`super_admin`)return(0,x.jsx)(`div`,{style:{padding:20,color:`red`},children:`Sadece Super Admin bu sayfaya erişebilir`});let F=async()=>{if(!d.email||!d.full_name||!d.password){alert(`Tüm alanları doldurunuz`);return}if(!d.role){alert(`Lütfen bir rol seçiniz`);return}try{await Jt(d),await P(),f({email:``,full_name:``,password:``,role:``,approval_limit:1e5,department_id:void 0}),u(!1)}catch(e){alert(`Personel ekleme hatası: `+String(e))}},I=async e=>{if(confirm(`Personeli silmek istediğinize emin misiniz?`))try{await Xt(e),await P()}catch(e){alert(`Silme hatası: `+String(e))}},L=async()=>{if(!v.name){alert(`Departman adı gereklidir`);return}try{await Ut(v),await P(),y({name:``,description:``}),g(!1)}catch(e){alert(`Departman ekleme hatası: `+String(e))}},R=async e=>{if(confirm(`Departmanı silmek istediğinize emin misiniz?`))try{await Gt(e),await P()}catch(e){alert(`Silme hatası: `+String(e))}},z=async()=>{if(!E.name){alert(`Firma adı gereklidir`);return}try{await Pt(E),await P(),D({name:``,description:``,is_active:!0,color:`#3b82f6`}),T(!1)}catch(e){alert(`Firma ekleme hatası: `+String(e))}},B=async e=>{if(confirm(`Firmayı silmek istediğinize emin misiniz?`))try{await It(e),await P()}catch(e){alert(`Silme hatası: `+String(e))}};return A?(0,x.jsx)(`div`,{style:{padding:20},children:`Yükleniyor...`}):(0,x.jsxs)(`div`,{style:{padding:20},children:[(0,x.jsx)(`h1`,{children:`👩‍💼 Admin Paneli`}),M&&(0,x.jsx)(`div`,{style:{padding:12,background:`#fecaca`,color:`#dc2626`,borderRadius:4,marginBottom:20},children:M}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:12,marginBottom:20,borderBottom:`2px solid #e5e7eb`,paddingBottom:12},children:[`companies`,`roles`,`departments`,`personnel`,`projects`,`suppliers`,`approvals`,`settings`].map(e=>(0,x.jsxs)(`button`,{onClick:()=>{o(e),n({tab:e})},style:{padding:`8px 16px`,background:r===e?`#3b82f6`:`transparent`,color:r===e?`white`:`#666`,border:`none`,borderRadius:`4px 4px 0 0`,cursor:`pointer`,fontWeight:r===e?`bold`:`normal`},children:[e===`personnel`&&`👥 Personel`,e===`departments`&&`🏢 Departmanlar`,e===`companies`&&`🏭 Firmalar`,e===`roles`&&`🔐 Roller`,e===`projects`&&`📋 Projeler`,e===`suppliers`&&`🤝 Tedarikçiler`,e===`approvals`&&`⚖️ Onaylar`,e===`settings`&&`⚙️ Ayarlar`]},e))}),r===`personnel`&&(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{marginBottom:20},children:(0,x.jsx)(`button`,{onClick:()=>u(!l),style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:l?`❌ İptal`:`➕ Yeni Personel`})}),l&&(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,marginBottom:20,border:`1px solid #ddd`},children:[(0,x.jsx)(`h3`,{children:`Yeni Personel Ekle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginBottom:12},children:[(0,x.jsx)(`input`,{type:`email`,placeholder:`Email`,value:d.email,onChange:e=>f({...d,email:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsx)(`input`,{type:`text`,placeholder:`Ad Soyad`,value:d.full_name,onChange:e=>f({...d,full_name:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsx)(`input`,{type:`password`,placeholder:`Şifre`,value:d.password,onChange:e=>f({...d,password:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsxs)(`select`,{value:d.role,onChange:e=>f({...d,role:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`},children:[(0,x.jsx)(`option`,{value:``,children:`Rol Seçiniz...`}),O.map(e=>(0,x.jsx)(`option`,{value:e.name,children:e.name},e.id))]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(`button`,{onClick:F,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Ekle`}),(0,x.jsx)(`button`,{onClick:()=>u(!1),style:{padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})]}),(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:14},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`,borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Ad Soyad`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Email`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Rol`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`center`},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:s.map(e=>(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`},children:[(0,x.jsx)(`td`,{style:{padding:12},children:e.full_name}),(0,x.jsx)(`td`,{style:{padding:12},children:e.email}),(0,x.jsx)(`td`,{style:{padding:12},children:e.role}),(0,x.jsxs)(`td`,{style:{padding:12,textAlign:`center`},children:[(0,x.jsx)(a,{to:`/admin/personnel/${e.id}`,style:{padding:`4px 12px`,marginRight:8,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12,textDecoration:`none`,display:`inline-block`},children:`Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>I(e.id),style:{padding:`4px 8px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12},children:`Sil`})]})]},e.id))})]})})]}),r===`departments`&&(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{marginBottom:20},children:(0,x.jsx)(`button`,{onClick:()=>g(!h),style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:h?`❌ İptal`:`➕ Yeni Departman`})}),h&&(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,marginBottom:20,border:`1px solid #ddd`},children:[(0,x.jsx)(`h3`,{children:`Yeni Departman Ekle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginBottom:12},children:[(0,x.jsx)(`input`,{type:`text`,placeholder:`Departman Adı`,value:v.name,onChange:e=>y({...v,name:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsx)(`input`,{type:`text`,placeholder:`Açıklama`,value:v.description,onChange:e=>y({...v,description:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(`button`,{onClick:L,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Ekle`}),(0,x.jsx)(`button`,{onClick:()=>g(!1),style:{padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})]}),(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:14},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`,borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Departman Adı`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Açıklama`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`center`},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:p.map(e=>(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`},children:[(0,x.jsx)(`td`,{style:{padding:12},children:e.name}),(0,x.jsx)(`td`,{style:{padding:12},children:e.description||`-`}),(0,x.jsxs)(`td`,{style:{padding:12,textAlign:`center`},children:[(0,x.jsx)(a,{to:`/admin/departments/${e.id}`,style:{padding:`4px 12px`,marginRight:8,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12,textDecoration:`none`,display:`inline-block`},children:`Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>R(e.id),style:{padding:`4px 8px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12},children:`Sil`})]})]},e.id))})]})})]}),r===`companies`&&(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{marginBottom:20},children:(0,x.jsx)(`button`,{onClick:()=>T(!w),style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:w?`❌ İptal`:`➕ Yeni Firma`})}),w&&(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,marginBottom:20,border:`1px solid #ddd`},children:[(0,x.jsx)(`h3`,{children:`Yeni Firma Ekle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginBottom:12},children:[(0,x.jsx)(`input`,{type:`text`,placeholder:`Firma Adı`,value:E.name,onChange:e=>D({...E,name:e.target.value}),style:{padding:8,borderRadius:4,border:`1px solid #ddd`}}),(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,x.jsx)(`div`,{style:{display:`flex`,alignItems:`center`},children:(0,x.jsxs)(`label`,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:E.is_active,onChange:e=>D({...E,is_active:e.target.checked}),style:{marginRight:8}}),`Aktif`]})}),(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`},children:[(0,x.jsx)(`label`,{style:{marginRight:8},children:`Renk:`}),(0,x.jsx)(`input`,{type:`color`,value:E.color,onChange:e=>D({...E,color:e.target.value}),style:{width:`40px`,height:`40px`,borderRadius:`4px`,border:`1px solid #ddd`,cursor:`pointer`}})]})]})]}),(0,x.jsx)(`textarea`,{placeholder:`Açıklama`,value:E.description||``,onChange:e=>D({...E,description:e.target.value}),style:{width:`100%`,padding:8,marginBottom:12,borderRadius:4,border:`1px solid #ddd`,fontFamily:`inherit`}}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(`button`,{onClick:z,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Ekle`}),(0,x.jsx)(`button`,{onClick:()=>T(!1),style:{padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})]}),(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:14},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`,borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Firma Adı`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`left`},children:`Açıklama`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`center`},children:`Durum`}),(0,x.jsx)(`th`,{style:{padding:12,textAlign:`center`},children:`İşlem`})]})}),(0,x.jsx)(`tbody`,{children:S.map(e=>(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`},children:[(0,x.jsx)(`td`,{style:{padding:12},children:e.name}),(0,x.jsx)(`td`,{style:{padding:12},children:e.description||`-`}),(0,x.jsx)(`td`,{style:{padding:12,textAlign:`center`},children:(0,x.jsx)(`span`,{style:{display:`inline-block`,padding:`4px 8px`,background:e.is_active?`#d1fae5`:`#fee2e2`,color:e.is_active?`#065f46`:`#991b1b`,borderRadius:`4px`,fontSize:12},children:e.is_active?`Aktif`:`Pasif`})}),(0,x.jsxs)(`td`,{style:{padding:12,textAlign:`center`},children:[(0,x.jsx)(a,{to:`/admin/companies/${e.id}`,style:{padding:`4px 12px`,marginRight:8,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12,textDecoration:`none`,display:`inline-block`},children:`Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>B(e.id),style:{padding:`4px 8px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:12},children:`Sil`})]})]},e.id))})]})})]}),r===`roles`&&(0,x.jsx)(Fn,{}),r===`projects`&&(0,x.jsx)(Pn,{}),r===`suppliers`&&(0,x.jsx)(Zn,{}),r===`approvals`&&(0,x.jsx)(jr,{apiUrl:`http://localhost:8000`,authToken:U()||``}),r===`settings`&&(0,x.jsx)(gr,{})]})}function Nr(){return(0,x.jsxs)(`div`,{style:{fontFamily:`Arial`},children:[(0,x.jsx)(`h2`,{children:`Raporlar`}),(0,x.jsx)(`p`,{children:`Bu alan rapor görüntüleme yetkisi olan roller içindir.`})]})}function Pr(){let e=o(),t=m(),{user:n}=b(),r=e.state?.deniedFrom??`bu sayfa`,i=e.state?.fallbackTo,s=n?i??E(n.role):`/dashboard`;return(0,x.jsxs)(`div`,{style:{maxWidth:720,margin:`48px auto`,padding:16,fontFamily:`Arial`},children:[(0,x.jsx)(`h1`,{style:{marginBottom:8},children:`403 - Yetkisiz Erişim`}),(0,x.jsxs)(`p`,{style:{color:`#374151`},children:[(0,x.jsx)(`b`,{children:r}),` için gerekli yetkiye sahip değilsiniz.`]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:10,marginTop:16},children:[(0,x.jsx)(`button`,{onClick:()=>t(-1),style:{border:`1px solid #d1d5db`,background:`#fff`,borderRadius:8,padding:`8px 12px`,cursor:`pointer`},children:`Geri Dön`}),(0,x.jsx)(a,{to:s,style:{textDecoration:`none`,border:`1px solid #d1d5db`,borderRadius:8,padding:`8px 12px`,color:`#111827`,background:`#fff`},children:`Uygun Sayfaya Git`})]})]})}var Fr=[{name:`Adana`,districts:[`Aladağ`,`Ceyhan`,`Çukurova`,`Feke`,`İmamoğlu`,`Karaisalı`,`Karataş`,`Kozan`,`Pozantı`,`Saimbeyli`,`Sarıçam`,`Seyhan`,`Tufanbeyli`,`Yumurtalık`,`Yüreğir`]},{name:`Adıyaman`,districts:[`Adıyaman Merkez`,`Besni`,`Çelikhan`,`Gerger`,`Gölbaşı`,`Kahta`,`Samsat`,`Sincik`,`Tut`]},{name:`Afyonkarahisar`,districts:[`Başmakçı`,`Bayat`,`Bolvadin`,`Çay`,`Çobanlar`,`Dazkırı`,`Dinar`,`Emirdağ`,`Evciler`,`Hocalar`,`İhsaniye`,`İscehisar`,`Kızılören`,`Merkez`,`Sandıklı`,`Sinanpaşa`,`Sultandağı`,`Şuhut`]},{name:`Ağrı`,districts:[`Diyadin`,`Doğubayazıt`,`Eleşkirt`,`Hamur`,`Merkez`,`Patnos`,`Taşlıçay`,`Tutak`]},{name:`Aksaray`,districts:[`Ağaçören`,`Eskil`,`Gülağaç`,`Güzelyurt`,`Merkez`,`Ortaköy`,`Sarıyahşi`,`Sultanhanı`]},{name:`Amasya`,districts:[`Göynücek`,`Gümüşhacıköy`,`Hamamözü`,`Merkez`,`Merzifon`,`Suluova`,`Taşova`]},{name:`Ankara`,districts:[`Akyurt`,`Altındağ`,`Ayaş`,`Bala`,`Beypazarı`,`Çamlıdere`,`Çankaya`,`Çubuk`,`Elmadağ`,`Etimesgut`,`Evren`,`Gölbaşı`,`Güdül`,`Haymana`,`Kalecik`,`Kazan`,`Keçiören`,`Kızılcahamam`,`Mamak`,`Nallıhan`,`Polatlı`,`Pursaklar`,`Sincan`,`Şereflikoçhisar`,`Yenimahalle`]},{name:`Antalya`,districts:[`Akseki`,`Aksu`,`Alanya`,`Demre`,`Döşemealtı`,`Elmalı`,`Finike`,`Gazipaşa`,`Gündoğmuş`,`İbradı`,`Kaş`,`Kemer`,`Kepez`,`Konyaaltı`,`Korkuteli`,`Kumluca`,`Manavgat`,`Muratpaşa`,`Serik`]},{name:`Ardahan`,districts:[`Çıldır`,`Damal`,`Göle`,`Hanak`,`Merkez`,`Posof`]},{name:`Artvin`,districts:[`Ardanuç`,`Arhavi`,`Borçka`,`Hopa`,`Kemalpaşa`,`Merkez`,`Murgul`,`Şavşat`,`Yusufeli`]},{name:`Aydın`,districts:[`Bozdoğan`,`Buharkent`,`Çine`,`Didim`,`Efeler`,`Germencik`,`İncirliova`,`Karacasu`,`Karpuzlu`,`Koçarlı`,`Köşk`,`Kuşadası`,`Kuyucak`,`Nazilli`,`Söke`,`Sultanhisar`,`Yenipazar`]},{name:`Balıkesir`,districts:[`Altıeylül`,`Ayvalık`,`Balya`,`Bandırma`,`Bigadiç`,`Burhaniye`,`Dursunbey`,`Edremit`,`Erdek`,`Gömeç`,`Gönen`,`Havran`,`İvrindi`,`Karesi`,`Kepsut`,`Manyas`,`Marmara`,`Savaştepe`,`Sındırgı`,`Susurluk`]},{name:`Bartın`,districts:[`Amasra`,`Kurucaşile`,`Merkez`,`Ulus`]},{name:`Batman`,districts:[`Beşiri`,`Gercüş`,`Hasankeyf`,`Kozluk`,`Merkez`,`Sason`]},{name:`Bayburt`,districts:[`Aydıntepe`,`Demirözü`,`Merkez`]},{name:`Bilecik`,districts:[`Bozüyük`,`Gölpazarı`,`İnhisar`,`Merkez`,`Osmaneli`,`Pazaryeri`,`Söğüt`,`Yenipazar`]},{name:`Bingöl`,districts:[`Adaklı`,`Genç`,`Karlıova`,`Kiğı`,`Merkez`,`Solhan`,`Yaylıdere`,`Yedisu`]},{name:`Bitlis`,districts:[`Adilcevaz`,`Ahlat`,`Güroymak`,`Hizan`,`Merkez`,`Mutki`,`Tatvan`]},{name:`Bolu`,districts:[`Dörtdivan`,`Gerede`,`Göynük`,`Kıbrıscık`,`Mengen`,`Merkez`,`Mudurnu`,`Seben`,`Yeniçağa`]},{name:`Burdur`,districts:[`Ağlasun`,`Altınyayla`,`Bucak`,`Çavdır`,`Çeltikçi`,`Gölhisar`,`Karamanlı`,`Kemer`,`Merkez`,`Tefenni`,`Yeşilova`]},{name:`Bursa`,districts:[`Büyükorhan`,`Gemlik`,`Gürsu`,`Harmancık`,`İnegöl`,`İznik`,`Karacabey`,`Keles`,`Kestel`,`Mudanya`,`Mustafakemalpaşa`,`Nilüfer`,`Orhaneli`,`Orhangazi`,`Osmangazi`,`Yıldırım`,`Yenişehir`]},{name:`Çanakkale`,districts:[`Ayvacık`,`Bayramiç`,`Biga`,`Bozcaada`,`Çan`,`Eceabat`,`Ezine`,`Gelibolu`,`Gökçeada`,`Lapseki`,`Merkez`,`Yenice`]},{name:`Çankırı`,districts:[`Atkaracalar`,`Bayramören`,`Çerkeş`,`Eldivan`,`Ilgaz`,`Kızılırmak`,`Korgun`,`Kurşunlu`,`Merkez`,`Orta`,`Şabanözü`,`Yapraklı`]},{name:`Çorum`,districts:[`Alaca`,`Bayat`,`Boğazkale`,`Dodurga`,`İskilip`,`Kargı`,`Laçin`,`Mecitözü`,`Merkez`,`Oğuzlar`,`Ortaköy`,`Osmancık`,`Sungurlu`,`Uğurludağ`]},{name:`Denizli`,districts:[`Acıpayam`,`Babadağ`,`Baklan`,`Bekilli`,`Beyağaç`,`Bozkurt`,`Buldan`,`Çal`,`Çameli`,`Çardak`,`Çivril`,`Güney`,`Honaz`,`Kale`,`Merkezefendi`,`Pamukkale`,`Sarayköy`,`Serinhisar`,`Tavas`]},{name:`Diyarbakır`,districts:[`Bağlar`,`Bismil`,`Çermik`,`Çınar`,`Çüngüş`,`Dicle`,`Eğil`,`Ergani`,`Hani`,`Hazro`,`Kayapınar`,`Kocaköy`,`Kulp`,`Lice`,`Silvan`,`Sur`,`Yenişehir`]},{name:`Düzce`,districts:[`Akçakoca`,`Cumayeri`,`Çilimli`,`Gölyaka`,`Gümüşova`,`Kaynaşlı`,`Merkez`,`Yığılca`]},{name:`Edirne`,districts:[`Enez`,`Havsa`,`İpsala`,`Keşan`,`Lalapaşa`,`Meriç`,`Merkez`,`Süloğlu`,`Uzunköprü`]},{name:`Elazığ`,districts:[`Ağın`,`Alacakaya`,`Arıcak`,`Baskil`,`Karakoçan`,`Keban`,`Kovancılar`,`Maden`,`Merkez`,`Palu`,`Sivrice`]},{name:`Erzincan`,districts:[`Çayırlı`,`İliç`,`Kemah`,`Kemaliye`,`Merkez`,`Otlukbeli`,`Refahiye`,`Tercan`,`Üzümlü`]},{name:`Erzurum`,districts:[`Aşkale`,`Aziziye`,`Çat`,`Hinis`,`Horasan`,`İspir`,`Karaçoban`,`Karayazı`,`Köprüköy`,`Merkez`,`Narman`,`Oltu`,`Olur`,`Palandöken`,`Pasinler`,`Pazaryolu`,`Şenkaya`,`Tekman`,`Tortum`,`Uzundere`,`Yakutiye`]},{name:`Eskişehir`,districts:[`Alpu`,`Beylikova`,`Çifteler`,`Günyüzü`,`Han`,`İnönü`,`Mahmudiye`,`Mihalgazi`,`Mihalıççık`,`Odunpazarı`,`Sarıcakaya`,`Seyitgazi`,`Sivrihisar`,`Tepebaşı`]},{name:`Gaziantep`,districts:[`Araban`,`İslahiye`,`Karkamış`,`Nizip`,`Nurdağı`,`Oğuzeli`,`Şahinbey`,`Şehitkamil`,`Yavuzeli`]},{name:`Giresun`,districts:[`Alucra`,`Bulancak`,`Çamoluk`,`Çanakçı`,`Dereli`,`Doğankent`,`Espiye`,`Eynesil`,`Görele`,`Güce`,`Keşap`,`Merkez`,`Piraziz`,`Şebinkarahisar`,`Tirebolu`,`Yağlıdere`]},{name:`Gümüşhane`,districts:[`Kelkit`,`Köse`,`Kürtün`,`Merkez`,`Şiran`,`Torul`]},{name:`Hakkari`,districts:[`Çukurca`,`Derecik`,`Merkez`,`Şemdinli`,`Yüksekova`]},{name:`Hatay`,districts:[`Altınözü`,`Antakya`,`Arsuz`,`Belen`,`Defne`,`Dörtyol`,`Erzin`,`Hassa`,`İskenderun`,`Kırıkhan`,`Kumlu`,`Narlıca`,`Payas`,`Reyhanlı`,`Samandağ`,`Serinyol`,`Yayladağı`]},{name:`Iğdır`,districts:[`Aralık`,`Karakoyunlu`,`Merkez`,`Tuzluca`]},{name:`Isparta`,districts:[`Aksu`,`Atabey`,`Eğirdir`,`Gelendost`,`Gönen`,`Keçiborlu`,`Merkez`,`Senirkent`,`Sütçüler`,`Şarkikaraağaç`,`Uluborlu`,`Yalvaç`,`Yenişarbademli`]},{name:`İstanbul`,districts:`Adalar.Arnavutköy.Ataşehir.Avcılar.Bağcılar.Bahçelievler.Bakırköy.Başakşehir.Bayrampaşa.Beşiktaş.Beykoz.Beylikdüzü.Beyoğlu.Büyükçekmece.Çatalca.Çekmeköy.Esenler.Esenyurt.Eyüpsultan.Fatih.Gaziosmanpaşa.Güngören.Kadıköy.Kağıthane.Kartal.Küçükçekmece.Maltepe.Pendik.Sancaktepe.Sarıyer.Silivri.Sultanbeyli.Sultangazi.Şile.Şişli.Tuzla.Ümraniye.Üsküdar.Zeytinburnu`.split(`.`)},{name:`İzmir`,districts:`Aliağa.Balçova.Bayındır.Bayraklı.Bergama.Beydağ.Bornova.Buca.Çeşme.Çiğli.Dikili.Foça.Gaziemir.Güzelbahçe.Karabağlar.Karaburun.Karşıyaka.Kemalpaşa.Kınık.Kiraz.Konak.Menderes.Menemen.Narlıdere.Ödemiş.Seferihisar.Selçuk.Tire.Torbalı.Urla`.split(`.`)},{name:`Kahramanmaraş`,districts:[`Afşin`,`Andırın`,`Çağlayancerit`,`Dulkadiroğlu`,`Ekinözü`,`Elbistan`,`Göksun`,`Nurhak`,`Onikişubat`,`Pazarcık`,`Türkoğlu`]},{name:`Karabük`,districts:[`Eflani`,`Eskipazar`,`Merkez`,`Ovacık`,`Safranbolu`,`Yenice`]},{name:`Karaman`,districts:[`Ayrancı`,`Başyayla`,`Ermenek`,`Kazımkarabekir`,`Merkez`,`Sarıveliler`]},{name:`Kars`,districts:[`Akyaka`,`Arpaçay`,`Digor`,`Kağızman`,`Merkez`,`Sarıkamış`,`Selim`,`Susuz`]},{name:`Kastamonu`,districts:[`Abana`,`Ağlı`,`Araç`,`Azdavay`,`Bozkurt`,`Cide`,`Çatalzeytin`,`Daday`,`Devrekani`,`Doğanyurt`,`Hanönü`,`İhsangazi`,`İnebolu`,`Küre`,`Merkez`,`Pınarbaşı`,`Seydiler`,`Şenpazar`,`Taşköprü`,`Tosya`]},{name:`Kayseri`,districts:[`Akkışla`,`Bünyan`,`Develi`,`Felahiye`,`Hacılar`,`İncesu`,`Kocasinan`,`Melikgazi`,`Özvatan`,`Pınarbaşı`,`Sarıoğlan`,`Sarız`,`Talas`,`Tomarza`,`Yahyalı`,`Yeşilhisar`]},{name:`Kilis`,districts:[`Elbeyli`,`Merkez`,`Musabeyli`,`Polateli`]},{name:`Kırıkkale`,districts:[`Bahşili`,`Balışeyh`,`Çelebi`,`Delice`,`Karakeçili`,`Keskin`,`Merkez`,`Sulakyurt`,`Yahşihan`]},{name:`Kırklareli`,districts:[`Babaeski`,`Demirköy`,`Kofçaz`,`Lüleburgaz`,`Merkez`,`Pehlivanköy`,`Pınarhisar`,`Vize`]},{name:`Kırşehir`,districts:[`Akçakent`,`Akpınar`,`Boztepe`,`Çiçekdağı`,`Kaman`,`Merkez`,`Mucur`]},{name:`Kocaeli`,districts:[`Başiskele`,`Çayırova`,`Darıca`,`Derince`,`Dilovası`,`Gebze`,`Gölcük`,`İzmit`,`Kandıra`,`Karamürsel`,`Kartepe`,`Körfez`]},{name:`Konya`,districts:`Ahırlı.Akören.Akşehir.Altınekin.Beyşehir.Bozkır.Cihanbeyli.Çeltik.Çumra.Derbent.Derebucak.Doğanhisar.Emirgazi.Ereğli.Güneysinir.Hadim.Halkapınar.Hüyük.Ilgın.Kadınhanı.Karapınar.Karatay.Kulu.Meram.Sarayönü.Selçuklu.Seydişehir.Taşkent.Tuzlukçu.Yalıhüyük.Yunak`.split(`.`)},{name:`Kütahya`,districts:[`Altıntaş`,`Aslanapa`,`Çavdarhisar`,`Domaniç`,`Dumlupınar`,`Emet`,`Gediz`,`Hisarcık`,`Merkez`,`Pazarlar`,`Şaphane`,`Simav`,`Tavşanlı`]},{name:`Malatya`,districts:[`Akçadağ`,`Arapgir`,`Arguvan`,`Battalgazi`,`Darende`,`Doğanşehir`,`Doğanyol`,`Hekimhan`,`Kale`,`Kuluncak`,`Pütürge`,`Yazıhan`,`Yeşilyurt`]},{name:`Manisa`,districts:[`Ahmetli`,`Akhisar`,`Alaşehir`,`Demirci`,`Gölmarmara`,`Gördes`,`Kırkağaç`,`Köprübaşı`,`Kula`,`Merkez`,`Salihli`,`Sarıgöl`,`Saruhanlı`,`Selendi`,`Soma`,`Şehzadeler`,`Turgutlu`,`Yunusemre`]},{name:`Mardin`,districts:[`Artuklu`,`Dargeçit`,`Derik`,`Kızıltepe`,`Mazıdağı`,`Midyat`,`Nusaybin`,`Ömerli`,`Savur`,`Yeşilli`]},{name:`Mersin`,districts:[`Akdeniz`,`Anamur`,`Aydıncık`,`Bozyazı`,`Çamlıyayla`,`Erdemli`,`Gülnar`,`Mezitli`,`Mut`,`Silifke`,`Tarsus`,`Toroslar`,`Yenişehir`]},{name:`Muğla`,districts:[`Bodrum`,`Dalaman`,`Datça`,`Fethiye`,`Kavaklıdere`,`Köyceğiz`,`Marmaris`,`Menteşe`,`Milas`,`Ortaca`,`Seydikemer`,`Ula`,`Yatağan`]},{name:`Muş`,districts:[`Bulanık`,`Hasköy`,`Korkut`,`Malazgirt`,`Merkez`,`Varto`]},{name:`Nevşehir`,districts:[`Acıgöl`,`Avanos`,`Derinkuyu`,`Gülşehir`,`Hacıbektaş`,`Kozaklı`,`Merkez`,`Ürgüp`]},{name:`Niğde`,districts:[`Altunhisar`,`Bor`,`Çamardı`,`Çiftlik`,`Merkez`,`Ulukışla`]},{name:`Ordu`,districts:[`Akkuş`,`Altınordu`,`Aybastı`,`Çamaş`,`Çatalpınar`,`Çaybaşı`,`Fatsa`,`Gölköy`,`Gülyalı`,`Gürgentepe`,`İkizce`,`Kabadüz`,`Kabataş`,`Korgan`,`Kumru`,`Mesudiye`,`Perşembe`,`Ulubey`,`Ünye`]},{name:`Osmaniye`,districts:[`Bahçe`,`Düziçi`,`Hasanbeyli`,`Kadirli`,`Merkez`,`Sumbas`,`Toprakkale`]},{name:`Rize`,districts:[`Ardeşen`,`Çamlıhemşin`,`Çayeli`,`Derepazarı`,`Fındıklı`,`Güneysu`,`Hemşin`,`İkizdere`,`İyidere`,`Kalkandere`,`Merkez`,`Pazar`]},{name:`Sakarya`,districts:[`Adapazarı`,`Akyazı`,`Arifiye`,`Erenler`,`Ferizli`,`Geyve`,`Hendek`,`Karapürçek`,`Karasu`,`Kaynarca`,`Kocaali`,`Mithatpaşa`,`Pamukova`,`Sapanca`,`Serdivan`,`Söğütlü`,`Taraklı`]},{name:`Samsun`,districts:[`Alaçam`,`Asarcık`,`Atakum`,`Ayvacık`,`Bafra`,`Canik`,`Çarşamba`,`Havza`,`İlkadım`,`Kavak`,`Ladik`,`Ondokuzmayıs`,`Salıpazarı`,`Tekkeköy`,`Terme`,`Vezirköprü`,`Yakakent`]},{name:`Siirt`,districts:[`Baykan`,`Eruh`,`Kurtalan`,`Merkez`,`Pervari`,`Şirvan`,`Tillo`]},{name:`Sinop`,districts:[`Ayancık`,`Boyabat`,`Dikmen`,`Durağan`,`Erfelek`,`Gerze`,`Merkez`,`Saraydüzü`,`Türkeli`]},{name:`Sivas`,districts:[`Akıncılar`,`Altınyayla`,`Divriği`,`Doğanşar`,`Gemerek`,`Gölova`,`Gürun`,`Hafik`,`İmranlı`,`Kangal`,`Koyulhisar`,`Merkez`,`Suşehri`,`Şarkışla`,`Ulaş`,`Yıldızeli`,`Zara`]},{name:`Şanlıurfa`,districts:[`Akçakale`,`Birecik`,`Bozova`,`Ceylanpınar`,`Eyyübiye`,`Halfeti`,`Haliliye`,`Harran`,`Hilvan`,`Karaköprü`,`Siverek`,`Suruç`,`Viranşehir`]},{name:`Şırnak`,districts:[`Beytüşşebap`,`Cizre`,`Güçlükonak`,`İdil`,`Merkez`,`Silopi`,`Uludere`]},{name:`Tekirdağ`,districts:[`Çerkezköy`,`Çorlu`,`Ergene`,`Hayrabolu`,`Kapaklı`,`Malkara`,`Marmaraereğlisi`,`Muratlı`,`Saray`,`Süleymanpaşa`,`Şarköy`]},{name:`Tokat`,districts:[`Almus`,`Artova`,`Başçiftlik`,`Erbaa`,`Merkez`,`Niksar`,`Pazar`,`Reşadiye`,`Sulusaray`,`Turhal`,`Yeşilyurt`,`Zile`]},{name:`Trabzon`,districts:[`Akçaabat`,`Araklı`,`Arsin`,`Beşikdüzü`,`Çarşıbaşı`,`Çaykara`,`Dernekpazarı`,`Düzköy`,`Hayrat`,`Köprübaşı`,`Maçka`,`Of`,`Ortahisar`,`Sürmene`,`Şalpazarı`,`Tonya`,`Vakfıkebir`,`Yomra`]},{name:`Tunceli`,districts:[`Çemişgezek`,`Hozat`,`Mazgirt`,`Merkez`,`Nazımiye`,`Ovacık`,`Pertek`,`Pülümür`]},{name:`Uşak`,districts:[`Banaz`,`Eşme`,`Karahallı`,`Merkez`,`Sivaslı`,`Ulubey`]},{name:`Van`,districts:[`Bahçesaray`,`Başkale`,`Çaldıran`,`Çatak`,`Edremit`,`Erciş`,`Gevaş`,`Gürpınar`,`İpekyolu`,`Muradiye`,`Özalp`,`Saray`,`Tuşba`]},{name:`Yalova`,districts:[`Altınova`,`Armutlu`,`Çınarcık`,`Çiftlikköy`,`Merkez`,`Termal`]},{name:`Yozgat`,districts:[`Akdağmadeni`,`Aydıncık`,`Boğazlıyan`,`Çandır`,`Çayıralan`,`Çekerek`,`Kadışehri`,`Merkez`,`Saraykent`,`Sarıkaya`,`Sorgun`,`Şefaatli`,`Yenifakılı`,`Yerköy`]},{name:`Zonguldak`,districts:[`Alaplı`,`Çaycuma`,`Devrek`,`Ereğli`,`Gökçebey`,`Kilimli`,`Kozlu`,`Merkez`]}];function Ir(){let e=[`İstanbul`,`Ankara`,`İzmir`,`Bursa`,`Antalya`,`Adana`,`Konya`,`Gaziantep`,`Kocaeli`,`Mersin`],t=Fr.map(e=>e.name).filter(t=>!e.includes(t)).sort((e,t)=>e.localeCompare(t,`tr`));return[...e,...t]}function Lr(e){return Fr.find(t=>t.name===e)?.districts??[]}var Rr=h.div`
  min-height: 100vh;
  background: #f0f4f8;
`,zr=h.div`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
`,Br=h.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
  h1 { margin: 0; font-size: 20px; font-weight: 700; }
  span { font-size: 13px; opacity: 0.75; }
`,Vr=h.button`
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.25); }
`,Hr=h.div`
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 16px 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`,Ur=h.div`
  background: #fff;
  border-radius: 16px;
  padding: 26px 28px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
`,Wr=h(Ur)`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
`,Gr=h.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`,Kr=h.div`
  width: 110px;
  height: 110px;
  border-radius: 16px;
  border: 2px dashed ${e=>e.$hasLogo?`#2d6a9f`:`#d1d5db`};
  background: ${e=>e.$hasLogo?`#f0f7ff`:`#f9fafb`};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  img { width: 100%; height: 100%; object-fit: contain; }
`,qr=h.div`
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
  span { font-size: 28px; display: block; }
`,Jr=h.div`
  flex: 1;
`,Yr=h.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2d6a9f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #1e3a5f; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`,Xr=h.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`,Zr=h.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  > input {
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 10px;
    font-size: 14px;
    background: #f8fafc;
    outline: none;
    &:focus { border-color: #2d6a9f; background: #fff; }
  }
`,Qr=h.div`
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,$r=h.span`
  font-size: 11px;
  color: #475569;
  font-weight: 700;
  text-transform: uppercase;
`,ei=h.button`
  margin-top: 12px;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #334155;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #1f2937; }
`,ti=h.p`
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
`,ni=h.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,ri=h.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.02em;
  background: ${e=>e.$pending?`#fef3c7`:`#dcfce7`};
  color: ${e=>e.$pending?`#92400e`:`#166534`};
`,ii=h.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`,ai=h.div`
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: #f8fafc;
  padding: 16px;
`,oi=h.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  h4 {
    margin: 0;
    font-size: 14px;
    color: #1e3a5f;
  }
`,si=h.button`
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`,ci=h(si)`
  color: #b91c1c;
  border-color: #fecaca;
  background: #fff5f5;
`,li=h.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`,ui=h.button`
  border: 1.5px solid ${e=>e.$active?e.$start:`#dbe3ee`};
  background: ${e=>e.$active?`#eff6ff`:`#fff`};
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
`,di=h.span`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${e=>e.$start} 0%, ${e=>e.$end} 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
`,fi=h.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  strong {
    font-size: 13px;
    color: #1e293b;
  }
  span {
    font-size: 11px;
    color: #64748b;
  }
`,pi=h.select`
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 14px;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
`,mi=h.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  input {
    width: 18px;
    height: 18px;
  }
`,hi=h.button`
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
  margin-bottom: 14px;
  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e3a5f;
  }
  span {
    color: #1e3a5f;
    font-size: 16px;
    transform: rotate(${e=>e.$open?`180deg`:`0deg`});
    transition: transform 0.2s;
  }
`,gi=h.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`,_i=h.div`
  grid-column: 1 / -1;
`,vi=h.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  > span { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; }
  > input, > textarea {
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    padding: 10px 12px;
    font-size: 14px;
    color: #1e293b;
    background: #f8fafc;
    outline: none;
    &:focus { border-color: #2d6a9f; background: #fff; }
  }
  > textarea { min-height: 90px; resize: vertical; font-family: inherit; }
`,yi=h.div`
  position: relative;
`,bi=h.ul`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  margin: 0;
  padding: 4px 0;
  list-style: none;
`,xi=h.li`
  padding: 9px 14px;
  font-size: 14px;
  cursor: pointer;
  background: ${e=>e.$active?`#e8f2fc`:`transparent`};
`,Si=h.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0e7490;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 14px;
`,Ci=h.iframe`
  width: 100%;
  height: 300px;
  border: none;
  border-radius: 12px;
  margin-top: 12px;
`,wi=h.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`,Ti=h.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #16a34a;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
`,Ei=h.div`
  display: flex;
  justify-content: flex-end;
`,Di=h.div`
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`,Oi=h.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px dashed #dbe3ee;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`,ki=h.div`
  font-size: 12px;
  color: #334155;
  strong {
    color: #0f172a;
  }
`,Ai=h.button`
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 7px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`,ji=h.button`
  background: #2d6a9f;
  color: #fff;
  border: none;
  border-radius: 10px;
  height: 44px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`,Mi=h.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: ${e=>e.$type===`success`?`#065f46`:`#991b1b`};
  color: #fff;
  border-radius: 10px;
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 600;
`;function Ni({value:e,onChange:t,options:n,placeholder:r,disabled:i}){let[a,o]=(0,_.useState)(!1),[s,c]=(0,_.useState)(0),l=(0,_.useMemo)(()=>n.filter(t=>t.toLowerCase().includes(e.toLowerCase())).slice(0,100),[n,e]);return(0,x.jsxs)(yi,{children:[(0,x.jsx)(`input`,{type:`text`,value:e,placeholder:r,disabled:i,style:{border:`1.5px solid #e2e8f0`,borderRadius:9,padding:`10px 12px`,fontSize:14,width:`100%`,boxSizing:`border-box`},onChange:e=>{t(e.target.value),o(!0),c(0)},onFocus:()=>o(!0),onKeyDown:e=>{a&&(e.key===`ArrowDown`&&(c(e=>Math.min(e+1,l.length-1)),e.preventDefault()),e.key===`ArrowUp`&&(c(e=>Math.max(e-1,0)),e.preventDefault()),e.key===`Enter`&&l[s]&&(t(l[s]),o(!1),e.preventDefault()),e.key===`Escape`&&o(!1))}}),a&&l.length>0&&(0,x.jsx)(bi,{children:l.map((e,n)=>(0,x.jsx)(xi,{$active:n===s,onMouseDown:n=>{n.preventDefault(),t(e),o(!1)},children:e},e))})]})}var Pi=[{key:`ziraat`,name:`Ziraat Bankası`,short:`ZB`,start:`#b91c1c`,end:`#ef4444`},{key:`isbank`,name:`İş Bankası`,short:`İŞ`,start:`#1d4ed8`,end:`#60a5fa`},{key:`garanti`,name:`Garanti BBVA`,short:`GB`,start:`#047857`,end:`#34d399`},{key:`yapikredi`,name:`Yapı Kredi`,short:`YK`,start:`#1e3a8a`,end:`#2563eb`},{key:`akbank`,name:`Akbank`,short:`AK`,start:`#991b1b`,end:`#f87171`},{key:`vakifbank`,name:`VakıfBank`,short:`VB`,start:`#a16207`,end:`#fbbf24`},{key:`halkbank`,name:`Halkbank`,short:`HB`,start:`#065f46`,end:`#10b981`},{key:`qnb`,name:`QNB`,short:`QN`,start:`#581c87`,end:`#a855f7`},{key:`denizbank`,name:`DenizBank`,short:`DB`,start:`#0f172a`,end:`#334155`}],X=e=>e??``;function Fi(e){return{supplier_website:X(e.supplier.website),address:X(e.supplier.address),city:X(e.supplier.city),address_district:X(e.supplier.address_district),postal_code:X(e.supplier.postal_code),tax_number:X(e.supplier.tax_number),tax_office:X(e.supplier.tax_office),registration_number:X(e.supplier.registration_number),invoice_name:X(e.supplier.invoice_name),invoice_address:X(e.supplier.invoice_address),invoice_city:X(e.supplier.invoice_city),invoice_district:X(e.supplier.invoice_district),invoice_postal_code:X(e.supplier.invoice_postal_code),notes:X(e.supplier.notes),payment_accounts:(e.supplier.payment_accounts??[]).map(e=>({id:e.id,bank_key:e.bank_key,bank_name:e.bank_name,iban:e.iban,account_type:e.account_type})),accepts_checks:!!e.supplier.accepts_checks,preferred_check_term:X(e.supplier.preferred_check_term),user_name:X(e.user.name),user_phone:X(e.user.phone),user_email:X(e.user.email)}}function Ii(){let e=m(),t=(0,_.useRef)(null),[n,r]=(0,_.useState)(!0),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)(!1),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)({invoice:!1,address:!1,payment:!1,notes:!1}),[h,g]=(0,_.useState)({pending:!1,pendingEmail:null}),[v,y]=(0,_.useState)(null),[b,S]=(0,_.useState)(null),[C,w]=(0,_.useState)({name:``,email:``,phone:``}),[T,E]=(0,_.useState)(null),[D,O]=(0,_.useState)(null),[k,A]=(0,_.useState)(null),[j,M]=(0,_.useState)(null),[N,P]=(0,_.useState)(!0),[F,I]=(0,_.useState)(!0),R=(0,_.useCallback)((e,t)=>{y({msg:e,type:t}),setTimeout(()=>y(null),3500)},[]),z=(0,_.useCallback)(async()=>{try{r(!0);let[e,t]=await Promise.all([Le(),Ge()]);l(e),d(Fi(e)),g({pending:t.pending,pendingEmail:t.pending_email})}catch{R(`Profil yüklenemedi`,`error`)}finally{r(!1)}},[R]);(0,_.useEffect)(()=>{if(!L()){e(`/supplier/login`,{replace:!0});return}z()},[z,e]);let B=(0,_.useMemo)(()=>Ir(),[]),V=(0,_.useMemo)(()=>u?.invoice_city?Lr(u.invoice_city):[],[u?.invoice_city]),ee=(0,_.useMemo)(()=>u?.city?Lr(u.city):[],[u?.city]),H=(e,t)=>d(n=>n&&{...n,[e]:t}),te=e=>{p(t=>({...t,[e]:!t[e]}))},ne=()=>{d(e=>e&&{...e,payment_accounts:[...e.payment_accounts,{bank_key:Pi[0].key,bank_name:Pi[0].name,iban:``,account_type:`tl`}]})},U=(e,t)=>{d(n=>{if(!n)return n;let r=n.payment_accounts.map((n,r)=>r===e?{...n,...t}:n);return{...n,payment_accounts:r}})},re=e=>{d(t=>t&&{...t,payment_accounts:t.payment_accounts.filter((t,n)=>n!==e)})},W=(0,_.useMemo)(()=>{let e=c?.supplier.logo_url;return e?e.startsWith(`http`)?e:`http://127.0.0.1:8000${e}`:null},[c?.supplier.logo_url]),ie=c?.supplier.authorized_users??[],ae=c?c.user.id===c.supplier.default_user_id:!1,oe=e=>{S(e.id),w({name:e.name,email:e.email,phone:e.phone??``})},se=async e=>{try{await Ke(e,C),R(`Yetkili güncellendi`,`success`),S(null),await z()}catch(e){let t=e?.response?.data?.detail;R(t||`Yetkili güncellenemedi`,`error`)}},G=async e=>{if(window.confirm(`Bu yetkiliyi silmek istediğinize emin misiniz?`))try{await qe(e),R(`Yetkili silindi`,`success`),await z()}catch(e){let t=e?.response?.data?.detail;R(t||`Yetkili silinemedi`,`error`)}},ce=(0,_.useCallback)(async(e,t)=>{let[n,r,i]=t;if(!i){R(`Önce şehir / il bilgisini girin.`,`error`);return}let a=[n,r,i,`Türkiye`].filter(Boolean).join(`, `),o=`https://maps.google.com/maps?output=embed&t=k&q=${encodeURIComponent(a)}`,s=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;e===`firma`?(E(o),A(s)):(O(o),M(s))},[R]);return(0,_.useEffect)(()=>{u?.city&&(T||ce(`firma`,[u.address,u.address_district,u.city]))},[u?.address,u?.address_district,u?.city,T,ce]),(0,_.useEffect)(()=>{u?.invoice_city&&(D||ce(`fatura`,[u.invoice_address,u.invoice_district,u.invoice_city]))},[u?.invoice_address,u?.invoice_district,u?.invoice_city,D,ce]),n||!c||!u?(0,x.jsxs)(Rr,{children:[(0,x.jsx)(zr,{children:(0,x.jsx)(Br,{children:(0,x.jsx)(`h1`,{children:`Profilim`})})}),(0,x.jsx)(Hr,{children:(0,x.jsx)(Ur,{style:{textAlign:`center`,color:`#64748b`},children:`Yükleniyor...`})})]}):(0,x.jsxs)(Rr,{children:[(0,x.jsxs)(zr,{children:[(0,x.jsxs)(Br,{children:[(0,x.jsx)(`h1`,{children:`Profilim`}),(0,x.jsx)(`span`,{children:c.supplier.company_name})]}),(0,x.jsx)(Vr,{onClick:()=>e(`/supplier/dashboard`),children:`← Panele Dön`})]}),(0,x.jsxs)(Hr,{children:[(0,x.jsxs)(Wr,{children:[(0,x.jsxs)(Gr,{children:[(0,x.jsx)(Kr,{$hasLogo:!!W,onClick:()=>t.current?.click(),title:`Tıklayarak logo yükleyin`,children:W?(0,x.jsx)(`img`,{src:W,alt:`Logo`}):(0,x.jsxs)(qr,{children:[(0,x.jsx)(`span`,{children:`🏢`}),`Logo`]})}),(0,x.jsx)(Yr,{onClick:()=>t.current?.click(),disabled:o,children:o?`⏳ Yükleniyor...`:`📷 Logo Yükle`})]}),(0,x.jsxs)(Jr,{children:[(0,x.jsxs)(Xr,{children:[(0,x.jsxs)(Zr,{children:[(0,x.jsx)(Qr,{children:(0,x.jsx)($r,{children:`Şirket Yetkilisi`})}),(0,x.jsx)(`input`,{value:u.user_name,onChange:e=>H(`user_name`,e.target.value),placeholder:`Yetkili adı`})]}),(0,x.jsxs)(Zr,{children:[(0,x.jsx)(Qr,{children:(0,x.jsx)($r,{children:`Yetkili Telefonu`})}),(0,x.jsx)(`input`,{value:u.user_phone,onChange:e=>H(`user_phone`,e.target.value),placeholder:`0 (5xx) xxx xx xx`})]}),(0,x.jsxs)(Zr,{children:[(0,x.jsxs)(Qr,{children:[(0,x.jsx)($r,{children:`Yetkili E-posta`}),(0,x.jsx)(ni,{children:(0,x.jsx)(ri,{$pending:h.pending,children:h.pending||!c.user.email_verified?`Beklemede`:`Onaylandı`})})]}),(0,x.jsx)(`input`,{value:u.user_email,onChange:e=>H(`user_email`,e.target.value),placeholder:`ornek@firma.com`})]})]}),(0,x.jsxs)(ti,{children:[`E-posta değişikliğinde yeni adrese doğrulama maili gönderilir.`,h.pending&&h.pendingEmail?` Bekleyen onay: ${h.pendingEmail}`:``]}),(0,x.jsxs)(ti,{children:[`Şirkette toplam `,c.supplier.authorized_users_count,` yetkili bulunuyor.`]}),(0,x.jsx)(Di,{children:ie.map(e=>(0,x.jsx)(Oi,{children:b===e.id?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`input`,{value:C.name,onChange:e=>w(t=>({...t,name:e.target.value})),style:{border:`1px solid #cbd5e1`,borderRadius:8,padding:`7px 8px`,fontSize:12}}),(0,x.jsx)(`input`,{value:C.phone,onChange:e=>w(t=>({...t,phone:e.target.value})),style:{border:`1px solid #cbd5e1`,borderRadius:8,padding:`7px 8px`,fontSize:12}}),(0,x.jsx)(`input`,{value:C.email,onChange:e=>w(t=>({...t,email:e.target.value})),style:{border:`1px solid #cbd5e1`,borderRadius:8,padding:`7px 8px`,fontSize:12}}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(Ai,{type:`button`,onClick:()=>void se(e.id),children:`Kaydet`}),(0,x.jsx)(Ai,{type:`button`,onClick:()=>S(null),children:`Vazgeç`})]})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(ki,{children:[(0,x.jsx)(`strong`,{children:e.name}),e.is_default?` (Varsayılan)`:``]}),(0,x.jsx)(ki,{children:e.phone||`-`}),(0,x.jsx)(ki,{children:e.email}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:6,justifyContent:`flex-end`},children:ae&&!e.is_default&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Ai,{type:`button`,onClick:()=>oe(e),children:`Düzenle`}),(0,x.jsx)(Ai,{type:`button`,onClick:()=>void G(e.id),children:`Sil`})]})})]})},e.id))}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=certificates`),children:`🏅 Sertifika Yükle`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=company_docs`),children:`📁 Şirket Evrakları`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=personnel_docs`),children:`👥 Personel Evrakları`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/finance`),children:`💳 Finans Modülü`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=guarantee_docs`),children:`🛡️ Alınan Teminatlar`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=contracts`),children:`📄 Sözleşmelerim`}),(0,x.jsx)(ei,{onClick:()=>e(`/supplier/workspace?tab=offers`),children:`💬 Tekliflerim`})]}),(0,x.jsx)(ti,{children:`Evraklar bu ekranda listelenmez; ilgili sekmede goruntulenir.`})]}),(0,x.jsx)(`input`,{ref:t,type:`file`,accept:`image/jpeg,image/png,image/webp,image/svg+xml`,style:{display:`none`},onChange:async e=>{let t=e.target.files?.[0];if(t)try{s(!0);let e=await ze(t);l(t=>t&&{...t,supplier:{...t.supplier,logo_url:e.logo_url}}),R(`Logo güncellendi`,`success`)}catch(e){let t=e?.response?.data?.detail;R(t||`Logo yüklenemedi`,`error`)}finally{s(!1),e.target.value=``}}})]}),(0,x.jsxs)(Ur,{children:[(0,x.jsxs)(hi,{$open:f.invoice,onClick:()=>te(`invoice`),children:[(0,x.jsx)(`h3`,{children:`Fatura ve Vergi Bilgileri`}),(0,x.jsx)(`span`,{children:`⌄`})]}),f.invoice&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(gi,{children:[(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Firma Fatura Ünvanı`}),(0,x.jsx)(`input`,{value:u.invoice_name,onChange:e=>H(`invoice_name`,e.target.value)})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Vergi Dairesi`}),(0,x.jsx)(`input`,{value:u.tax_office,onChange:e=>H(`tax_office`,e.target.value)})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Vergi Numarası`}),(0,x.jsx)(`input`,{value:u.tax_number,onChange:e=>H(`tax_number`,e.target.value)})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Ticaret Sicil No`}),(0,x.jsx)(`input`,{value:u.registration_number,onChange:e=>H(`registration_number`,e.target.value)})]}),(0,x.jsx)(_i,{children:(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Fatura Adresi`}),(0,x.jsx)(`input`,{value:u.invoice_address,onChange:e=>H(`invoice_address`,e.target.value)})]})}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Fatura İli`}),(0,x.jsx)(Ni,{value:u.invoice_city,onChange:e=>H(`invoice_city`,e),options:B})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Fatura İlçesi`}),(0,x.jsx)(Ni,{value:u.invoice_district,onChange:e=>H(`invoice_district`,e),options:V,disabled:!u.invoice_city})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Fatura Posta Kodu`}),(0,x.jsx)(`input`,{value:u.invoice_postal_code,onChange:e=>H(`invoice_postal_code`,e.target.value)})]})]}),(0,x.jsx)(Si,{onClick:()=>{D||ce(`fatura`,[u.invoice_address,u.invoice_district,u.invoice_city]),I(e=>!e)},children:F?`Fatura Konumunu Gizle`:`Fatura Konumunu Aç`}),F&&D&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Ci,{src:D,title:`Fatura Konumu`,loading:`lazy`,allowFullScreen:!0}),j&&(0,x.jsxs)(wi,{children:[(0,x.jsx)(Ti,{href:j,target:`_blank`,rel:`noreferrer`,children:`🗺️ Google Maps'te Aç`}),(0,x.jsx)(Ti,{href:`https://wa.me/?text=${encodeURIComponent(`Fatura konumu: ${j}`)}`,target:`_blank`,rel:`noreferrer`,children:`📲 WhatsApp ile Paylaş`})]})]})]})]}),(0,x.jsxs)(Ur,{children:[(0,x.jsxs)(hi,{$open:f.address,onClick:()=>te(`address`),children:[(0,x.jsx)(`h3`,{children:`Firma Adresi ve Web`}),(0,x.jsx)(`span`,{children:`⌄`})]}),f.address&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(gi,{children:[(0,x.jsx)(_i,{children:(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Adres`}),(0,x.jsx)(`input`,{value:u.address,onChange:e=>H(`address`,e.target.value)})]})}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Şehir / İl`}),(0,x.jsx)(Ni,{value:u.city,onChange:e=>H(`city`,e),options:B})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`İlçe`}),(0,x.jsx)(Ni,{value:u.address_district,onChange:e=>H(`address_district`,e),options:ee,disabled:!u.city})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Posta Kodu`}),(0,x.jsx)(`input`,{value:u.postal_code,onChange:e=>H(`postal_code`,e.target.value)})]}),(0,x.jsx)(_i,{children:(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Web Sitesi`}),(0,x.jsx)(`input`,{value:u.supplier_website,onChange:e=>H(`supplier_website`,e.target.value)})]})})]}),(0,x.jsx)(Si,{onClick:()=>{T||ce(`firma`,[u.address,u.address_district,u.city]),P(e=>!e)},children:N?`Firma Konumunu Gizle`:`Firma Konumunu Aç`}),N&&T&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Ci,{src:T,title:`Firma Konumu`,loading:`lazy`,allowFullScreen:!0}),k&&(0,x.jsxs)(wi,{children:[(0,x.jsx)(Ti,{href:k,target:`_blank`,rel:`noreferrer`,children:`🗺️ Google Maps'te Aç`}),(0,x.jsx)(Ti,{href:`https://wa.me/?text=${encodeURIComponent(`Firma konumu: ${k}`)}`,target:`_blank`,rel:`noreferrer`,children:`📲 WhatsApp ile Paylaş`})]})]})]})]}),(0,x.jsxs)(Ur,{children:[(0,x.jsxs)(hi,{$open:f.payment,onClick:()=>te(`payment`),children:[(0,x.jsx)(`h3`,{children:`Ödeme Bilgileri`}),(0,x.jsx)(`span`,{children:`⌄`})]}),f.payment&&(0,x.jsxs)(ii,{children:[(0,x.jsx)(ti,{children:`Firma için birden fazla banka hesabı ekleyebilir, hesapları TL ve Döviz olarak ayırabilir ve çek vadelerini tanımlayabilirsiniz.`}),u.payment_accounts.length===0&&(0,x.jsx)(Ur,{style:{padding:16,background:`#f8fafc`,boxShadow:`none`},children:`Henüz ödeme hesabı eklenmedi.`}),u.payment_accounts.map((e,t)=>(0,x.jsxs)(ai,{children:[(0,x.jsxs)(oi,{children:[(0,x.jsxs)(`h4`,{children:[`Hesap `,t+1]}),(0,x.jsx)(ci,{type:`button`,onClick:()=>re(t),children:`Hesabı Sil`})]}),(0,x.jsxs)(gi,{children:[(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Hesap Türü`}),(0,x.jsxs)(pi,{value:e.account_type,onChange:e=>U(t,{account_type:e.target.value}),children:[(0,x.jsx)(`option`,{value:`tl`,children:`TL`}),(0,x.jsx)(`option`,{value:`doviz`,children:`Döviz`})]})]}),(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`IBAN`}),(0,x.jsx)(`input`,{value:e.iban,onChange:e=>U(t,{iban:e.target.value.toUpperCase()}),placeholder:`TR00 0000 0000 0000 0000 0000 00`})]}),(0,x.jsxs)(_i,{children:[(0,x.jsx)(`span`,{style:{display:`block`,marginBottom:8,fontSize:12,fontWeight:700,color:`#475569`,textTransform:`uppercase`},children:`Banka Seçimi`}),(0,x.jsx)(li,{children:Pi.map(n=>(0,x.jsxs)(ui,{type:`button`,$active:e.bank_key===n.key,$start:n.start,$end:n.end,onClick:()=>U(t,{bank_key:n.key,bank_name:n.name}),children:[(0,x.jsx)(di,{$start:n.start,$end:n.end,children:n.short}),(0,x.jsxs)(fi,{children:[(0,x.jsx)(`strong`,{children:n.name}),(0,x.jsxs)(`span`,{children:[n.short,` hesabı`]})]})]},n.key))})]})]})]},`${e.bank_key||`bank`}-${t}`)),(0,x.jsx)(`div`,{children:(0,x.jsx)(si,{type:`button`,onClick:ne,children:`+ Yeni Hesap Ekle`})}),(0,x.jsxs)(ai,{children:[(0,x.jsx)(oi,{children:(0,x.jsx)(`h4`,{children:`Çek Vadeleri`})}),(0,x.jsxs)(gi,{children:[(0,x.jsx)(_i,{children:(0,x.jsxs)(mi,{children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:u.accepts_checks,onChange:e=>d(t=>t&&{...t,accepts_checks:e.target.checked,preferred_check_term:e.target.checked?t.preferred_check_term:``})}),`Firma çek kabul ediyor`]})}),u.accepts_checks&&(0,x.jsx)(_i,{children:(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Tercih Edilen Çek Vadesi`}),(0,x.jsx)(`input`,{value:u.preferred_check_term,onChange:e=>H(`preferred_check_term`,e.target.value),placeholder:`Örn: 30 gün, 45 gün, ay sonu + 30`})]})})]})]})]})]}),(0,x.jsxs)(Ur,{children:[(0,x.jsxs)(hi,{$open:f.notes,onClick:()=>te(`notes`),children:[(0,x.jsx)(`h3`,{children:`Önemli Notlar`}),(0,x.jsx)(`span`,{children:`⌄`})]}),f.notes&&(0,x.jsxs)(vi,{children:[(0,x.jsx)(`span`,{children:`Notlar`}),(0,x.jsx)(`textarea`,{value:u.notes,onChange:e=>H(`notes`,e.target.value)})]})]}),(0,x.jsx)(Ei,{children:(0,x.jsx)(ji,{onClick:async()=>{if(!(!u||!c))try{a(!0);let e=c.user.email.trim().toLowerCase(),t=u.user_email.trim().toLowerCase();R((await Re({supplier_website:u.supplier_website,address:u.address,city:u.city,address_district:u.address_district,postal_code:u.postal_code,tax_number:u.tax_number,tax_office:u.tax_office,registration_number:u.registration_number,invoice_name:u.invoice_name,invoice_address:u.invoice_address,invoice_city:u.invoice_city,invoice_district:u.invoice_district,invoice_postal_code:u.invoice_postal_code,notes:u.notes,payment_accounts:u.payment_accounts.map(e=>({bank_key:e.bank_key,bank_name:e.bank_name,iban:e.iban,account_type:e.account_type})),accepts_checks:u.accepts_checks,preferred_check_term:u.accepts_checks?u.preferred_check_term:``,user_name:u.user_name,user_phone:u.user_phone})).message||`Profil kaydedildi`,`success`),t&&t!==e&&(await Ue(t),R(`Yeni e-posta adresine doğrulama linki gönderildi.`,`success`)),await z()}catch(e){let t=e?.response?.data?.detail;R(t||`Kaydetme başarısız`,`error`)}finally{a(!1)}},disabled:i,children:i?`⏳ Kaydediliyor...`:`💾 Profili Kaydet`})})]}),v&&(0,x.jsx)(Mi,{$type:v.type,children:v.msg})]})}var Li=h.div`
  max-width: 1100px;
  margin: 28px auto;
  padding: 0 16px 50px;
  display: grid;
  gap: 16px;
`,Ri=h.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
`,zi=h.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`,Bi=h.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`,Vi=h.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: #334155;
`,Hi=h.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
`,Ui=h.button`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
`,Wi=h(Ui)`
  border: 0;
  background: #2563eb;
  color: #fff;
`,Gi=h.div`
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  color: ${e=>e.$error?`#991b1b`:`#065f46`};
  background: ${e=>e.$error?`#fee2e2`:`#d1fae5`};
`;function Ki(){let e=m(),[t,n]=(0,_.useState)(!0),[r,i]=(0,_.useState)(null),[a,o]=(0,_.useState)(null),[s,c]=(0,_.useState)(null),[l,u]=(0,_.useState)(``),[d,f]=(0,_.useState)(``),[p,h]=(0,_.useState)(``),[g,v]=(0,_.useState)(``),[y,b]=(0,_.useState)(``),[S,C]=(0,_.useState)(``),[w,T]=(0,_.useState)(null),[E,D]=(0,_.useState)(``),[O,k]=(0,_.useState)(``),[A,j]=(0,_.useState)(``),[M,N]=(0,_.useState)(``),[P,F]=(0,_.useState)(null),I=(0,_.useCallback)(async()=>{c(await Ye({query:l||void 0,date_from:d||void 0,date_to:p||void 0}))},[l,d,p]);(0,_.useEffect)(()=>{if(!L()){e(`/supplier/login`,{replace:!0});return}(async()=>{try{n(!0),await I()}catch{i(`Finans verileri yuklenemedi`)}finally{n(!1)}})()},[e,I]);async function R(){let e=Number(y);if(!(!g||!Number.isFinite(e)||e<=0))try{await Xe({title:g,amount:e,invoice_date:S||void 0,file:w||void 0}),v(``),b(``),C(``),T(null),await I(),o(`Fatura eklendi`),i(null)}catch{i(`Fatura eklenemedi`)}}async function z(){let e=Number(O);if(!(!E||!Number.isFinite(e)||e<=0))try{await Ze({title:E,amount:e,payment_date:A||void 0}),D(``),k(``),j(``),await I(),o(`Odeme eklendi`),i(null)}catch{i(`Odeme eklenemedi`)}}async function B(){if(!(!M||!P))try{await Qe({title:M,file:P}),N(``),F(null),await I(),o(`Is fotografi eklendi`),i(null)}catch{i(`Is fotografi eklenemedi`)}}async function V(e,t){let n=window.prompt(`Fatura basligi`,t.title);if(!n)return;let r=window.prompt(`Fatura tutari`,String(t.amount));if(!r)return;let i=Number(r);!Number.isFinite(i)||i<=0||(await $e(e,{title:n,amount:i,invoice_date:window.prompt(`Fatura tarihi (YYYY-MM-DD)`,t.invoice_date||``)||void 0}),await I())}async function ee(e){window.confirm(`Fatura silinsin mi?`)&&(await et(e),await I())}async function H(e,t){let n=window.prompt(`Odeme basligi`,t.title);if(!n)return;let r=window.prompt(`Odeme tutari`,String(t.amount));if(!r)return;let i=Number(r);!Number.isFinite(i)||i<=0||(await tt(e,{title:n,amount:i,payment_date:window.prompt(`Odeme tarihi (YYYY-MM-DD)`,t.payment_date||``)||void 0}),await I())}async function te(e){window.confirm(`Odeme silinsin mi?`)&&(await nt(e),await I())}async function ne(e,t){let n=window.prompt(`Fotograf basligi`,t.title);n&&(await rt(e,{title:n,description:window.prompt(`Aciklama`,t.description||``)||void 0}),await I())}async function U(e){window.confirm(`Fotograf silinsin mi?`)&&(await it(e),await I())}return t?(0,x.jsx)(Li,{children:`Yukleniyor...`}):(0,x.jsxs)(Li,{children:[r&&(0,x.jsx)(Gi,{$error:!0,children:r}),a&&(0,x.jsx)(Gi,{children:a}),(0,x.jsxs)(Ri,{children:[(0,x.jsxs)(zi,{children:[(0,x.jsx)(`h2`,{style:{margin:0},children:`Finans Modulu`}),(0,x.jsx)(Ui,{type:`button`,onClick:()=>e(`/supplier/profile`),children:`Profile Don`})]}),!!s?.alerts?.length&&(0,x.jsx)(Gi,{$error:!0,style:{marginTop:10},children:s.alerts.join(` `)})]}),(0,x.jsx)(Ri,{children:(0,x.jsxs)(Bi,{children:[(0,x.jsxs)(Vi,{children:[`Sozlesme Toplami`,(0,x.jsx)(Hi,{readOnly:!0,value:(s?.totals.contract_total??0).toLocaleString(`tr-TR`)})]}),(0,x.jsxs)(Vi,{children:[`Fatura Toplami`,(0,x.jsx)(Hi,{readOnly:!0,value:(s?.totals.invoice_total??0).toLocaleString(`tr-TR`)})]}),(0,x.jsxs)(Vi,{children:[`Odeme Toplami`,(0,x.jsx)(Hi,{readOnly:!0,value:(s?.totals.payment_total??0).toLocaleString(`tr-TR`)})]})]})}),(0,x.jsxs)(Ri,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Filtrele`}),(0,x.jsxs)(Bi,{children:[(0,x.jsxs)(Vi,{children:[`Arama`,(0,x.jsx)(Hi,{value:l,onChange:e=>u(e.target.value),placeholder:`Baslik, tutar, not`})]}),(0,x.jsxs)(Vi,{children:[`Tarih Baslangic`,(0,x.jsx)(Hi,{type:`date`,value:d,onChange:e=>f(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Tarih Bitis`,(0,x.jsx)(Hi,{type:`date`,value:p,onChange:e=>h(e.target.value)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(Ui,{type:`button`,onClick:()=>void I(),children:`Filtrele`})})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Fatura Ekle`}),(0,x.jsxs)(Bi,{children:[(0,x.jsxs)(Vi,{children:[`Fatura Basligi`,(0,x.jsx)(Hi,{value:g,onChange:e=>v(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Fatura Tutari`,(0,x.jsx)(Hi,{type:`number`,value:y,onChange:e=>b(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Fatura Tarihi`,(0,x.jsx)(Hi,{type:`date`,value:S,onChange:e=>C(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Fatura Dosyasi`,(0,x.jsx)(Hi,{type:`file`,onChange:e=>T(e.target.files?.[0]||null)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(Wi,{type:`button`,onClick:()=>void R(),children:`Fatura Ekle`})})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Odeme Ekle`}),(0,x.jsxs)(Bi,{children:[(0,x.jsxs)(Vi,{children:[`Odeme Basligi`,(0,x.jsx)(Hi,{value:E,onChange:e=>D(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Odeme Tutari`,(0,x.jsx)(Hi,{type:`number`,value:O,onChange:e=>k(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Odeme Tarihi`,(0,x.jsx)(Hi,{type:`date`,value:A,onChange:e=>j(e.target.value)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(Wi,{type:`button`,onClick:()=>void z(),children:`Odeme Ekle`})})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Is Fotografi Ekle`}),(0,x.jsxs)(Bi,{children:[(0,x.jsxs)(Vi,{children:[`Fotograf Basligi`,(0,x.jsx)(Hi,{value:M,onChange:e=>N(e.target.value)})]}),(0,x.jsxs)(Vi,{children:[`Is Fotografi`,(0,x.jsx)(Hi,{type:`file`,accept:`image/*`,onChange:e=>F(e.target.files?.[0]||null)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(Wi,{type:`button`,onClick:()=>void B(),children:`Fotograf Ekle`})})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Faturalar (`,s?.invoices.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(s?.invoices||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsxs)(`span`,{children:[e.title,` - `,e.amount.toLocaleString(`tr-TR`),` `,e.currency]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(Ui,{type:`button`,onClick:()=>void V(e.id,e),children:`Duzenle`}),(0,x.jsx)(Ui,{type:`button`,onClick:()=>void ee(e.id),children:`Sil`})]})]},e.id)),(s?.invoices||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Odemeler (`,s?.payments.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(s?.payments||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsxs)(`span`,{children:[e.title,` - `,e.amount.toLocaleString(`tr-TR`),` `,e.currency]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(Ui,{type:`button`,onClick:()=>void H(e.id,e),children:`Duzenle`}),(0,x.jsx)(Ui,{type:`button`,onClick:()=>void te(e.id),children:`Sil`})]})]},e.id)),(s?.payments||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]}),(0,x.jsxs)(Ri,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Is Fotograflari (`,s?.photos.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(s?.photos||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsx)(`a`,{href:e.file_url,target:`_blank`,rel:`noreferrer`,children:e.title}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(Ui,{type:`button`,onClick:()=>void ne(e.id,e),children:`Duzenle`}),(0,x.jsx)(Ui,{type:`button`,onClick:()=>void U(e.id),children:`Sil`})]})]},e.id)),(s?.photos||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]})]})}var qi=h.div`
  padding: 20px;
`,Ji=h.div`
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #1f2937;
  }

  p {
    color: #6b7280;
    margin: 5px 0 0 0;
  }
`,Yi=h.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`,Xi=h.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`,Zi=h.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  background-color: ${e=>{switch(e.variant){case`success`:return`#10b981`;case`secondary`:return`#6b7280`;default:return`#3b82f6`}}};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`,Qi=h.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${e=>{switch(e.status){case`tasarı`:return`#f3f4f6`;case`gönderilen`:return`#fef3c7`;case`revize_edildi`:return`#ffedd5`;case`yanıtlandı`:return`#d1fae5`;case`reddedildi`:case`kapatildi`:case`kapatıldı`:case`kapatildi_yuksek_fiyat`:case`kapatıldı_yüksek_fiyat`:return`#fee2e2`;default:return`#f3f4f6`}}};
  color: ${e=>{switch(e.status){case`tasarı`:return`#374151`;case`gönderilen`:return`#92400e`;case`revize_edildi`:return`#9a3412`;case`yanıtlandı`:return`#065f46`;case`reddedildi`:case`kapatildi`:case`kapatıldı`:case`kapatildi_yuksek_fiyat`:case`kapatıldı_yüksek_fiyat`:return`#991b1b`;default:return`#374151`}}};
`,$i=h.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
`,ea=h.div`
  display: flex;
  flex-direction: column;
`,ta=h.label`
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 13px;
`,na=h.input`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`,ra=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,ia=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,aa=h.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
`;function oa({apiUrl:e,authToken:t}){let[n,r]=(0,_.useState)([]),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)({}),[m,h]=(0,_.useState)(null),[g,v]=(0,_.useState)(null),[y,b]=(0,_.useState)(`pending`),S=e=>String(e||``).toLowerCase(),C=e=>{let t=S(e.quote_status),n=S(e.status);return n===`revize_edildi`?!1:t===`approved`||t===`rejected`||n===`reddedildi`||n===`kapatildi`||n===`kapatıldı`||n===`kapatildi_yuksek_fiyat`||n===`kapatıldı_yüksek_fiyat`},w=e=>S(e.status)===`yanıtlandı`&&!C(e),T=e=>{if(C(e)||w(e))return!1;let t=S(e.status);return t===`gönderilen`||t===`tasarı`||t===`revize_edildi`||!t},E=e=>{let t=S(e.quote_status);return t===`approved`?e.selected_supplier_id&&e.selected_supplier_id!==e.supplier_id?`Fiyatınız yüksek bulunduğu için sözleşme başka tedarikçi ile yapıldı.`:e.selected_supplier_id&&e.selected_supplier_id===e.supplier_id?`Teklifiniz onaylandı. Sözleşme süreci başlatılacaktır.`:`Bu teklif yönetici tarafından onaylanarak kapatıldı.`:t===`rejected`?`İş kapsamı değişikliği veya red nedeniyle teklif kapatıldı.`:`Teklif kapatıldı.`},D=n.filter(T),O=n.filter(w),k=n.filter(C),A=(0,_.useCallback)(async()=>{try{a(!0),s(null);let n=await fetch(`${e}/api/v1/supplier-quotes/me`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok){let e=(await n.json().catch(()=>({})))?.detail||`Teklif listesi yüklenemedi`;throw Error(e)}r(await n.json())}catch(e){s(e instanceof Error?e.message:`Teklif listesi yüklenemedi`),console.error(`Error loading quotes:`,e)}finally{a(!1)}},[e,t]);(0,_.useEffect)(()=>{A()},[A]);function j(e){f[e.id]||p(t=>({...t,[e.id]:{items:e.items.filter(e=>!e.is_group_header).map(e=>({quote_item_id:e.quote_item_id,unit_price:e.supplier_unit_price||0,total_price:e.supplier_total_price||0,notes:e.notes||``})),total_amount:e.total_amount,discount_percent:0,discount_amount:0,final_amount:e.final_amount,payment_terms:e.payment_terms||``,delivery_time:e.delivery_time||0,warranty:e.warranty||``}}))}async function M(n){try{h(n);let r=f[n],i=await fetch(`${e}/api/v1/supplier-quotes/${n}/draft-save`,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/json`},body:JSON.stringify(r)});if(!i.ok){let e=await i.json();throw Error(e.detail||`Taslak kaydedilemedi`)}l(`✅ Taslak kaydedildi`),window.alert(`Teklif taslağı kaydedildi.`),setTimeout(()=>l(null),3e3)}catch(e){s(String(e))}finally{h(null)}}async function N(n){try{h(n);let r=f[n],i=await fetch(`${e}/api/v1/supplier-quotes/${n}/submit`,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/json`},body:JSON.stringify(r)});if(!i.ok){let e=await i.json();throw Error(e.detail||`Teklif gönderilemedi`)}l(`✅ Teklif başarıyla gönderildi. Yönetici panelinde ilgili teklif detayında görülebilir.`),window.alert(`Teklif gönderildi. Yönetici panelinde ilgili teklif detayında görüntülenebilir.`),d(null),A(),setTimeout(()=>l(null),3e3)}catch(e){s(String(e))}finally{h(null)}}return i?(0,x.jsx)(qi,{children:`Yükleniyor...`}):(0,x.jsxs)(qi,{children:[(0,x.jsxs)(Ji,{children:[(0,x.jsx)(`h2`,{children:`📬 Teklif Yanıtları`}),(0,x.jsx)(`p`,{children:`Gönderilen tekliflere fiyat girerek yanıt verin`})]}),o&&(0,x.jsxs)(ra,{children:[`❌ `,o]}),c&&(0,x.jsx)(ia,{children:c}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:`0`,marginBottom:`16px`,borderBottom:`2px solid #e5e7eb`},children:[{key:`pending`,label:`Bekleyen`,count:D.length,activeColor:`#f59e0b`,activeBg:`#fffbeb`},{key:`submitted`,label:`Gönderilen`,count:O.length,activeColor:`#059669`,activeBg:`#f0fdf4`},{key:`closed`,label:`Kapanmış`,count:k.length,activeColor:`#dc2626`,activeBg:`#fef2f2`}].map(e=>(0,x.jsxs)(`button`,{onClick:()=>b(e.key),style:{padding:`10px 18px`,border:`none`,borderBottom:y===e.key?`3px solid ${e.activeColor}`:`3px solid transparent`,background:y===e.key?e.activeBg:`transparent`,cursor:`pointer`,fontWeight:y===e.key?700:500,fontSize:`14px`,color:y===e.key?e.activeColor:`#6b7280`,transition:`all 0.15s`,display:`flex`,alignItems:`center`,gap:`6px`},children:[e.label,(0,x.jsx)(`span`,{style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,minWidth:`20px`,height:`20px`,borderRadius:`999px`,padding:`0 6px`,fontSize:`11px`,fontWeight:700,background:y===e.key?e.activeColor:`#e5e7eb`,color:y===e.key?`#fff`:`#6b7280`},children:e.count})]},e.key))}),n.length===0?(0,x.jsx)(aa,{children:(0,x.jsx)(`p`,{children:`Henüz teklif alınmamış veya tüm tekliflere yanıt verilmiş`})}):y===`pending`?D.length===0?(0,x.jsx)(aa,{children:(0,x.jsx)(`p`,{children:`Bekleyen teklif yok.`})}):D.map(e=>{f[e.id]||j(e);let t=f[e.id],n=S(e.status)===`revize_edildi`;return(0,x.jsxs)(Yi,{children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,cursor:`pointer`,padding:`8px 0`},onClick:()=>d(u===e.id?null:e.id),children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{style:{margin:`0 0 5px 0`},children:e.quote_title}),(0,x.jsxs)(`p`,{style:{margin:`0`,fontSize:`13px`,color:`#6b7280`},children:[e.items.length,` kalem • Son Tarih:`,` `,new Date(e.created_at).toLocaleDateString(`tr-TR`)]})]}),(0,x.jsx)(Qi,{status:e.status,children:e.status})]}),u===e.id&&t&&(0,x.jsxs)(x.Fragment,{children:[n&&(0,x.jsx)(`div`,{style:{marginTop:`10px`,marginBottom:`8px`,padding:`10px 12px`,borderRadius:`6px`,background:`#fff7ed`,border:`1px solid #fdba74`,fontSize:`12px`,color:`#9a3412`},children:`Revize istendi. Eski fiyatlar sabit gösterilir, her kaleme yeni revize fiyat girilir.`}),(0,x.jsxs)(Xi,{style:{marginTop:`15px`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{children:`Kalem`}),(0,x.jsx)(`th`,{children:`Ünite`}),(0,x.jsx)(`th`,{children:`Miktar`}),(0,x.jsx)(`th`,{children:`Birim Fiyat`}),(0,x.jsx)(`th`,{children:`Birim Toplam Fiyat`}),(0,x.jsx)(`th`,{children:`KDV Tutar`}),(0,x.jsx)(`th`,{children:`KDV Dahil Toplam`}),(0,x.jsx)(`th`,{children:`Notlar`})]})}),(0,x.jsx)(`tbody`,{children:e.items.map((r,i)=>{let a=!!r.is_group_header,o=(r.line_number||``).split(`.`)[0],s=e.items.filter(e=>!e.is_group_header&&(e.line_number||``).startsWith(`${o}.`)),c=s.reduce((e,n)=>{let r=t.items.find(e=>e.quote_item_id===n.quote_item_id);return e+Number(r?.total_price||0)},0),l=s.reduce((e,n)=>{let r=t.items.find(e=>e.quote_item_id===n.quote_item_id);return e+Number(r?.total_price||0)*Number(n.vat_rate??20)/100},0);if(a)return(0,x.jsxs)(`tr`,{style:{background:`#fef3c7`,borderBottom:`2px solid #eab308`,fontWeight:700},children:[(0,x.jsxs)(`td`,{colSpan:3,style:{padding:`10px 12px`,color:`#92400e`,fontSize:`13px`,letterSpacing:`0.03em`},children:[(0,x.jsx)(`span`,{style:{background:`#f59e0b`,color:`#fff`,borderRadius:`999px`,padding:`2px 8px`,fontSize:`11px`,marginRight:`8px`,fontWeight:700},children:`Grup`}),r.description]}),(0,x.jsx)(`td`,{style:{padding:`10px 12px`,fontWeight:700,whiteSpace:`nowrap`},children:(0,x.jsx)(`span`,{style:{fontSize:`11px`,color:`#92400e`,fontWeight:700},children:`Grup Toplamı`})}),(0,x.jsx)(`td`,{style:{padding:`10px 12px`,fontWeight:700,whiteSpace:`nowrap`},children:(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`flex-start`,gap:`2px`},children:(0,x.jsxs)(`span`,{children:[`₺`,c.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})})}),(0,x.jsxs)(`td`,{style:{padding:`10px 12px`,fontWeight:700,whiteSpace:`nowrap`},children:[`₺`,l.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsxs)(`td`,{style:{padding:`10px 12px`,fontWeight:700,whiteSpace:`nowrap`},children:[`₺`,(c+l).toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(`td`,{style:{padding:`10px 12px`}})]},i);let u=t.items.findIndex(e=>e.quote_item_id===r.quote_item_id);if(u===-1)return null;let d=t.items[u],f=Number(r.vat_rate??20),m=d.total_price*(f/100),h=d.total_price+m;return(0,x.jsxs)(_.Fragment,{children:[(0,x.jsxs)(`tr`,{style:{background:`#fff`},children:[(0,x.jsx)(`td`,{style:{verticalAlign:`top`,paddingBottom:r.item_detail||r.item_image_url?`2px`:void 0},children:(0,x.jsx)(`div`,{style:{fontWeight:600},children:r.description})}),(0,x.jsx)(`td`,{children:r.unit}),(0,x.jsx)(`td`,{children:r.quantity.toLocaleString(`tr-TR`)}),(0,x.jsxs)(`td`,{children:[n&&(0,x.jsxs)(`div`,{style:{fontSize:`11px`,color:`#6b7280`,marginBottom:`4px`},children:[`Eski: ₺`,Number(r.supplier_unit_price||0).toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(na,{type:`number`,step:`0.01`,value:d.unit_price===0&&g===`${e.id}-${u}`?``:d.unit_price,onFocus:()=>v(`${e.id}-${u}`),onBlur:()=>v(t=>t===`${e.id}-${u}`?null:t),onChange:n=>{let i=[...t.items],a=n.target.value.trim(),o=a===``?0:parseFloat(a)||0;i[u].unit_price=o,i[u].total_price=i[u].unit_price*(r.quantity||0);let s=i.reduce((e,t)=>e+t.total_price,0);p(n=>({...n,[e.id]:{...t,items:i,total_amount:s,final_amount:s-(s*(t.discount_percent/100)||0)}}))},style:{width:`100%`}})]}),(0,x.jsxs)(`td`,{children:[n&&(0,x.jsxs)(`div`,{style:{fontSize:`11px`,color:`#6b7280`,marginBottom:`2px`},children:[`Eski: ₺`,Number(r.supplier_total_price||0).toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsxs)(`div`,{children:[`₺`,d.total_price.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})]}),(0,x.jsxs)(`td`,{children:[`₺`,m.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsxs)(`td`,{children:[`₺`,h.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(`td`,{children:(0,x.jsx)(na,{type:`text`,value:d.notes,placeholder:`Not...`,onChange:n=>{let r=[...t.items];r[u].notes=n.target.value,p(n=>({...n,[e.id]:{...t,items:r}}))},style:{width:`100%`}})})]}),(r.item_detail||r.item_image_url)&&(0,x.jsx)(`tr`,{style:{background:`#fafafa`},children:(0,x.jsx)(`td`,{colSpan:8,style:{paddingTop:`2px`,paddingBottom:`10px`,paddingLeft:`12px`},children:(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`14px`,alignItems:`flex-start`},children:[r.item_image_url&&(0,x.jsx)(`a`,{href:r.item_image_url,target:`_blank`,rel:`noopener noreferrer`,title:`Görseli yeni sekmede aç`,children:(0,x.jsx)(`img`,{src:r.item_image_url,alt:`Kalem görseli`,style:{width:`160px`,height:`110px`,objectFit:`cover`,borderRadius:`6px`,border:`1px solid #e5e7eb`,flexShrink:0}})}),r.item_detail&&(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#6b7280`,whiteSpace:`pre-wrap`,lineHeight:`1.5`},children:r.item_detail})]})})})]},i)})})]}),(0,x.jsxs)($i,{children:[(0,x.jsxs)(ea,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(ta,{children:`Toplam Tutar`}),(0,x.jsx)(na,{type:`number`,step:`0.01`,value:t.total_amount,onChange:n=>p(r=>({...r,[e.id]:{...t,total_amount:parseFloat(n.target.value)||0}}))})]}),(0,x.jsxs)(ea,{children:[(0,x.jsx)(ta,{children:`İndirim %`}),(0,x.jsx)(na,{type:`number`,step:`0.01`,min:`0`,max:`100`,value:t.discount_percent,onChange:n=>{let r=parseFloat(n.target.value)||0,i=t.total_amount*r/100;p(n=>({...n,[e.id]:{...t,discount_percent:r,discount_amount:i,final_amount:t.total_amount-i}}))}})]}),(0,x.jsxs)(ea,{children:[(0,x.jsx)(ta,{children:`İndirim Tutar`}),(0,x.jsx)(na,{type:`number`,step:`0.01`,value:t.discount_amount,readOnly:!0})]}),(0,x.jsxs)(ea,{children:[(0,x.jsx)(ta,{children:`Final Tutar`}),(0,x.jsx)(na,{type:`number`,step:`0.01`,value:t.final_amount,readOnly:!0,style:{fontWeight:`bold`,color:`#10b981`,fontSize:`16px`}})]}),(0,x.jsxs)(ea,{children:[(0,x.jsx)(ta,{children:`Teslimat Süresi (Gün)`}),(0,x.jsx)(na,{type:`number`,value:t.delivery_time,onChange:n=>p(r=>({...r,[e.id]:{...t,delivery_time:parseInt(n.target.value)||0}}))})]}),(0,x.jsxs)(ea,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(ta,{children:`Ödeme Şartları`}),(0,x.jsx)(na,{type:`text`,placeholder:`Örn: %50 peşin, %50 30 gün`,value:t.payment_terms,onChange:n=>p(r=>({...r,[e.id]:{...t,payment_terms:n.target.value}}))})]}),(0,x.jsxs)(ea,{style:{gridColumn:`1 / -1`},children:[(0,x.jsx)(ta,{children:`Garanti`}),(0,x.jsx)(na,{type:`text`,placeholder:`Örn: 12 ay ürün garantisi`,value:t.warranty,onChange:n=>p(r=>({...r,[e.id]:{...t,warranty:n.target.value}}))})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginTop:`15px`},children:[(0,x.jsxs)(Zi,{variant:`secondary`,onClick:()=>M(e.id),disabled:m!==null,children:[m===e.id?`⏳`:`💾`,` Taslak Kaydet`]}),(0,x.jsx)(Zi,{onClick:()=>N(e.id),disabled:m!==null,children:m===e.id?`⏳ Gönderiliyor...`:n?`✅ Revize Teklifi Gönder`:`✅ Teklifi Gönder`})]})]})]},e.id)}):y===`submitted`?O.length===0?(0,x.jsx)(aa,{children:(0,x.jsx)(`p`,{children:`Henüz gönderilmiş teklif yok.`})}):(0,x.jsx)(`div`,{style:{display:`grid`,gap:`10px`},children:O.map(e=>(0,x.jsx)(Yi,{children:(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`12px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontWeight:700},children:e.quote_title}),(0,x.jsxs)(`div`,{style:{marginTop:`4px`,fontSize:`13px`,color:`#475569`},children:[`Gönderilen Tutar: ₺`,Number(e.final_amount||0).toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),e.submitted_at&&(0,x.jsxs)(`div`,{style:{marginTop:`4px`,fontSize:`12px`,color:`#9ca3af`},children:[`Gönderilme: `,new Date(e.submitted_at).toLocaleString(`tr-TR`)]})]}),(0,x.jsx)(Qi,{status:e.status,children:e.status})]})},`submitted-${e.id}`))}):k.length===0?(0,x.jsx)(aa,{children:(0,x.jsx)(`p`,{children:`Kapanmış teklif yok.`})}):(0,x.jsx)(`div`,{style:{display:`grid`,gap:`10px`},children:k.map(e=>(0,x.jsx)(Yi,{children:(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`12px`},children:[(0,x.jsxs)(`div`,{style:{flex:1},children:[(0,x.jsx)(`div`,{style:{fontWeight:700},children:e.quote_title}),(0,x.jsxs)(`div`,{style:{marginTop:`4px`,fontSize:`13px`,color:`#475569`},children:[`Son Teklifiniz: ₺`,Number(e.final_amount||0).toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsxs)(`div`,{style:{marginTop:`8px`,fontSize:`12px`,color:`#7c2d12`,background:`#fef2f2`,border:`1px solid #fecaca`,borderRadius:`6px`,padding:`8px 10px`},children:[`ℹ️ `,E(e)]})]}),(0,x.jsx)(Qi,{status:e.status,children:e.status})]})},`closed-${e.id}`))})]})}var sa=[`certificates`,`company_docs`,`personnel_docs`,`guarantee_docs`],ca={profile:`Profilim`,offers:`Tekliflerim`,contracts:`Sözleşmelerim`,guarantees:`Teminatlarım`,certificates:`Sertifikalar`,company_docs:`Şirket Evrakları`,personnel_docs:`Personel Evrakları`,guarantee_docs:`Alınan Teminatlar`},la=h.div`
  min-height: 100vh;
  background: #f0f4f8;
`,ua=h.div`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`,da=h.h1`
  margin: 0;
  color: #fff;
  font-size: 20px;
`,fa=h.button`
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`,pa=h.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px 50px;
`,ma=h.div`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
`,ha=h.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`,ga=h.button`
  border: 1px solid ${e=>e.$active?`#0f766e`:`#cbd5e1`};
  background: ${e=>e.$active?`#ccfbf1`:`#fff`};
  color: ${e=>e.$active?`#134e4a`:`#334155`};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`,_a=h.button`
  border: none;
  background: #2d6a9f;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`,va=h.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`,ya=h.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
`,ba=h.select`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
`,xa=h.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  margin-top: 12px;
`,Sa=h.div`
  border-bottom: 1px dashed #dbe3ee;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  &:last-child { border-bottom: none; }
  a {
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }
`,Ca=h.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${e=>e.$type===`success`?`#065f46`:`#991b1b`};
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
`;function wa(e){return sa.includes(e)}function Ta(e){let t=new URLSearchParams(e).get(`tab`),n=[`profile`,`offers`,`contracts`,`guarantees`,...sa];return t&&n.includes(t)?t:`profile`}function Ea(){let e=m(),t=o(),n=(0,_.useRef)(null),[r,i]=(0,_.useState)(()=>Ta(t.search)),[a,s]=(0,_.useState)(!1),[c,l]=(0,_.useState)(!1),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)(null),[h,g]=(0,_.useState)([]),[v,y]=(0,_.useState)([]),[b,S]=(0,_.useState)([]),[C,w]=(0,_.useState)(``),[T,E]=(0,_.useState)(``),[D,O]=(0,_.useState)(``),[k,A]=(0,_.useState)(`all`),j=(e,t)=>{d({msg:e,type:t}),setTimeout(()=>d(null),3e3)};(0,_.useEffect)(()=>{if(!L()){e(`/supplier/login`,{replace:!0});return}i(Ta(t.search))},[t.search,e]),(0,_.useEffect)(()=>{async function e(){s(!0);try{r===`profile`?p(await Le()):wa(r)?g(await Ve(r)):r===`contracts`?y(await He()):r===`guarantees`&&S(await Je())}catch{j(`Veriler yüklenemedi`,`error`)}finally{s(!1)}}e()},[r]);let M=t=>{e(`/supplier/workspace?tab=${t}`)},N=(e,t,n)=>{if(!t&&!n)return!0;if(!e)return!1;let r=new Date(e);return!(Number.isNaN(r.getTime())||t&&r<new Date(`${t}T00:00:00`)||n&&r>new Date(`${n}T23:59:59`))},P=(0,_.useMemo)(()=>h.filter(e=>{let t=!C.trim()||e.original_filename.toLowerCase().includes(C.trim().toLowerCase()),n=N(e.created_at,T,D);return t&&n}),[h,C,T,D]),F=(0,_.useMemo)(()=>v.filter(e=>k===`all`||e.status===k),[v,k]),I=async e=>{let t=e.target.files?.[0];if(!(!t||!wa(r)))try{l(!0),await Be(r,t),g(await Ve(r)),j(`Evrak yüklendi`,`success`)}catch(e){j(e?.response?.data?.detail||`Evrak yüklenemedi`,`error`)}finally{l(!1),e.target.value=``}},R=async e=>{let t=L();if(!t){j(`Oturum bulunamadı`,`error`);return}try{let n=await fetch(`http://127.0.0.1:8000${e.file_url}`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw Error();let r=await n.blob(),i=URL.createObjectURL(r);window.open(i,`_blank`,`noopener,noreferrer`),setTimeout(()=>URL.revokeObjectURL(i),6e4)}catch{j(`Doküman açılamadı`,`error`)}};return(0,x.jsxs)(la,{children:[(0,x.jsxs)(ua,{children:[(0,x.jsx)(da,{children:`Tedarikçi Workspace`}),(0,x.jsx)(fa,{onClick:()=>e(`/supplier/dashboard`),children:`← Panele Dön`})]}),(0,x.jsx)(pa,{children:(0,x.jsxs)(ma,{children:[(0,x.jsxs)(ha,{children:[(0,x.jsx)(ga,{$active:r===`profile`,onClick:()=>M(`profile`),children:ca.profile}),(0,x.jsx)(ga,{$active:r===`offers`,onClick:()=>M(`offers`),children:ca.offers}),(0,x.jsx)(ga,{$active:r===`contracts`,onClick:()=>M(`contracts`),children:ca.contracts}),(0,x.jsx)(ga,{$active:r===`guarantees`,onClick:()=>M(`guarantees`),children:ca.guarantees}),sa.map(e=>(0,x.jsx)(ga,{$active:r===e,onClick:()=>M(e),children:ca[e]},e))]}),a&&(0,x.jsx)(`div`,{style:{color:`#64748b`,fontSize:14},children:`Yükleniyor...`}),!a&&r===`profile`&&(0,x.jsx)(`div`,{style:{border:`1px solid #e2e8f0`,borderRadius:10,background:`#f8fafc`,padding:14},children:f?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:10},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontSize:12,color:`#64748b`},children:`Firma`}),(0,x.jsx)(`div`,{style:{fontWeight:700},children:f.supplier.company_name||`-`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontSize:12,color:`#64748b`},children:`Kategori`}),(0,x.jsx)(`div`,{style:{fontWeight:700},children:f.supplier.category||`-`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontSize:12,color:`#64748b`},children:`Email`}),(0,x.jsx)(`div`,{style:{fontWeight:700},children:f.supplier.email||`-`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontSize:12,color:`#64748b`},children:`Telefon`}),(0,x.jsx)(`div`,{style:{fontWeight:700},children:f.supplier.phone||`-`})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:12,display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,x.jsx)(_a,{onClick:()=>e(`/supplier/profile`),children:`Profili Düzenle`}),(0,x.jsx)(_a,{style:{background:`#334155`},onClick:()=>e(`/supplier/finance`),children:`Finans Modülü`})]})]}):(0,x.jsx)(`div`,{style:{color:`#64748b`,fontSize:13},children:`Profil bilgileri bulunamadı.`})}),!a&&r===`offers`&&(0,x.jsx)(`div`,{style:{border:`1px solid #e2e8f0`,borderRadius:10,background:`#fff`,padding:8},children:(0,x.jsx)(oa,{apiUrl:``,authToken:L()||``})}),!a&&r===`contracts`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(va,{children:(0,x.jsxs)(ba,{value:k,onChange:e=>A(e.target.value),children:[(0,x.jsx)(`option`,{value:`all`,children:`Tüm Durumlar`}),(0,x.jsx)(`option`,{value:`draft`,children:`Taslak`}),(0,x.jsx)(`option`,{value:`generated`,children:`Oluşturuldu`}),(0,x.jsx)(`option`,{value:`sent`,children:`Gönderildi`}),(0,x.jsx)(`option`,{value:`signed`,children:`İmzalı`}),(0,x.jsx)(`option`,{value:`completed`,children:`Tamamlandı`}),(0,x.jsx)(`option`,{value:`cancelled`,children:`İptal`})]})}),(0,x.jsxs)(xa,{children:[F.length===0&&(0,x.jsx)(`div`,{style:{padding:12,fontSize:13,color:`#64748b`},children:`Sözleşme bulunmuyor.`}),F.map(e=>(0,x.jsxs)(`div`,{style:{borderBottom:`1px dashed #dbe3ee`,padding:`10px 12px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8},children:[(0,x.jsx)(`strong`,{style:{fontSize:13},children:e.contract_number}),(0,x.jsx)(`span`,{style:{fontSize:12,color:`#0f766e`,fontWeight:700},children:e.status})]}),(0,x.jsxs)(`div`,{style:{marginTop:4,fontSize:12,color:`#475569`,display:`flex`,justifyContent:`space-between`,gap:8},children:[(0,x.jsxs)(`span`,{children:[`Teklif: `,e.quote_id]}),(0,x.jsx)(`span`,{children:e.final_amount?`${e.final_amount.toLocaleString(`tr-TR`)} TL`:`-`})]})]},e.id))]})]}),!a&&r===`guarantees`&&(0,x.jsxs)(xa,{children:[b.length===0&&(0,x.jsx)(`div`,{style:{padding:12,fontSize:13,color:`#64748b`},children:`Teminat kaydı bulunmuyor.`}),b.map(e=>(0,x.jsxs)(`div`,{style:{borderBottom:`1px dashed #dbe3ee`,padding:`10px 12px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8},children:[(0,x.jsx)(`strong`,{style:{fontSize:13},children:e.title}),(0,x.jsx)(`span`,{style:{fontSize:12,color:`#0f766e`,fontWeight:700},children:e.status})]}),(0,x.jsx)(`div`,{style:{marginTop:4,fontSize:12,color:`#475569`},children:e.amount?`${e.amount.toLocaleString(`tr-TR`)} ${e.currency}`:`Tutar yok`})]},e.id))]}),!a&&wa(r)&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(va,{children:[(0,x.jsx)(ya,{value:C,onChange:e=>w(e.target.value),placeholder:`Dosya adına göre filtrele`}),(0,x.jsx)(ya,{type:`date`,value:T,onChange:e=>E(e.target.value)}),(0,x.jsx)(ya,{type:`date`,value:D,onChange:e=>O(e.target.value)}),(0,x.jsx)(_a,{onClick:()=>n.current?.click(),disabled:c,children:c?`⏳ Yükleniyor...`:`+ Evrak Yükle`})]}),(0,x.jsx)(`input`,{ref:n,type:`file`,accept:`application/pdf,image/jpeg,image/png,image/webp`,style:{display:`none`},onChange:I}),(0,x.jsxs)(xa,{children:[P.length===0&&(0,x.jsx)(`div`,{style:{padding:12,fontSize:13,color:`#64748b`},children:`Filtreye uygun evrak yok.`}),P.map(e=>(0,x.jsxs)(Sa,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontSize:13,color:`#334155`},children:e.original_filename}),(0,x.jsx)(`div`,{style:{marginTop:2,fontSize:11,color:`#64748b`},children:e.created_at?new Date(e.created_at).toLocaleString(`tr-TR`):`Tarih bilgisi yok`})]}),(0,x.jsx)(`a`,{href:`#`,onClick:t=>{t.preventDefault(),R(e)},children:`Aç`})]},e.id))]})]})]})}),u&&(0,x.jsx)(Ca,{$type:u.type,children:u.msg})]})}var Da=h.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #eef2f7;
  padding: 16px;
`,Oa=h.div`
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
  padding: 26px;
`,ka=h.button`
  margin-top: 18px;
  border: none;
  background: #0f766e;
  color: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;function Aa(){let e=m(),[t]=i(),[n,r]=(0,_.useState)(!0),[a,o]=(0,_.useState)(!1),[s,c]=(0,_.useState)(`Doğrulama yapılıyor...`),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)(6),[p,h]=(0,_.useState)(``),[g,v]=(0,_.useState)(``),[y,b]=(0,_.useState)(``);return(0,_.useEffect)(()=>{async function e(){let e=(t.get(`token`)||``).trim();if(!e){c(`Token bulunamadı.`),r(!1);return}b(e),c(`E-posta doğrulamak için isterseniz yeni şifre belirleyip onaylayın.`),r(!1)}e()},[t]),(0,_.useEffect)(()=>{if(n||!l)return;if(d<=0){e(`/supplier/login`,{replace:!0});return}let t=window.setTimeout(()=>f(e=>e-1),1e3);return()=>window.clearTimeout(t)},[n,l,d,e]),(0,x.jsx)(Da,{children:(0,x.jsxs)(Oa,{children:[(0,x.jsx)(`h2`,{style:{marginTop:0,color:`#1f2937`},children:`E-posta Doğrulama`}),(0,x.jsx)(`p`,{style:{color:`#475569`,fontSize:15},children:n?`İşlem sürüyor...`:s}),!n&&!l&&(0,x.jsxs)(`div`,{style:{display:`grid`,gap:10},children:[(0,x.jsx)(`input`,{type:`password`,value:p,onChange:e=>h(e.target.value),placeholder:`Yeni şifre (opsiyonel)`,style:{border:`1px solid #cbd5e1`,borderRadius:8,padding:`10px 12px`,fontSize:14}}),(0,x.jsx)(`input`,{type:`password`,value:g,onChange:e=>v(e.target.value),placeholder:`Yeni şifre tekrar`,style:{border:`1px solid #cbd5e1`,borderRadius:8,padding:`10px 12px`,fontSize:14}}),(0,x.jsx)(ka,{onClick:async()=>{if(!(!y||a)){if(p||g){if(p!==g){c(`Şifre tekrar alanı eşleşmiyor.`);return}if(p.length<4){c(`Şifre en az 4 karakter olmalıdır.`);return}}try{o(!0),c((await We(y,p||void 0)).message||`E-posta değişikliği onaylandı.`),u(!0),B()}catch(e){let t=e?.response?.data?.detail;c(t||`Onay işlemi başarısız.`)}finally{o(!1)}}},disabled:a,children:a?`Onaylanıyor...`:`E-postayı Onayla`})]}),!n&&l&&(0,x.jsxs)(`p`,{style:{color:`#0f766e`,fontSize:14,fontWeight:700},children:[`Oturumunuz güvenlik için kapatıldı. `,d,` sn içinde giriş sayfasına yönlendirileceksiniz.`]}),!n&&l&&(0,x.jsx)(ka,{onClick:()=>e(`/supplier/login`,{replace:!0}),children:l?`Giriş Sayfasına Git`:`Tekrar Girişe Dön`})]})})}var ja=h.div`
  display: grid;
  gap: 16px;
`,Ma=h.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
`,Na=h.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`,Pa=h.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`,Z=h.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #111827;
`,Q=h.input`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
`,Fa=h.select`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  background: #fff;
`,Ia=h.textarea`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
`,La=h.button`
  border: 0;
  border-radius: 8px;
  padding: 9px 12px;
  font-weight: 600;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
`,Ra=h(La)`
  background: #4b5563;
`,za=h(La)`
  background: #dc2626;
`,Ba=h.button`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
`,Va=h.div`
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  color: ${e=>e.$error?`#991b1b`:`#065f46`};
  background: ${e=>e.$error?`#fee2e2`:`#d1fae5`};
`,Ha=h.button`
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
  margin-bottom: 14px;
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #4f4f6c;
  }
`,Ua=h.span`
  font-size: 18px;
  font-weight: 700;
  color: #334155;
`,Wa=h.div`
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`,Ga=h.div`
  display: grid;
  grid-template-columns: minmax(170px, 1.1fr) minmax(170px, 1fr) minmax(220px, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 9px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  @media (max-width: 900px) {
    display: none;
  }
`,Ka=h.div`
  display: grid;
  grid-template-columns: minmax(170px, 1.1fr) minmax(170px, 1fr) minmax(220px, 1fr) auto;
  gap: 8px;
  align-items: start;
  padding: 10px 12px;
  border-bottom: 1px dashed #dbe3ee;
  background: #fff;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`,qa=h.div`
  font-size: 12px;
  color: #334155;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  strong {
    color: #0f172a;
  }
`,Ja=h.button`
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 7px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`,Ya=h(Ja)`
  border-color: #93c5fd;
  color: #1d4ed8;
`,Xa=h(Ja)`
  border-color: #fcd34d;
  color: #92400e;
`,Za=h(Ja)`
  border-color: #86efac;
  color: #166534;
`,Qa=h.div`
  width: 110px;
  height: 110px;
  border-radius: 12px;
  border: 1px solid #dbe3ee;
  background: #f8fafc;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`,$a=h.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`,eo=h.div`
  width: min(700px, 94vw);
  background: #fff;
  border-radius: 10px;
  border: 1px solid #dbe3ee;
  padding: 16px;
`,to=h.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`,no=[{key:`ziraat`,name:`Ziraat Bankası`},{key:`isbank`,name:`İş Bankası`},{key:`garanti`,name:`Garanti BBVA`},{key:`yapikredi`,name:`Yapı Kredi`},{key:`akbank`,name:`Akbank`},{key:`vakifbank`,name:`VakıfBank`},{key:`halkbank`,name:`Halkbank`},{key:`qnb`,name:`QNB`},{key:`denizbank`,name:`DenizBank`}],ro=[`Yazılım`,`Donanım`,`Hizmet`,`Danışmanlık`,`Muhasebe`,`İnsan Kaynakları`];function io(e){return{company_name:e.company_name||``,company_title:e.company_title||``,phone:e.phone||``,email:e.email||``,website:e.website||``,address:e.address||``,city:e.city||``,address_district:e.address_district||``,postal_code:e.postal_code||``,invoice_name:e.invoice_name||``,invoice_address:e.invoice_address||``,invoice_city:e.invoice_city||``,invoice_district:e.invoice_district||``,invoice_postal_code:e.invoice_postal_code||``,tax_number:e.tax_number||``,registration_number:e.registration_number||``,tax_office:e.tax_office||``,notes:e.notes||``,category:e.category||``,accepts_checks:!!e.accepts_checks,preferred_check_term:e.preferred_check_term||``,payment_accounts:e.payment_accounts||[]}}function ao(e){return e?String(e).slice(0,10):``}function oo(e){return e?`▲`:`▼`}function so(e){if(!e)return``;let t=e.replace(/\D/g,``);return t.startsWith(`0090`)&&(t=t.slice(4)),t.startsWith(`90`)&&t.length>=12&&(t=t.slice(2)),t.startsWith(`0`)&&t.length>=11&&(t=t.slice(1)),t}function co(e){let t=so(e);return t.length>=10&&t.startsWith(`5`)}function lo(){let{id:e}=r(),t=m(),n=Number(e),[i,a]=(0,_.useState)(!0),[o,s]=(0,_.useState)(!1),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)(null),[h,g]=(0,_.useState)(null),[v,y]=(0,_.useState)(!0),[b,S]=(0,_.useState)(!0),[C,w]=(0,_.useState)(``),[T,E]=(0,_.useState)(`all`),[D,O]=(0,_.useState)(!1),[k,A]=(0,_.useState)({name:``,email:``,phone:``}),[j,M]=(0,_.useState)({}),[N,P]=(0,_.useState)({title:``,guarantee_type:``,amount:``,currency:`TRY`,issued_at:``,expires_at:``}),[F,I]=(0,_.useState)(null),[L,R]=(0,_.useState)(null),[z,B]=(0,_.useState)(!1),[V,ee]=(0,_.useState)(``),[H,te]=(0,_.useState)(``),[ne,U]=(0,_.useState)(``),[re,W]=(0,_.useState)(``),[ie,ae]=(0,_.useState)([]),[oe,se]=(0,_.useState)(!1),[G,ce]=(0,_.useState)({invoice:!1,users:!0,guarantees:!0,payment:!0}),le=(0,_.useMemo)(()=>Ir(),[]),ue=(0,_.useMemo)(()=>h?.city?Lr(h.city):[],[h?.city]),de=(0,_.useMemo)(()=>h?.invoice_city?Lr(h.invoice_city):[],[h?.invoice_city]),fe=(0,_.useMemo)(()=>f?f.users.filter(e=>{let t=[e.name,e.email,e.phone||``].join(` `).toLowerCase().includes(C.toLowerCase()),n=T===`all`?!0:T===`verified`?e.email_verified:!e.email_verified;return t&&n}):[],[f,C,T]),pe=(0,_.useMemo)(()=>{let e=f?.supplier.logo_url;return e?e.startsWith(`http`)?e:`http://127.0.0.1:8000${e}`:null},[f?.supplier.logo_url]),me=(0,_.useMemo)(()=>f&&(f.users.find(e=>e.is_default)||f.users[0])||null,[f]),he=(e,t,n)=>{let r=[e,t,n,`Türkiye`].filter(Boolean).join(`, `);return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r)}`},ge=(e,t,n)=>{let r=[e,t,n,`Türkiye`].filter(Boolean).join(`, `);return`https://maps.google.com/maps?output=embed&t=k&q=${encodeURIComponent(r)}`},_e=e=>{ce(t=>({...t,[e]:!t[e]}))},ve=(0,_.useCallback)(async()=>{if(!Number.isFinite(n)||n<=0){l(`Geçersiz tedarikçi kimliği`),a(!1);return}try{a(!0),l(null);let e=await Zt(n);p(e),g(io(e.supplier)),M({})}catch(e){l(e instanceof Error?e.message:`Detay yüklenemedi`)}finally{a(!1)}},[n]);(0,_.useEffect)(()=>{ve()},[ve]);async function ye(){if(h)try{s(!0),l(null),d(null),await Qt(n,{...h,preferred_check_term:h.accepts_checks?h.preferred_check_term:``}),d(`Tedarikçi bilgileri güncellendi`),await ve()}catch(e){l(e instanceof Error?e.message:`Kaydetme hatası`)}finally{s(!1)}}function be(e){M(t=>({...t,[e.id]:{name:e.name,email:e.email,phone:e.phone||``}}))}function xe(e){M(t=>{let n={...t};return delete n[e],n})}async function Se(e){let t=j[e];if(t)try{await nn(n,e,t),d(`Yetkili güncellendi`),xe(e),await ve()}catch(e){l(e instanceof Error?e.message:`Yetkili güncellenemedi`)}}async function Ce(){if(!k.name||!k.email){l(`Kullanıcı adı ve e-posta zorunludur`);return}try{await on(n,k),A({name:``,email:``,phone:``}),O(!1),d(`Kullanıcı eklendi ve davet e-postası gönderildi`),await ve()}catch(e){l(e instanceof Error?e.message:`Kullanıcı eklenemedi`)}}async function we(e){if(window.confirm(`Teminat kaydını silmek istiyor musunuz?`))try{await tn(n,e),d(`Teminat silindi`),await ve()}catch(e){l(e instanceof Error?e.message:`Teminat silinemedi`)}}async function Te(){if(!N.title||!N.guarantee_type){l(`Teminat başlığı ve türü zorunludur`);return}try{await $t(n,{title:N.title,guarantee_type:N.guarantee_type,amount:N.amount?Number(N.amount):null,currency:N.currency,issued_at:N.issued_at||null,expires_at:N.expires_at||null}),P({title:``,guarantee_type:``,amount:``,currency:`TRY`,issued_at:``,expires_at:``}),d(`Teminat eklendi`),await ve()}catch(e){l(e instanceof Error?e.message:`Teminat eklenemedi`)}}async function Ee(){if(!(!F||!L))try{await en(n,F,{title:L.title,guarantee_type:L.guarantee_type,amount:L.amount?Number(L.amount):null,currency:L.currency,issued_at:L.issued_at||null,expires_at:L.expires_at||null,status:L.status}),I(null),R(null),d(`Teminat güncellendi`),await ve()}catch(e){l(e instanceof Error?e.message:`Teminat güncellenemedi`)}}async function De(e){if(window.confirm(`Bu yetkiliyi silmek istiyor musunuz?`))try{await rn(n,e),d(`Yetkili silindi`),await ve()}catch(e){l(e instanceof Error?e.message:`Yetkili silinemedi`)}}async function Oe(e){try{await an(n,e),d(`Varsayılan yetkili güncellendi`),await ve()}catch(e){l(e instanceof Error?e.message:`Varsayılan yetkili güncellenemedi`)}}function ke(){if(!h)return;let e=he(h.address,h.address_district,h.city),t=me?`Yetkili: ${me.name}\nTelefon: ${me.phone||`-`}\nE-posta: ${me.email}`:`Yetkili: -`,n=[h.company_name||`-`,h.address||`-`,`${h.city||`-`}/${h.address_district||`-`}`,``,t,`Konum: ${e}`].join(`
`);window.open(`https://wa.me/?text=${encodeURIComponent(n)}`,`_blank`,`noopener,noreferrer`)}function Ae(e){let t=so(e);t&&(window.location.href=`tel:+90${t}`)}function je(e){let t=so(e);t&&window.open(`https://wa.me/90${t}`,`_blank`,`noopener,noreferrer`)}function Me(e){e&&(ee(e),te(``),U(`${h?.company_name||`Tedarikçi`} - Bilgilendirme`),W(`Merhaba,

`),ae([]),B(!0))}async function Ne(){if(!V||!ne){l(`E-posta alıcısı ve konu zorunludur`);return}try{se(!0),await un(n,{to_email:V,subject:ne,body:re,cc:H||void 0,attachments:ie}),d(`E-posta gönderildi`),B(!1)}catch(e){let t=e?.response?.data?.detail;l(t||`E-posta gönderilemedi`)}finally{se(!1)}}return i?(0,x.jsx)(ja,{children:`Yükleniyor...`}):!f||!h?(0,x.jsx)(ja,{children:`Veri bulunamadı.`}):(0,x.jsxs)(ja,{children:[c&&(0,x.jsx)(Va,{$error:!0,children:c}),u&&(0,x.jsx)(Va,{children:u}),(0,x.jsxs)(Na,{children:[(0,x.jsxs)(`h2`,{children:[`Tedarikçiyi Görüntüle: `,f.supplier.company_name]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(Ra,{onClick:()=>t(`/admin?tab=suppliers`),children:`Tedarikçilere Dön`}),(0,x.jsx)(Ra,{onClick:()=>t(`/admin`),children:`Panele Dön`})]})]}),(0,x.jsxs)(Ma,{children:[(0,x.jsxs)(Na,{children:[(0,x.jsx)(`h3`,{children:`Genel Bilgiler`}),(0,x.jsx)(La,{disabled:o,onClick:ye,children:o?`Kaydediliyor...`:`Kaydet`})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:16,marginBottom:12,flexWrap:`wrap`},children:[(0,x.jsx)(Qa,{children:pe?(0,x.jsx)(`img`,{src:pe,alt:`Firma logosu`}):(0,x.jsx)(`span`,{style:{color:`#94a3b8`},children:`Logo Yok`})}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8,alignContent:`start`},children:[(0,x.jsx)(`div`,{style:{fontWeight:700,color:`#1e293b`},children:h.company_name||`-`}),(0,x.jsx)(`div`,{style:{color:`#64748b`,fontSize:13},children:`Logoyu tedarikçi kendi profilinden günceller.`}),(0,x.jsxs)(to,{children:[(0,x.jsx)(Ba,{type:`button`,onClick:()=>t(`/admin/suppliers/${n}/workspace?tab=certificates`),children:`Sertifika Yükle`}),(0,x.jsx)(Ba,{type:`button`,onClick:()=>t(`/admin/suppliers/${n}/workspace?tab=company_docs`),children:`Şirket Evrakları`}),(0,x.jsx)(Ba,{type:`button`,onClick:()=>t(`/admin/suppliers/${n}/workspace?tab=personnel_docs`),children:`Personel Evrakları`}),(0,x.jsx)(Ba,{type:`button`,onClick:()=>t(`/admin/suppliers/${n}/finance`),children:`Finans Modülü`}),(0,x.jsx)(Ba,{type:`button`,onClick:()=>t(`/admin/suppliers/${n}/workspace?tab=guarantee_docs`),children:`Alınan Teminatlar`})]})]})]}),(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Firma Adı`,(0,x.jsx)(Q,{value:h.company_name,onChange:e=>g({...h,company_name:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Ünvan`,(0,x.jsx)(Q,{value:h.company_title,onChange:e=>g({...h,company_title:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Telefon`,(0,x.jsx)(Q,{value:h.phone,onChange:e=>g({...h,phone:e.target.value})}),(0,x.jsxs)(to,{children:[(0,x.jsx)(Ya,{type:`button`,onClick:()=>Ae(h.phone),children:`Ara`}),(0,x.jsx)(Za,{type:`button`,disabled:!co(h.phone),onClick:()=>je(h.phone),children:`WhatsApp`})]})]}),(0,x.jsxs)(Z,{children:[`E-posta`,(0,x.jsx)(Q,{value:h.email,onChange:e=>g({...h,email:e.target.value})}),(0,x.jsx)(to,{children:(0,x.jsx)(Xa,{type:`button`,onClick:()=>Me(h.email),children:`Mail Gönder`})})]}),(0,x.jsxs)(Z,{children:[`Web Sitesi`,(0,x.jsx)(Q,{value:h.website,onChange:e=>g({...h,website:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Kategori`,(0,x.jsxs)(Fa,{value:h.category,onChange:e=>g({...h,category:e.target.value}),children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),ro.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Adres`,(0,x.jsx)(Ia,{rows:2,value:h.address,onChange:e=>g({...h,address:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Şehir`,(0,x.jsxs)(Fa,{value:h.city,onChange:e=>g({...h,city:e.target.value,address_district:``}),children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),le.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]})]}),(0,x.jsxs)(Z,{children:[`İlçe`,(0,x.jsxs)(Fa,{value:h.address_district,onChange:e=>g({...h,address_district:e.target.value}),disabled:!h.city,children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),ue.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]})]}),(0,x.jsxs)(Z,{children:[`Posta Kodu`,(0,x.jsx)(Q,{value:h.postal_code,onChange:e=>g({...h,postal_code:e.target.value})})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Notlar`,(0,x.jsx)(Ia,{rows:3,value:h.notes,onChange:e=>g({...h,notes:e.target.value})})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:10,flexWrap:`wrap`},children:[(0,x.jsx)(Ba,{type:`button`,onClick:()=>y(e=>!e),children:v?`Firma Konumunu Gizle`:`Firma Konumunu Aç`}),(0,x.jsx)(Ba,{type:`button`,onClick:ke,children:`WhatsApp Paylaş`})]}),v&&(0,x.jsx)(`div`,{style:{marginTop:10,border:`1px solid #dbe3ee`,borderRadius:8,overflow:`hidden`},children:(0,x.jsx)(`iframe`,{title:`Firma konumu`,src:ge(h.address,h.address_district,h.city),width:`100%`,height:`280`,style:{border:0},loading:`lazy`})})]}),(0,x.jsxs)(Ma,{children:[(0,x.jsxs)(Ha,{onClick:()=>_e(`users`),children:[(0,x.jsxs)(`h3`,{children:[`Yetkili Kullanıcılar (`,f.users_count,`)`]}),(0,x.jsx)(Ua,{children:oo(G.users)})]}),G.users&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Arama`,(0,x.jsx)(Q,{value:C,onChange:e=>w(e.target.value),placeholder:`Ad, e-posta, telefon`})]}),(0,x.jsxs)(Z,{children:[`Durum Filtresi`,(0,x.jsxs)(Fa,{value:T,onChange:e=>E(e.target.value),children:[(0,x.jsx)(`option`,{value:`all`,children:`Tümü`}),(0,x.jsx)(`option`,{value:`verified`,children:`Doğrulanmış`}),(0,x.jsx)(`option`,{value:`unverified`,children:`Bekleyen`})]})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(La,{type:`button`,onClick:()=>O(!0),children:`+ Kullanıcı Ekle`})}),(0,x.jsxs)(Wa,{children:[(0,x.jsxs)(Ga,{children:[(0,x.jsx)(`div`,{children:`Ad Soyad`}),(0,x.jsx)(`div`,{children:`Telefon`}),(0,x.jsx)(`div`,{children:`E-posta`}),(0,x.jsx)(`div`,{style:{textAlign:`right`},children:`İşlemler`})]}),fe.map(e=>{let t=j[e.id];return(0,x.jsxs)(Ka,{children:[(0,x.jsx)(qa,{children:t?(0,x.jsx)(Q,{value:t.name,onChange:n=>M(r=>({...r,[e.id]:{...t,name:n.target.value}}))}):(0,x.jsxs)(`strong`,{children:[e.name,e.is_default?` (Varsayılan)`:``]})}),(0,x.jsx)(qa,{children:t?(0,x.jsx)(Q,{value:t.phone,onChange:n=>M(r=>({...r,[e.id]:{...t,phone:n.target.value}}))}):(0,x.jsxs)(x.Fragment,{children:[e.phone||`-`,(0,x.jsxs)(to,{children:[(0,x.jsx)(Ya,{type:`button`,onClick:()=>Ae(e.phone),children:`Ara`}),(0,x.jsx)(Za,{type:`button`,disabled:!co(e.phone),onClick:()=>je(e.phone),children:`WhatsApp`})]})]})}),(0,x.jsx)(qa,{children:t?(0,x.jsx)(Q,{type:`email`,value:t.email,onChange:n=>M(r=>({...r,[e.id]:{...t,email:n.target.value}}))}):(0,x.jsxs)(x.Fragment,{children:[e.email,(0,x.jsx)(`div`,{style:{fontSize:11,color:e.email_verified?`#166534`:`#92400e`,marginTop:2},children:e.email_verified?`Onaylı`:`Onay Bekliyor`}),(0,x.jsx)(to,{children:(0,x.jsx)(Xa,{type:`button`,onClick:()=>Me(e.email),children:`Mail Gönder`})})]})}),(0,x.jsx)(`div`,{style:{display:`flex`,gap:6,justifyContent:`flex-end`,flexWrap:`wrap`},children:t?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Ja,{type:`button`,onClick:()=>void Se(e.id),children:`Kaydet`}),(0,x.jsx)(Ja,{type:`button`,onClick:()=>xe(e.id),children:`Vazgeç`})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Ja,{type:`button`,onClick:()=>be(e),children:`Düzenle`}),!e.is_default&&(0,x.jsx)(Ja,{type:`button`,onClick:()=>void Oe(e.id),children:`Varsayılan Yap`}),!e.is_default&&(0,x.jsx)(Ja,{type:`button`,onClick:()=>void De(e.id),children:`Sil`})]})})]},e.id)})]})]})]}),(0,x.jsxs)(Ma,{children:[(0,x.jsxs)(Ha,{onClick:()=>_e(`invoice`),children:[(0,x.jsx)(`h3`,{children:`Fatura Bilgileri`}),(0,x.jsx)(Ua,{children:oo(G.invoice)})]}),G.invoice&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Fatura Ünvanı`,(0,x.jsx)(Q,{value:h.invoice_name,onChange:e=>g({...h,invoice_name:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Vergi Dairesi`,(0,x.jsx)(Q,{value:h.tax_office,onChange:e=>g({...h,tax_office:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Vergi No`,(0,x.jsx)(Q,{value:h.tax_number,onChange:e=>g({...h,tax_number:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Sicil No`,(0,x.jsx)(Q,{value:h.registration_number,onChange:e=>g({...h,registration_number:e.target.value})})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Fatura Adresi`,(0,x.jsx)(Ia,{rows:2,value:h.invoice_address,onChange:e=>g({...h,invoice_address:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Fatura Şehir`,(0,x.jsxs)(Fa,{value:h.invoice_city,onChange:e=>g({...h,invoice_city:e.target.value,invoice_district:``}),children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),le.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]})]}),(0,x.jsxs)(Z,{children:[`Fatura İlçe`,(0,x.jsxs)(Fa,{value:h.invoice_district,onChange:e=>g({...h,invoice_district:e.target.value}),disabled:!h.invoice_city,children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),de.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]})]}),(0,x.jsxs)(Z,{children:[`Fatura Posta Kodu`,(0,x.jsx)(Q,{value:h.invoice_postal_code,onChange:e=>g({...h,invoice_postal_code:e.target.value})})]})]}),(0,x.jsx)(`div`,{style:{marginTop:10},children:(0,x.jsx)(Ba,{type:`button`,onClick:()=>S(e=>!e),children:b?`Fatura Konumunu Gizle`:`Fatura Konumunu Aç`})}),b&&(0,x.jsx)(`div`,{style:{marginTop:10,border:`1px solid #dbe3ee`,borderRadius:8,overflow:`hidden`},children:(0,x.jsx)(`iframe`,{title:`Fatura konumu`,src:ge(h.invoice_address,h.invoice_district,h.invoice_city),width:`100%`,height:`280`,style:{border:0},loading:`lazy`})})]})]}),(0,x.jsxs)(Ma,{children:[(0,x.jsxs)(Ha,{onClick:()=>_e(`guarantees`),children:[(0,x.jsx)(`h3`,{children:`Teminatlar`}),(0,x.jsx)(Ua,{children:oo(G.guarantees)})]}),G.guarantees&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Başlık`,(0,x.jsx)(Q,{value:N.title,onChange:e=>P({...N,title:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Tür`,(0,x.jsx)(Q,{value:N.guarantee_type,onChange:e=>P({...N,guarantee_type:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Tutar`,(0,x.jsx)(Q,{value:N.amount,onChange:e=>P({...N,amount:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Para Birimi`,(0,x.jsx)(Q,{value:N.currency,onChange:e=>P({...N,currency:e.target.value.toUpperCase()})})]}),(0,x.jsxs)(Z,{children:[`Veriliş Tarihi`,(0,x.jsx)(Q,{type:`date`,value:N.issued_at,onChange:e=>P({...N,issued_at:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Bitiş Tarihi`,(0,x.jsx)(Q,{type:`date`,value:N.expires_at,onChange:e=>P({...N,expires_at:e.target.value})})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(La,{type:`button`,onClick:()=>void Te(),children:`Teminat Ekle`})}),(0,x.jsx)(`div`,{style:{marginTop:12,display:`grid`,gap:8},children:f.guarantees.map(e=>(0,x.jsx)(Ma,{children:(0,x.jsxs)(Na,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:e.title}),(0,x.jsxs)(`div`,{children:[e.guarantee_type,` | `,e.amount??`-`,` `,e.currency||`TRY`]}),(0,x.jsxs)(`div`,{children:[`Durum: `,e.status,` | Bitiş: `,e.expires_at||`-`]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(Ra,{type:`button`,onClick:()=>{I(e.id),R({title:e.title,guarantee_type:e.guarantee_type,amount:e.amount==null?``:String(e.amount),currency:e.currency||`TRY`,issued_at:ao(e.issued_at),expires_at:ao(e.expires_at),status:e.status||`active`})},children:`Düzenle`}),(0,x.jsx)(za,{type:`button`,onClick:()=>void we(e.id),children:`Sil`})]})]})},e.id))})]})]}),(0,x.jsxs)(Ma,{children:[(0,x.jsxs)(Ha,{onClick:()=>_e(`payment`),children:[(0,x.jsx)(`h3`,{children:`Ödeme ve Çek Ayarları`}),(0,x.jsx)(Ua,{children:oo(G.payment)})]}),G.payment&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Çek Kabulü`,(0,x.jsxs)(Fa,{value:h.accepts_checks?`yes`:`no`,onChange:e=>g({...h,accepts_checks:e.target.value===`yes`}),children:[(0,x.jsx)(`option`,{value:`yes`,children:`Evet`}),(0,x.jsx)(`option`,{value:`no`,children:`Hayır`})]})]}),(0,x.jsxs)(Z,{children:[`Tercih Edilen Çek Vadesi`,(0,x.jsx)(Q,{value:h.preferred_check_term,onChange:e=>g({...h,preferred_check_term:e.target.value}),disabled:!h.accepts_checks})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:12,display:`grid`,gap:8},children:[h.payment_accounts.map((e,t)=>(0,x.jsx)(Ma,{children:(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Banka`,(0,x.jsxs)(Fa,{value:e.bank_key||``,onChange:e=>{let n=no.find(t=>t.key===e.target.value),r=[...h.payment_accounts];r[t]={...r[t],bank_key:n?.key||null,bank_name:n?.name||``},g({...h,payment_accounts:r})},children:[(0,x.jsx)(`option`,{value:``,children:`Seçiniz`}),no.map(e=>(0,x.jsx)(`option`,{value:e.key,children:e.name},e.key))]})]}),(0,x.jsxs)(Z,{children:[`IBAN`,(0,x.jsx)(Q,{value:e.iban,onChange:e=>{let n=[...h.payment_accounts];n[t]={...n[t],iban:e.target.value},g({...h,payment_accounts:n})}})]}),(0,x.jsxs)(Z,{children:[`Hesap Türü`,(0,x.jsxs)(Fa,{value:e.account_type,onChange:e=>{let n=[...h.payment_accounts];n[t]={...n[t],account_type:e.target.value},g({...h,payment_accounts:n})},children:[(0,x.jsx)(`option`,{value:`tl`,children:`TL`}),(0,x.jsx)(`option`,{value:`doviz`,children:`Döviz`})]})]}),(0,x.jsx)(za,{type:`button`,onClick:()=>g({...h,payment_accounts:h.payment_accounts.filter((e,n)=>n!==t)}),children:`Hesabı Sil`})]})},`${e.bank_name}-${t}`)),(0,x.jsx)(Ra,{type:`button`,onClick:()=>g({...h,payment_accounts:[...h.payment_accounts,{bank_name:``,iban:``,account_type:`tl`,bank_key:null}]}),children:`+ Hesap Ekle`})]})]})]}),D&&(0,x.jsx)($a,{onClick:()=>O(!1),children:(0,x.jsxs)(eo,{onClick:e=>e.stopPropagation(),children:[(0,x.jsx)(`h3`,{children:`Yeni Yetkili Ekle`}),(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Ad Soyad`,(0,x.jsx)(Q,{value:k.name,onChange:e=>A({...k,name:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`E-posta`,(0,x.jsx)(Q,{type:`email`,value:k.email,onChange:e=>A({...k,email:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Telefon`,(0,x.jsx)(Q,{value:k.phone,onChange:e=>A({...k,phone:e.target.value})})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:12,display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,x.jsx)(Ra,{type:`button`,onClick:()=>O(!1),children:`İptal`}),(0,x.jsx)(La,{type:`button`,onClick:()=>void Ce(),children:`Kullanıcı Ekle`})]})]})}),F&&L&&(0,x.jsx)($a,{onClick:()=>{I(null),R(null)},children:(0,x.jsxs)(eo,{onClick:e=>e.stopPropagation(),children:[(0,x.jsx)(`h3`,{children:`Teminat Düzenle`}),(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Başlık`,(0,x.jsx)(Q,{value:L.title,onChange:e=>R({...L,title:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Tür`,(0,x.jsx)(Q,{value:L.guarantee_type,onChange:e=>R({...L,guarantee_type:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Tutar`,(0,x.jsx)(Q,{value:L.amount,onChange:e=>R({...L,amount:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Para Birimi`,(0,x.jsx)(Q,{value:L.currency,onChange:e=>R({...L,currency:e.target.value.toUpperCase()})})]}),(0,x.jsxs)(Z,{children:[`Veriliş Tarihi`,(0,x.jsx)(Q,{type:`date`,value:L.issued_at,onChange:e=>R({...L,issued_at:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Bitiş Tarihi`,(0,x.jsx)(Q,{type:`date`,value:L.expires_at,onChange:e=>R({...L,expires_at:e.target.value})})]}),(0,x.jsxs)(Z,{children:[`Durum`,(0,x.jsxs)(Fa,{value:L.status,onChange:e=>R({...L,status:e.target.value}),children:[(0,x.jsx)(`option`,{value:`active`,children:`active`}),(0,x.jsx)(`option`,{value:`expired`,children:`expired`}),(0,x.jsx)(`option`,{value:`cancelled`,children:`cancelled`})]})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:12,display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,x.jsx)(Ra,{type:`button`,onClick:()=>{I(null),R(null)},children:`İptal`}),(0,x.jsx)(La,{type:`button`,onClick:()=>void Ee(),children:`Kaydet`})]})]})}),z&&(0,x.jsx)($a,{onClick:()=>B(!1),children:(0,x.jsxs)(eo,{onClick:e=>e.stopPropagation(),children:[(0,x.jsx)(`h3`,{children:`E-posta Gönder`}),(0,x.jsxs)(Pa,{children:[(0,x.jsxs)(Z,{children:[`Alıcı (To)`,(0,x.jsx)(Q,{type:`email`,value:V,onChange:e=>ee(e.target.value)})]}),(0,x.jsxs)(Z,{children:[`CC (virgülle ayırın)`,(0,x.jsx)(Q,{value:H,onChange:e=>te(e.target.value)})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Konu`,(0,x.jsx)(Q,{value:ne,onChange:e=>U(e.target.value)})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Mesaj`,(0,x.jsx)(Ia,{rows:7,value:re,onChange:e=>W(e.target.value)})]}),(0,x.jsxs)(Z,{style:{gridColumn:`1 / -1`},children:[`Ek Dosyalar`,(0,x.jsx)(Q,{type:`file`,multiple:!0,onChange:e=>ae(Array.from(e.target.files||[]))}),ie.length>0&&(0,x.jsx)(`div`,{style:{marginTop:6,fontSize:12,color:`#334155`},children:ie.map(e=>e.name).join(`, `)})]})]}),(0,x.jsxs)(`div`,{style:{marginTop:12,display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,x.jsx)(Ra,{type:`button`,onClick:()=>B(!1),children:`İptal`}),(0,x.jsx)(La,{type:`button`,disabled:oe,onClick:()=>void Ne(),children:oe?`Gönderiliyor...`:`Gönder`})]})]})})]})}var uo=h.div`
  display: grid;
  gap: 16px;
`,fo=h.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
`,po=h.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`,mo=h.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`,ho=h.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: #334155;
`,go=h.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
`,_o=h.button`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
`,vo=h(_o)`
  border: 0;
  background: #2563eb;
  color: #fff;
`,yo=h.div`
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  color: ${e=>e.$error?`#991b1b`:`#065f46`};
  background: ${e=>e.$error?`#fee2e2`:`#d1fae5`};
`;function bo(){let e=m(),{id:t}=r(),n=Number(t),[i,a]=(0,_.useState)(!0),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(``),[f,p]=(0,_.useState)(null),[h,g]=(0,_.useState)(``),[v,y]=(0,_.useState)(``),[b,S]=(0,_.useState)(``),[C,w]=(0,_.useState)(``),[T,E]=(0,_.useState)(``),[D,O]=(0,_.useState)(``),[k,A]=(0,_.useState)(null),[j,M]=(0,_.useState)(``),[N,P]=(0,_.useState)(``),[F,I]=(0,_.useState)(``),[L,R]=(0,_.useState)(``),[z,B]=(0,_.useState)(null),V=(0,_.useCallback)(async()=>{p(await dn(n,{query:h||void 0,date_from:v||void 0,date_to:b||void 0}))},[n,h,v,b]);(0,_.useEffect)(()=>{if(!Number.isFinite(n)||n<=0){s(`Gecersiz tedarikci numarasi`),a(!1);return}(async()=>{try{a(!0);let[e]=await Promise.all([Zt(n),V()]);d(e.supplier.company_name||`#${n}`)}catch{s(`Finans verileri yuklenemedi`)}finally{a(!1)}})()},[n,V]);async function ee(){let e=Number(T);if(!(!C||!Number.isFinite(e)||e<=0))try{await fn(n,{title:C,amount:e,invoice_date:D||void 0,file:k||void 0}),w(``),E(``),O(``),A(null),await V(),l(`Fatura eklendi`),s(null)}catch{s(`Fatura eklenemedi`)}}async function H(){let e=Number(N);if(!(!j||!Number.isFinite(e)||e<=0))try{await pn(n,{title:j,amount:e,payment_date:F||void 0}),M(``),P(``),I(``),await V(),l(`Odeme eklendi`),s(null)}catch{s(`Odeme eklenemedi`)}}async function te(){if(!(!L||!z))try{await mn(n,{title:L,file:z}),R(``),B(null),await V(),l(`Is fotografi eklendi`),s(null)}catch{s(`Is fotografi eklenemedi`)}}async function ne(e,t){let r=window.prompt(`Fatura basligi`,t.title);if(!r)return;let i=window.prompt(`Fatura tutari`,String(t.amount));if(!i)return;let a=Number(i);!Number.isFinite(a)||a<=0||(await hn(n,e,{title:r,amount:a,invoice_date:window.prompt(`Fatura tarihi (YYYY-MM-DD)`,t.invoice_date||``)||void 0}),await V())}async function U(e){window.confirm(`Fatura silinsin mi?`)&&(await gn(n,e),await V())}async function re(e,t){let r=window.prompt(`Odeme basligi`,t.title);if(!r)return;let i=window.prompt(`Odeme tutari`,String(t.amount));if(!i)return;let a=Number(i);!Number.isFinite(a)||a<=0||(await _n(n,e,{title:r,amount:a,payment_date:window.prompt(`Odeme tarihi (YYYY-MM-DD)`,t.payment_date||``)||void 0}),await V())}async function W(e){window.confirm(`Odeme silinsin mi?`)&&(await vn(n,e),await V())}async function ie(e,t){let r=window.prompt(`Fotograf basligi`,t.title);r&&(await yn(n,e,{title:r,description:window.prompt(`Aciklama`,t.description||``)||void 0}),await V())}async function ae(e){window.confirm(`Fotograf silinsin mi?`)&&(await bn(n,e),await V())}return i?(0,x.jsx)(uo,{children:`Yukleniyor...`}):(0,x.jsxs)(uo,{children:[o&&(0,x.jsx)(yo,{$error:!0,children:o}),c&&(0,x.jsx)(yo,{children:c}),(0,x.jsxs)(fo,{children:[(0,x.jsxs)(po,{children:[(0,x.jsxs)(`h2`,{style:{margin:0},children:[`Finans Modulu: `,u||`#${n}`]}),(0,x.jsx)(_o,{type:`button`,onClick:()=>e(`/admin/suppliers/${n}`),children:`Tedarikci Detayina Don`})]}),!!f?.alerts?.length&&(0,x.jsx)(yo,{$error:!0,style:{marginTop:10},children:f.alerts.join(` `)})]}),(0,x.jsx)(fo,{children:(0,x.jsxs)(mo,{children:[(0,x.jsxs)(ho,{children:[`Sozlesme Toplami`,(0,x.jsx)(go,{readOnly:!0,value:(f?.totals.contract_total??0).toLocaleString(`tr-TR`)})]}),(0,x.jsxs)(ho,{children:[`Fatura Toplami`,(0,x.jsx)(go,{readOnly:!0,value:(f?.totals.invoice_total??0).toLocaleString(`tr-TR`)})]}),(0,x.jsxs)(ho,{children:[`Odeme Toplami`,(0,x.jsx)(go,{readOnly:!0,value:(f?.totals.payment_total??0).toLocaleString(`tr-TR`)})]})]})}),(0,x.jsxs)(fo,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Filtrele`}),(0,x.jsxs)(mo,{children:[(0,x.jsxs)(ho,{children:[`Arama`,(0,x.jsx)(go,{value:h,onChange:e=>g(e.target.value),placeholder:`Baslik, tutar, not`})]}),(0,x.jsxs)(ho,{children:[`Tarih Baslangic`,(0,x.jsx)(go,{type:`date`,value:v,onChange:e=>y(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Tarih Bitis`,(0,x.jsx)(go,{type:`date`,value:b,onChange:e=>S(e.target.value)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(_o,{type:`button`,onClick:()=>void V(),children:`Filtrele`})})]}),(0,x.jsxs)(fo,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Fatura Ekle`}),(0,x.jsxs)(mo,{children:[(0,x.jsxs)(ho,{children:[`Fatura Basligi`,(0,x.jsx)(go,{value:C,onChange:e=>w(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Fatura Tutari`,(0,x.jsx)(go,{type:`number`,value:T,onChange:e=>E(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Fatura Tarihi`,(0,x.jsx)(go,{type:`date`,value:D,onChange:e=>O(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Fatura Dosyasi`,(0,x.jsx)(go,{type:`file`,onChange:e=>A(e.target.files?.[0]||null)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(vo,{type:`button`,onClick:()=>void ee(),children:`Fatura Ekle`})})]}),(0,x.jsxs)(fo,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Odeme Ekle`}),(0,x.jsxs)(mo,{children:[(0,x.jsxs)(ho,{children:[`Odeme Basligi`,(0,x.jsx)(go,{value:j,onChange:e=>M(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Odeme Tutari`,(0,x.jsx)(go,{type:`number`,value:N,onChange:e=>P(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Odeme Tarihi`,(0,x.jsx)(go,{type:`date`,value:F,onChange:e=>I(e.target.value)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(vo,{type:`button`,onClick:()=>void H(),children:`Odeme Ekle`})})]}),(0,x.jsxs)(fo,{children:[(0,x.jsx)(`h3`,{style:{marginTop:0},children:`Is Fotografi Ekle`}),(0,x.jsxs)(mo,{children:[(0,x.jsxs)(ho,{children:[`Fotograf Basligi`,(0,x.jsx)(go,{value:L,onChange:e=>R(e.target.value)})]}),(0,x.jsxs)(ho,{children:[`Is Fotografi`,(0,x.jsx)(go,{type:`file`,accept:`image/*`,onChange:e=>B(e.target.files?.[0]||null)})]})]}),(0,x.jsx)(`div`,{style:{marginTop:8},children:(0,x.jsx)(vo,{type:`button`,onClick:()=>void te(),children:`Fotograf Ekle`})})]}),(0,x.jsxs)(fo,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Faturalar (`,f?.invoices.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(f?.invoices||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsxs)(`span`,{children:[e.title,` - `,e.amount.toLocaleString(`tr-TR`),` `,e.currency]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(_o,{type:`button`,onClick:()=>void ne(e.id,e),children:`Duzenle`}),(0,x.jsx)(_o,{type:`button`,onClick:()=>void U(e.id),children:`Sil`})]})]},e.id)),(f?.invoices||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]}),(0,x.jsxs)(fo,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Odemeler (`,f?.payments.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(f?.payments||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsxs)(`span`,{children:[e.title,` - `,e.amount.toLocaleString(`tr-TR`),` `,e.currency]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(_o,{type:`button`,onClick:()=>void re(e.id,e),children:`Duzenle`}),(0,x.jsx)(_o,{type:`button`,onClick:()=>void W(e.id),children:`Sil`})]})]},e.id)),(f?.payments||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]}),(0,x.jsxs)(fo,{children:[(0,x.jsxs)(`h3`,{style:{marginTop:0},children:[`Is Fotograflari (`,f?.photos.length||0,`)`]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(f?.photos||[]).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`center`},children:[(0,x.jsx)(`a`,{href:e.file_url,target:`_blank`,rel:`noreferrer`,children:e.title}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,x.jsx)(_o,{type:`button`,onClick:()=>void ie(e.id,e),children:`Duzenle`}),(0,x.jsx)(_o,{type:`button`,onClick:()=>void ae(e.id),children:`Sil`})]})]},e.id)),(f?.photos||[]).length===0&&(0,x.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:12},children:`Kayit yok.`})]})]})]})}var xo=h.div`
  min-height: 100vh;
  background: #f0f4f8;
`,So=h.div`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Co=h.h1`
  margin: 0;
  color: #fff;
  font-size: 20px;
`,wo=h.button`
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`,To=h.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px 50px;
`,Eo=h.div`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
`,Do=h.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`,Oo=h.button`
  border: 1px solid ${e=>e.$active?`#0f766e`:`#cbd5e1`};
  background: ${e=>e.$active?`#ccfbf1`:`#fff`};
  color: ${e=>e.$active?`#134e4a`:`#334155`};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`,ko=h.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
`,Ao=h.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
`,jo=h.button`
  border: none;
  background: #2d6a9f;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`,Mo=h.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  margin-top: 12px;
`,No=h.div`
  border-bottom: 1px dashed #dbe3ee;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  &:last-child { border-bottom: none; }
`,Po=h.button`
  border: 1px solid ${e=>e.$danger?`#fecaca`:`#cbd5e1`};
  background: ${e=>e.$danger?`#fff5f5`:`#fff`};
  color: ${e=>e.$danger?`#b91c1c`:`#334155`};
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`,Fo=h.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${e=>e.$type===`success`?`#065f46`:`#991b1b`};
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
`;function Io(e){let t=new URLSearchParams(e).get(`tab`);return t===`certificates`||t===`company_docs`||t===`personnel_docs`||t===`guarantee_docs`?t:`certificates`}function Lo(){let e=m(),t=o(),{id:n}=r(),i=Number(n),a=(0,_.useRef)(null),[s,c]=(0,_.useState)(()=>Io(t.search)),[l,u]=(0,_.useState)([]),[d,f]=(0,_.useState)(!1),[p,h]=(0,_.useState)(!1),[g,v]=(0,_.useState)(``),[y,b]=(0,_.useState)(null),S=(e,t)=>{b({msg:e,type:t}),setTimeout(()=>b(null),3e3)};(0,_.useEffect)(()=>{c(Io(t.search))},[t.search]),(0,_.useEffect)(()=>{async function e(){if(!(!Number.isFinite(i)||i<=0)){h(!0);try{u(await sn(i,s))}catch{S(`Veriler yüklenemedi`,`error`)}finally{h(!1)}}}e()},[i,s]);let C=(0,_.useMemo)(()=>l.filter(e=>!g.trim()||e.original_filename.toLowerCase().includes(g.trim().toLowerCase())),[l,g]),w=t=>{e(`/admin/suppliers/${i}/workspace?tab=${t}`)},T=async e=>{let t=F();if(!t){S(`Oturum bulunamadı`,`error`);return}let n=`http://127.0.0.1:8000/api/v1/suppliers/${i}/documents/file/${encodeURIComponent(e.stored_filename||``)}?category=${encodeURIComponent(e.category)}`;try{let e=await fetch(n,{headers:{Authorization:`Bearer ${t}`}});if(!e.ok)throw Error(`HTTP ${e.status}`);let r=await e.blob(),i=URL.createObjectURL(r);window.open(i,`_blank`,`noopener,noreferrer`),setTimeout(()=>URL.revokeObjectURL(i),6e4)}catch{S(`Doküman açılamadı`,`error`)}},E=async e=>{if(window.confirm(`Bu dokümanı silmek istediğinize emin misiniz?`))try{await cn(i,e),S(`Doküman silindi`,`success`),u(await sn(i,s))}catch{S(`Doküman silinemedi`,`error`)}};return(0,x.jsxs)(xo,{children:[(0,x.jsxs)(So,{children:[(0,x.jsx)(Co,{children:`Evrak ve Dokümanlar`}),(0,x.jsx)(wo,{onClick:()=>e(`/admin/suppliers/${i}`),children:`← Tedarikçi Detayına Dön`})]}),(0,x.jsx)(To,{children:(0,x.jsxs)(Eo,{children:[(0,x.jsxs)(Do,{children:[(0,x.jsx)(Oo,{$active:s===`certificates`,onClick:()=>w(`certificates`),children:`Sertifikalar`}),(0,x.jsx)(Oo,{$active:s===`company_docs`,onClick:()=>w(`company_docs`),children:`Şirket Evrakları`}),(0,x.jsx)(Oo,{$active:s===`personnel_docs`,onClick:()=>w(`personnel_docs`),children:`Personel Evrakları`}),(0,x.jsx)(Oo,{$active:s===`guarantee_docs`,onClick:()=>w(`guarantee_docs`),children:`Alınan Teminatlar`})]}),p&&(0,x.jsx)(`div`,{style:{color:`#64748b`,fontSize:14},children:`Yükleniyor...`}),!p&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(ko,{children:[(0,x.jsx)(Ao,{value:g,onChange:e=>v(e.target.value),placeholder:`Dosya adına göre filtrele`}),(0,x.jsx)(jo,{onClick:()=>a.current?.click(),disabled:d,children:d?`⏳ Yükleniyor...`:`+ Evrak Yükle`})]}),(0,x.jsx)(`input`,{ref:a,type:`file`,accept:`application/pdf,image/jpeg,image/png,image/webp`,style:{display:`none`},onChange:async e=>{let t=e.target.files?.[0];if(t)try{f(!0),await ln(i,s,t),S(`Evrak yüklendi`,`success`),u(await sn(i,s))}catch(e){S(e?.response?.data?.detail||`Evrak yüklenemedi`,`error`)}finally{f(!1),e.target.value=``}}}),(0,x.jsxs)(Mo,{children:[C.length===0&&(0,x.jsx)(No,{style:{color:`#64748b`,fontSize:13},children:`Kayıt bulunamadı`}),C.map(e=>(0,x.jsxs)(No,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{fontWeight:700,fontSize:13},children:e.original_filename}),(0,x.jsx)(`div`,{style:{color:`#64748b`,fontSize:12},children:e.created_at?new Date(e.created_at).toLocaleString(`tr-TR`):``})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(Po,{type:`button`,onClick:()=>T(e),children:`Görüntüle`}),(0,x.jsx)(Po,{type:`button`,$danger:!0,onClick:()=>void E(e.id),children:`Sil`})]})]},e.id))]})]})]})}),y&&(0,x.jsx)(Fo,{$type:y.type,children:y.msg})]})}function Ro(e){let t=String(e).toLowerCase();return t===`approved`?`approved`:t===`rejected`?`rejected`:t===`submitted`||t===`sent`||t===`pending`||t===`responded`?`submitted`:`draft`}function zo(){let[e,t]=(0,_.useState)([]),[n,r]=(0,_.useState)(!0),[i,a]=(0,_.useState)(null),[o,s]=(0,_.useState)(1),[c,l]=(0,_.useState)(0),[u,d]=(0,_.useState)(new Set),[f,p]=(0,_.useState)(``),m=(0,_.useCallback)(async()=>{try{r(!0);let e=await ht(o,20);t(e.items),l(e.total)}catch(e){a(e instanceof Error?e.message:`Veri yüklenemedi`)}finally{r(!1)}},[o]);(0,_.useEffect)(()=>{m()},[m]);let h=e=>{let t=new Set(u);t.has(e)?t.delete(e):t.add(e),d(t)},g=()=>{u.size===e.length?d(new Set):d(new Set(e.map(e=>e.id)))},v=async()=>{if(u.size===0){a(`Lütfen en az bir teklif seçiniz`);return}try{for(let e of u)await St(e,f?{reason:f}:void 0);d(new Set),p(``),await m()}catch(e){a(e instanceof Error?e.message:`Onay işlemi başarısız`)}},y=async()=>{if(u.size===0){a(`Lütfen en az bir teklif seçiniz`);return}if(window.confirm(`${u.size} teklifi reddetmek istediğinizden emin misiniz?`))try{for(let e of u)await Ct(e,f?{reason:f}:void 0);d(new Set),p(``),await m()}catch(e){a(e instanceof Error?e.message:`Reddetme işlemi başarısız`)}};if(n)return(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:20},children:`Yükleniyor...`});let b=Math.ceil(c/20);return(0,x.jsxs)(`div`,{style:{padding:`20px`},children:[(0,x.jsx)(`h1`,{children:`Yönetici - Teklif Yönetimi`}),i&&(0,x.jsx)(`div`,{style:{color:`red`,padding:`12px`,background:`#fee2e2`,borderRadius:`4px`,marginBottom:`16px`},children:i}),u.size>0&&(0,x.jsxs)(`div`,{style:{background:`#f0f4ff`,padding:`16px`,borderRadius:`8px`,marginBottom:`16px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,x.jsxs)(`strong`,{children:[u.size,` teklif seçili`]}),(0,x.jsx)(`button`,{onClick:()=>d(new Set),style:{padding:`4px 8px`,background:`transparent`,border:`1px solid #3b82f6`,color:`#3b82f6`,borderRadius:`4px`,cursor:`pointer`},children:`Temizle`})]}),(0,x.jsx)(`textarea`,{placeholder:`İşlem notu (opsiyonel)`,value:f,onChange:e=>p(e.target.value),style:{width:`100%`,padding:`8px`,borderRadius:`4px`,border:`1px solid #ddd`,marginBottom:`12px`,boxSizing:`border-box`,minHeight:`60px`}}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,x.jsx)(`button`,{onClick:v,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Toplu Onayla`}),(0,x.jsx)(`button`,{onClick:y,style:{padding:`8px 16px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Toplu Reddet`})]})]}),(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f9fafb`,borderBottom:`2px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:(0,x.jsx)(`input`,{type:`checkbox`,checked:u.size===e.length&&e.length>0,onChange:g})}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`ID`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Başlık`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`right`},children:`Tutar`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Durum`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Oluşturan`}),(0,x.jsx)(`th`,{style:{padding:`12px`,textAlign:`left`},children:`Tarih`})]})}),(0,x.jsx)(`tbody`,{children:e.map(e=>{let t=Ro(e.status);return(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`,background:u.has(e.id)?`#f0f4ff`:`white`},children:[(0,x.jsx)(`td`,{style:{padding:`12px`},children:(0,x.jsx)(`input`,{type:`checkbox`,checked:u.has(e.id),onChange:()=>h(e.id)})}),(0,x.jsxs)(`td`,{style:{padding:`12px`,fontFamily:`monospace`,fontSize:`12px`},children:[`#`,e.id]}),(0,x.jsx)(`td`,{style:{padding:`12px`},children:e.title}),(0,x.jsx)(`td`,{style:{padding:`12px`,textAlign:`right`,fontWeight:`bold`},children:(e.total_amount??e.amount??0).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})}),(0,x.jsx)(`td`,{style:{padding:`12px`},children:(0,x.jsx)(`span`,{style:{padding:`4px 8px`,borderRadius:`4px`,background:kt[t],fontSize:`12px`,fontWeight:`bold`},children:Ot[t]})}),(0,x.jsxs)(`td`,{style:{padding:`12px`,fontSize:`12px`},children:[`Kullanıcı #`,e.created_by_id]}),(0,x.jsx)(`td`,{style:{padding:`12px`,fontSize:`12px`},children:new Date(e.created_at).toLocaleDateString(`tr-TR`)})]},e.id)})})]})}),b>1&&(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`center`,gap:`8px`,marginTop:`20px`,alignItems:`center`},children:[(0,x.jsx)(`button`,{onClick:()=>s(Math.max(1,o-1)),disabled:o===1,style:{padding:`8px 12px`,background:o===1?`#f3f4f6`:`white`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:o===1?`not-allowed`:`pointer`},children:`Önceki`}),Array.from({length:Math.min(5,b)},(e,t)=>{let n=Math.max(1,o-2)+t;return n<=b&&(0,x.jsx)(`button`,{onClick:()=>s(n),style:{padding:`8px 12px`,background:o===n?`#3b82f6`:`white`,color:o===n?`white`:`black`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`,fontWeight:o===n?`bold`:`normal`},children:n},n)}),(0,x.jsx)(`button`,{onClick:()=>s(Math.min(b,o+1)),disabled:o===b,style:{padding:`8px 12px`,background:o===b?`#f3f4f6`:`white`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:o===b?`not-allowed`:`pointer`},children:`Sonraki`}),(0,x.jsxs)(`span`,{style:{marginLeft:`12px`,color:`#666`,fontSize:`14px`},children:[`Sayfa `,o,` / `,b,` (Toplam: `,c,`)`]})]})]})}function Bo(){let{id:e}=r(),t=m(),[n,i]=(0,_.useState)(null),[a,o]=(0,_.useState)(!0),[s,c]=(0,_.useState)(null),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)({email:``,full_name:``,role:``,approval_limit:0,department_id:void 0}),p=(0,_.useCallback)(async()=>{try{o(!0);let t=(await qt()).find(t=>t.id===parseInt(e));t?(i(t),f({email:t.email,full_name:t.full_name,role:t.role,approval_limit:t.approval_limit,department_id:t.department_id})):c(`Personel bulunamadı`)}catch(e){c(e instanceof Error?e.message:`Yükleme hatası`)}finally{o(!1)}},[e]);return(0,_.useEffect)(()=>{p()},[p]),a?(0,x.jsx)(`div`,{style:{padding:20},children:`Yükleniyor...`}):s?(0,x.jsxs)(`div`,{style:{padding:20,color:`red`},children:[`❌ `,s]}):n?(0,x.jsxs)(`div`,{style:{padding:20,maxWidth:800,margin:`0 auto`},children:[(0,x.jsx)(`button`,{onClick:()=>t(`/admin`),style:{marginBottom:20,padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`← Geri Dön`}),(0,x.jsxs)(`h1`,{children:[`👤 `,n.full_name]}),l?(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,border:`1px solid #ddd`},children:[(0,x.jsx)(`h2`,{children:`Bilgileri Düzenle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:12,marginBottom:16},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Email:`}),(0,x.jsx)(`input`,{type:`email`,value:d.email,onChange:e=>f({...d,email:e.target.value}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Ad Soyad:`}),(0,x.jsx)(`input`,{type:`text`,value:d.full_name,onChange:e=>f({...d,full_name:e.target.value}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Rol:`}),(0,x.jsxs)(`select`,{value:d.role,onChange:e=>f({...d,role:e.target.value}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`},children:[(0,x.jsx)(`option`,{value:`satinalmaci`,children:`Satın Almacı (100K TL)`}),(0,x.jsx)(`option`,{value:`satinalma_uzmani`,children:`Satın Alma Uzmanı (200K TL)`}),(0,x.jsx)(`option`,{value:`satinalma_yoneticisi`,children:`Satın Alma Yöneticisi (300K TL)`}),(0,x.jsx)(`option`,{value:`satinalma_direktoru`,children:`Satın Alma Direktörü (1M TL)`})]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Onay Limiti:`}),(0,x.jsx)(`input`,{type:`number`,value:d.approval_limit,onChange:e=>f({...d,approval_limit:parseInt(e.target.value)}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`}})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(`button`,{onClick:async()=>{try{let t={email:d.email,full_name:d.full_name,role:d.role,approval_limit:d.approval_limit,department_id:d.department_id};await Yt(parseInt(e),t),c(null),u(!1),await p()}catch(e){c(e instanceof Error?e.message:`Güncelleme hatası`)}},style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`Kaydet`}),(0,x.jsx)(`button`,{onClick:()=>u(!1),style:{padding:`10px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})]}):(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,border:`1px solid #ddd`},children:[(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Email:`}),` `,n.email]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Rol:`}),` `,n.role===`satinalmaci`?`Satın Almacı`:n.role===`satinalma_uzmani`?`Satın Alma Uzmanı`:n.role===`satinalma_yoneticisi`?`Satın Alma Yöneticisi`:n.role===`satinalma_direktoru`?`Satın Alma Direktörü`:`Super Admin`]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Onay Limiti:`}),` `,n.approval_limit.toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Departman ID:`}),` `,n.department_id||`Atanmadı`]}),(0,x.jsx)(`button`,{onClick:()=>u(!0),style:{padding:`10px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`Düzenle`})]})]}):(0,x.jsx)(`div`,{style:{padding:20},children:`Personel bulunamadı`})}function Vo(){let{id:e}=r(),t=m(),[n,i]=(0,_.useState)(null),[a,o]=(0,_.useState)(!0),[s,c]=(0,_.useState)(null),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)({name:``,description:``}),p=(0,_.useCallback)(async()=>{try{o(!0);let t=(await Ht()).find(t=>t.id===parseInt(e));t?(i(t),f({name:t.name,description:t.description||``})):c(`Departman bulunamadı`)}catch(e){c(e instanceof Error?e.message:`Yükleme hatası`)}finally{o(!1)}},[e]);return(0,_.useEffect)(()=>{p()},[p]),a?(0,x.jsx)(`div`,{style:{padding:20},children:`Yükleniyor...`}):s?(0,x.jsxs)(`div`,{style:{padding:20,color:`red`},children:[`❌ `,s]}):n?(0,x.jsxs)(`div`,{style:{padding:20,maxWidth:800,margin:`0 auto`},children:[(0,x.jsx)(`button`,{onClick:()=>t(`/admin`),style:{marginBottom:20,padding:`8px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`← Geri Dön`}),(0,x.jsxs)(`h1`,{children:[`🏢 `,n.name]}),l?(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,border:`1px solid #ddd`},children:[(0,x.jsx)(`h2`,{children:`Departman Bilgilerini Düzenle`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr`,gap:12,marginBottom:16},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Departman Adı:`}),(0,x.jsx)(`input`,{type:`text`,value:d.name,onChange:e=>f({...d,name:e.target.value}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`}})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`Açıklama:`}),(0,x.jsx)(`textarea`,{value:d.description,onChange:e=>f({...d,description:e.target.value}),style:{width:`100%`,padding:8,borderRadius:4,border:`1px solid #ddd`,boxSizing:`border-box`,minHeight:100}})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,x.jsx)(`button`,{onClick:async()=>{try{await Wt(parseInt(e),d),c(null),u(!1),await p()}catch(e){c(e instanceof Error?e.message:`Güncelleme hatası`)}},style:{padding:`10px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`Kaydet`}),(0,x.jsx)(`button`,{onClick:()=>u(!1),style:{padding:`10px 16px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`İptal`})]})]}):(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:20,borderRadius:8,border:`1px solid #ddd`},children:[(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Departman Adı:`}),` `,n.name]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Açıklama:`}),` `,n.description||`Açıklama eklenmemiş`]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`strong`,{children:`Durum:`}),` `,n.is_active?`✅ Aktif`:`❌ Pasif`]}),(0,x.jsx)(`button`,{onClick:()=>u(!0),style:{padding:`10px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`Düzenle`})]})]}):(0,x.jsx)(`div`,{style:{padding:20},children:`Departman bulunamadı`})}function Ho(){let{user:e}=b(),{id:t}=r(),n=m(),[i,a]=(0,_.useState)(null),[o,s]=(0,_.useState)(!0),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(!1),[f,p]=(0,_.useState)({name:``,description:``,is_active:!0}),h=(0,_.useCallback)(async()=>{try{s(!0);let e=(await Nt()).find(e=>e.id===parseInt(t||`0`));e?(a(e),p({name:e.name,description:e.description||``,is_active:e.is_active})):l(`Firma bulunamadı`)}catch(e){l(e instanceof Error?e.message:`Yükleme başarısız`)}finally{s(!1)}},[t]);return(0,_.useEffect)(()=>{h()},[h]),e?.role===`super_admin`?o?(0,x.jsx)(`div`,{style:{padding:20},children:`Yükleniyor...`}):i?(0,x.jsxs)(`div`,{style:{padding:20,maxWidth:600},children:[(0,x.jsx)(`h1`,{children:`🏭 Firma Detayı`}),c&&(0,x.jsx)(`div`,{style:{color:`red`,padding:12,background:`#fee2e2`,borderRadius:4,marginBottom:16},children:c}),u?(0,x.jsxs)(`div`,{style:{background:`white`,padding:16,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h2`,{style:{marginTop:0},children:`Firmayı Düzenle`}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:12},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,marginBottom:4},children:`Firma Adı *`}),(0,x.jsx)(`input`,{type:`text`,value:f.name,onChange:e=>p({...f,name:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #d1d5db`,borderRadius:4,boxSizing:`border-box`,fontFamily:`inherit`}})]}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:12},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,marginBottom:4},children:`Açıklama`}),(0,x.jsx)(`textarea`,{value:f.description,onChange:e=>p({...f,description:e.target.value}),style:{width:`100%`,padding:8,border:`1px solid #d1d5db`,borderRadius:4,boxSizing:`border-box`,fontFamily:`inherit`,minHeight:80}})]}),(0,x.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:8,marginBottom:16},children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:f.is_active,onChange:e=>p({...f,is_active:e.target.checked})}),(0,x.jsx)(`span`,{style:{fontWeight:`bold`},children:`Aktif`})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:12},children:[(0,x.jsx)(`button`,{onClick:async()=>{if(!f.name){l(`Firma adı zorunludur`);return}try{a(await Ft(parseInt(t||`0`),f)),d(!1),l(null)}catch(e){l(e instanceof Error?e.message:`Kaydetme başarısız`)}},style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`✓ Kaydet`}),(0,x.jsx)(`button`,{onClick:()=>{d(!1),p({name:i.name,description:i.description||``,is_active:i.is_active})},style:{padding:`8px 16px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`✕ İptal`})]})]}):(0,x.jsxs)(`div`,{style:{background:`#f9fafb`,padding:16,borderRadius:8,border:`1px solid #e5e7eb`},children:[(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#666`,fontSize:12,marginBottom:4},children:`FIRMA ADI`}),(0,x.jsx)(`div`,{style:{fontSize:18,fontWeight:`bold`},children:i.name})]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#666`,fontSize:12,marginBottom:4},children:`AÇIKLAMA`}),(0,x.jsx)(`div`,{style:{whiteSpace:`pre-wrap`},children:i.description||`-`})]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#666`,fontSize:12,marginBottom:4},children:`DURUM`}),(0,x.jsx)(`div`,{children:i.is_active?(0,x.jsx)(`span`,{style:{color:`green`,fontWeight:`bold`},children:`✓ Aktif`}):(0,x.jsx)(`span`,{style:{color:`red`,fontWeight:`bold`},children:`✗ Pasif`})})]}),(0,x.jsxs)(`div`,{style:{marginBottom:16},children:[(0,x.jsx)(`div`,{style:{fontWeight:`bold`,color:`#666`,fontSize:12,marginBottom:4},children:`OLUŞTURMA TARİHİ`}),(0,x.jsx)(`div`,{children:new Date(i.created_at).toLocaleDateString(`tr-TR`,{year:`numeric`,month:`long`,day:`numeric`})})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:12},children:[(0,x.jsx)(`button`,{onClick:()=>d(!0),style:{padding:`8px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`✎ Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>n(`/admin`),style:{padding:`8px 16px`,background:`#6b7280`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`},children:`← Geri Dön`})]})]})]}):(0,x.jsxs)(`div`,{style:{padding:20},children:[(0,x.jsx)(`h2`,{children:`Firma Bulunamadı`}),(0,x.jsx)(`button`,{onClick:()=>n(`/admin`),style:{padding:`8px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Admin Paneline Dön`})]}):(0,x.jsx)(`div`,{style:{padding:20,color:`red`},children:`Sadece Super Admin bu sayfaya erişebilir`})}async function Uo(e=1,t=100,n){let r=new URLSearchParams({page:e.toString(),size:t.toString()});return n&&r.append(`status_filter`,n),(await G.get(`/quotes?${r.toString()}`)).data.items}var Wo=h.div`
  padding: 20px;
`,Go=h.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`,Ko=h.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`,qo=h(Ko)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`,Jo=h.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`,Yo=h.button`
  padding: 6px 12px;
  font-size: 12px;
  background-color: ${e=>e.variant===`danger`?`#ef4444`:e.variant===`info`?`#3b82f6`:`#10b981`};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`,Xo=h.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${e=>{switch(e.status){case`DRAFT`:return`#f3f4f6`;case`SENT`:return`#fef3c7`;case`PENDING`:return`#dbeafe`;case`RESPONDED`:return`#d1fae5`;case`APPROVED`:return`#86efac`;case`REJECTED`:return`#fecaca`;default:return`#f3f4f6`}}};
  color: ${e=>{switch(e.status){case`DRAFT`:return`#374151`;case`SENT`:return`#92400e`;case`PENDING`:return`#1e40af`;case`RESPONDED`:return`#065f46`;case`APPROVED`:return`#166534`;case`REJECTED`:return`#991b1b`;default:return`#374151`}}};
`,Zo=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,Qo=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;function $o({projectId:e,apiUrl:t,authToken:n}){let r=m(),[i,a]=(0,_.useState)([]),[o,s]=(0,_.useState)(!1),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)(null),[f,p]=(0,_.useState)(null),[h,g]=(0,_.useState)([]),v=e=>{r(`/quotes/${e}`)},y=e=>{r(`/quotes/${e}/edit`)},b=async e=>{if(window.confirm(`Bu teklifi silmek istediğinize emin misiniz?`))try{if(!(await fetch(`${t}/api/v1/quotes/${e}`,{method:`DELETE`,headers:{Authorization:`Bearer ${n}`}})).ok)throw Error(`Teklif silinemedi`);d(`Teklif silindi`),await T(),setTimeout(()=>d(null),2500)}catch(e){l(String(e))}},S=async()=>{let t=await G.get(`/suppliers/projects/${e}/suppliers`);g(Array.isArray(t.data)?t.data:[])},C=async e=>{try{await S(),p(e)}catch(e){l(e instanceof Error?e.message:`Projeye ekli tedarikçiler yüklenemedi`)}},w=e=>{let t=String(e||`DRAFT`).toUpperCase();return t===`DRAFT`?`Taslak`:t===`SENT`?`Gönderildi`:t===`PENDING`?`Onay Bekliyor`:t===`RESPONDED`?`Yanıtlandı`:t===`APPROVED`?`Onaylandı`:t===`REJECTED`?`Reddedildi`:t},T=(0,_.useCallback)(async()=>{try{s(!0),l(null);let r=await fetch(`${t}/api/v1/quotes/project/${e}`,{headers:{Authorization:`Bearer ${n}`}});if(!r.ok)throw Error(`Teklifler yüklenemedi`);a(await r.json())}catch(e){l(String(e))}finally{s(!1)}},[e,t,n]);return(0,_.useEffect)(()=>{T()},[T]),o?(0,x.jsx)(Wo,{children:`Yükleniyor...`}):(0,x.jsxs)(Wo,{children:[c&&(0,x.jsxs)(Zo,{children:[`❌ `,c]}),u&&(0,x.jsx)(Qo,{children:u}),f&&(0,x.jsx)(At,{quoteId:f.id,projectId:e,suppliers:h,onClose:()=>p(null),onSent:async()=>{d(`Teklif seçilen tedarikçilere gönderildi`),await T()}}),(0,x.jsxs)(Go,{children:[(0,x.jsxs)(`h2`,{children:[`Teklifler (`,i.length,`)`]}),(0,x.jsx)(Ko,{onClick:()=>r(`/quotes/create?projectId=${e}`),children:`+ Yeni Teklif`})]}),i.length===0?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`40px`,color:`#9ca3af`},children:(0,x.jsx)(`p`,{children:`Henüz teklif oluşturulmamış`})}):(0,x.jsxs)(Jo,{children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{children:`Başlık`}),(0,x.jsx)(`th`,{children:`Durum`}),(0,x.jsx)(`th`,{children:`Gönderildi`}),(0,x.jsx)(`th`,{children:`İşlemler`})]})}),(0,x.jsx)(`tbody`,{children:i.map(e=>(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{children:e.title}),(0,x.jsx)(`td`,{children:(0,x.jsx)(Xo,{status:String(e.status||`draft`).toUpperCase(),children:w(e.status)})}),(0,x.jsx)(`td`,{children:e.sent_at?new Date(e.sent_at).toLocaleDateString(`tr-TR`):`-`}),(0,x.jsxs)(`td`,{children:[(0,x.jsx)(Yo,{variant:`info`,onClick:()=>v(e.id),children:`Görüntüle`}),` `,(0,x.jsx)(Yo,{variant:`success`,onClick:()=>y(e.id),children:`Düzenle`}),` `,(0,x.jsx)(Yo,{variant:`info`,onClick:()=>C(e),children:`Gönder`}),` `,(0,x.jsx)(qo,{onClick:()=>b(e.id),children:`Sil`})]})]},e.id))})]})]})}var es=h.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,ts=h.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
  }
`,ns=h.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
  }
`,rs=h.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`,is=h.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 13px;

    &.active {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    &:hover:not(.active) {
      background-color: #f0f0f0;
    }
  }
`,as=h.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`,os=h.label`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid ${e=>e.selected?`#3b82f6`:`#e0e0e0`};
  border-radius: 4px;
  background-color: ${e=>e.selected?`#f0f7ff`:`white`};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }

  input {
    margin-right: 12px;
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
`,ss=h.div`
  flex: 1;

  .name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .details {
    font-size: 13px;
    color: #666;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`,cs=h.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;

    &.send {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }

    &.cancel {
      background-color: #e5e7eb;
      color: #333;

      &:hover {
        background-color: #d1d5db;
      }
    }
  }
`,ls=h.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
`,us=h.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,ds=h.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`,fs=[`Yazılım`,`Donanım`,`Hizmet`,`Danışmanlık`,`Muhasebe`,`İnsan Kaynakları`];function ps({projectId:e,onClose:t,onSuccess:n}){let[r,i]=(0,_.useState)([]),[a,o]=(0,_.useState)([]),[s,c]=(0,_.useState)(!0),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)(null),[p,m]=(0,_.useState)(null),[h,g]=(0,_.useState)(null);(0,_.useEffect)(()=>{v()},[]);let v=async()=>{try{c(!0),f(null);let e=await(await G.get(`/suppliers`)).data;i(Array.isArray(e)?e:[])}catch(e){f(`Tedarikçiler yüklenemedi: `+String(e))}finally{c(!1)}},y=h?r.filter(e=>e.category===h&&e.is_active):r.filter(e=>e.is_active),b=e=>{o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])};return(0,x.jsx)(es,{onClick:t,children:(0,x.jsxs)(ts,{onClick:e=>e.stopPropagation(),children:[(0,x.jsxs)(ns,{children:[(0,x.jsx)(`h2`,{children:`📧 Projeye Tedarikçi Ekle`}),(0,x.jsx)(rs,{onClick:t,children:`✕`})]}),d&&(0,x.jsx)(us,{children:d}),p&&(0,x.jsx)(ds,{children:p}),(0,x.jsx)(`h3`,{children:`Kategori Seç (Opsiyonel)`}),(0,x.jsxs)(is,{children:[(0,x.jsxs)(`button`,{className:h?``:`active`,onClick:()=>g(null),children:[`Tümü (`,r.filter(e=>e.is_active).length,`)`]}),fs.map(e=>(0,x.jsxs)(`button`,{className:h===e?`active`:``,onClick:()=>g(e),children:[e,` (`,r.filter(t=>t.category===e&&t.is_active).length,`)`]},e))]}),(0,x.jsx)(`h3`,{children:`Tedarikçileri Seç`}),s?(0,x.jsx)(ls,{children:`Tedarikçiler yükleniyor...`}):y.length===0?(0,x.jsx)(ls,{children:`Bu kategoride tedarikçi bulunamadı`}):(0,x.jsx)(as,{children:y.map(e=>(0,x.jsxs)(os,{selected:a.includes(e.id),children:[(0,x.jsx)(`input`,{type:`checkbox`,checked:a.includes(e.id),onChange:()=>b(e.id)}),(0,x.jsxs)(ss,{children:[(0,x.jsx)(`div`,{className:`name`,children:e.company_name}),(0,x.jsxs)(`div`,{className:`details`,children:[(0,x.jsxs)(`div`,{children:[`📧 `,e.email]}),(0,x.jsxs)(`div`,{children:[`📞 `,e.phone]}),e.category&&(0,x.jsxs)(`div`,{children:[`📂 `,e.category]})]})]})]},e.id))}),(0,x.jsxs)(cs,{children:[(0,x.jsx)(`button`,{className:`cancel`,onClick:t,children:`İptal`}),(0,x.jsx)(`button`,{className:`send`,onClick:async()=>{if(a.length===0){f(`En az bir tedarikçi seçmelisiniz`);return}try{u(!0),f(null);let r=(await G.post(`/suppliers/projects/${e}/suppliers`,a)).data;m(r.message||`Davetiyeler gönderildi!`),o([]),setTimeout(()=>{t(),n?.()},2e3)}catch(e){f(`Tedarikçiler gönderilemedi: `+String(e))}finally{u(!1)}},disabled:a.length===0||l,children:l?`Gönderiliyor...`:`Davetiye Gönder (${a.length})`})]})]})})}function ms(e){return!e.revisions||e.revisions.length===0?e:e.revisions.reduce((e,t)=>{let n=ms(e),r=ms(t);return r.revision_number>n.revision_number?r:n})}function hs(){let{id:e}=r(),t=m(),{user:n}=b(),i=parseInt(e||`0`),[a,o]=(0,_.useState)(null),[s,c]=(0,_.useState)([]),[l,u]=(0,_.useState)([]),[d,f]=(0,_.useState)([]),[p,h]=(0,_.useState)([]),[g,v]=(0,_.useState)({}),[y,S]=(0,_.useState)(!0),[C,w]=(0,_.useState)(!1),[T,E]=(0,_.useState)(!1),[D,O]=(0,_.useState)(!1),[k,A]=(0,_.useState)(!1),[j,M]=(0,_.useState)({}),[N,P]=(0,_.useState)(!1),F=(0,_.useCallback)(async()=>{try{S(!0);let[e,t]=await Promise.all([Tn(),Nt()]);c(t);let n=e.find(e=>e.id===i);if(o(n||null),n&&M(n),n){u(await An(i)),h(await Mn(i).catch(()=>[]));let e=(await Uo()).filter(e=>e.project_id===i),t=await Promise.all(e.map(async e=>({quote:e,groups:await Tt(e.id).catch(()=>[])}))),r={};for(let e of t)for(let t of e.groups){if(!t.quotes||t.quotes.length===0)continue;let n=ms(t.quotes.reduce((e,t)=>{let n=ms(e);return ms(t).revision_number>n.revision_number?t:e})),i={quoteId:e.quote.id,quoteTitle:e.quote.title,supplierQuoteId:n.id,status:n.status,totalAmount:Number(n.total_amount||0),initialAmount:Number(n.initial_final_amount||n.total_amount||0),submittedAt:n.submitted_at,revisionNumber:n.revision_number};r[t.supplier_id]||(r[t.supplier_id]=[]),r[t.supplier_id].push(i)}Object.keys(r).forEach(e=>{r[Number(e)].sort((e,t)=>t.quoteId-e.quoteId)}),v(r),n.project_type===`franchise`&&f(e.filter(e=>e.project_id===i&&e.status===`APPROVED`))}}catch(e){console.error(`Proje yükleme hatası:`,e)}finally{S(!1)}},[i]);(0,_.useEffect)(()=>{F()},[F]);async function I(){if(confirm(`Projeyi silmek istediğinize emin misiniz?`))try{await On(i),t(`/admin?tab=projects`)}catch(e){console.error(`Proje silme hatası:`,e),alert(`Proje silinemedi!`)}}async function L(){if(a)try{P(!0),await Dn(i,j),o({...a,...j}),O(!1),alert(`Proje güncellendi!`)}catch(e){console.error(`Proje güncelleme hatası:`,e),alert(`Proje güncellenemedi!`)}finally{P(!1)}}let R=async e=>{let t=e.target.files?.[0];if(t)try{w(!0),await kn(i,t),await F(),e.target.value=``}catch(e){console.error(`Dosya yükleme hatası:`,e)}finally{w(!1)}},z=async e=>{if(confirm(`Dosyayı silmek istediğinize emin misiniz?`))try{await jn(e),await F()}catch(e){console.error(`Dosya silme hatası:`,e)}};if(y)return(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`},children:`Yükleniyor...`});if(!a)return(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`,color:`red`},children:`Proje bulunamadı`});let B=e=>[`image/jpeg`,`image/png`,`image/gif`,`image/webp`].includes(e.file_type),V=e=>{let t=e.original_filename.toLowerCase();return t.endsWith(`.pdf`)?`📕`:t.endsWith(`.xlsx`)||t.endsWith(`.xls`)?`📊`:t.endsWith(`.docx`)||t.endsWith(`.doc`)?`📄`:t.endsWith(`.zip`)||t.endsWith(`.rar`)?`📦`:B(e)?`🖼️`:`📎`},ee=e=>B(e)?(0,x.jsx)(`img`,{src:`/api/v1/files/${e.id}/thumbnail`,alt:e.original_filename,style:{width:`60px`,height:`60px`,objectFit:`cover`,borderRadius:`4px`},onError:e=>{e.currentTarget.style.display=`none`}}):(0,x.jsx)(`div`,{style:{width:`60px`,height:`60px`,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`#f0f0f0`,borderRadius:`4px`,fontSize:`32px`},children:V(e)}),H=async e=>{try{let t=U();console.log(`Download token:`,t?`Present`:`Missing`);let n=await fetch(`/api/v1/files/${e.id}`,{method:`GET`,headers:t?{Authorization:`Bearer ${t}`}:{}});if(!n.ok)throw console.error(`Download response not ok:`,n.status,n.statusText),Error(`HTTP error! status: ${n.status}`);let r=await n.blob(),i=document.createElement(`a`);i.href=URL.createObjectURL(r),i.download=e.original_filename,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(i.href)}catch(e){console.error(`Dosya indirme hatası:`,e),alert(`Dosya indirilirken hata oluştu: ${e instanceof Error?e.message:`Bilinmeyen hata`}`)}},te=async e=>{try{let t=U();if(!(await fetch(`/api/v1/files/${e.id}/open`,{method:`GET`,headers:t?{Authorization:`Bearer ${t}`}:{}})).ok){H(e);return}}catch(t){console.error(`Dosya açma hatası:`,t),H(e)}},ne=e=>s.find(t=>t.id===e)?.name||`Firma yok`;return(0,x.jsxs)(`div`,{style:{padding:`24px`,maxWidth:`900px`,margin:`0 auto`},children:[(0,x.jsx)(`button`,{onClick:()=>t(`/admin?tab=projects`),style:{marginBottom:`20px`,padding:`8px 16px`,backgroundColor:`#f0f0f0`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`,fontSize:`14px`,fontWeight:`bold`},children:`← Geri Dön`}),(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`24px`,borderRadius:`8px`,border:`1px solid #e0e0e0`,marginBottom:`24px`},children:[(0,x.jsx)(`h1`,{style:{fontSize:`28px`,fontWeight:`bold`,margin:`0 0 16px 0`,color:`#333`},children:ne(a.company_id)}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr 1fr`,gap:`16px`,marginBottom:`16px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:{fontSize:`12px`,color:`#999`,fontWeight:`bold`,margin:`0 0 4px 0`,textTransform:`uppercase`},children:`Proje Adı`}),(0,x.jsx)(`p`,{style:{fontSize:`14px`,fontWeight:`600`,color:`#333`,margin:`0`},children:a.name})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:{fontSize:`12px`,color:`#999`,fontWeight:`bold`,margin:`0 0 4px 0`,textTransform:`uppercase`},children:`Tür`}),(0,x.jsx)(`span`,{style:{display:`inline-block`,fontSize:`12px`,padding:`6px 12px`,borderRadius:`4px`,backgroundColor:a.project_type===`franchise`?`#f3e5f5`:`#e3f2fd`,color:a.project_type===`franchise`?`#7b1fa2`:`#1976d2`,fontWeight:`bold`},children:a.project_type===`franchise`?`🍕 Franchise`:`🏢 Merkez`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:{fontSize:`12px`,color:`#999`,fontWeight:`bold`,margin:`0 0 4px 0`,textTransform:`uppercase`},children:`Kod`}),(0,x.jsx)(`p`,{style:{fontSize:`14px`,fontWeight:`600`,color:`#333`,margin:`0`},children:a.code})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,borderTop:`1px solid #e0e0e0`,paddingTop:`16px`},children:[(0,x.jsx)(`button`,{onClick:()=>O(!0),style:{...K.primaryButton,flex:`0 1 auto`},children:`✏️ Düzenle`}),(0,x.jsx)(`button`,{onClick:I,style:{...K.dangerButton,flex:`0 1 auto`},children:`🗑️ Sil`}),(0,x.jsx)(`button`,{onClick:()=>{let e=`🏢 ${ne(a.company_id)}\n📌 ${a.name}\n👤 ${a.manager_name||`Belirtilmemiş`}\n ${a.manager_phone||`Tel yok`}\n📮 ${a.address||`Adres belirtilmemiş`}`,t=`https://wa.me/?text=${encodeURIComponent(e)}`;window.open(t,`_blank`)},style:{padding:`10px 16px`,backgroundColor:`#25D366`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`14px`,flex:`0 1 auto`},children:`💬 WhatsApp Paylaş`}),(0,x.jsx)(`button`,{onClick:()=>A(!0),style:{padding:`10px 16px`,backgroundColor:`#8b5cf6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`14px`,flex:`0 1 auto`},children:`📧 Projeye Tedarikçi Ekle`})]})]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`16px`,marginBottom:`24px`},children:[(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`16px`,borderRadius:`8px`,border:`1px solid #e0e0e0`},children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`📊 Genel Bilgiler`}),a.budget&&(0,x.jsxs)(`p`,{style:{marginBottom:`8px`,fontSize:`13px`},children:[(0,x.jsx)(`strong`,{children:`Bütçe:`}),` `,new Intl.NumberFormat(`tr-TR`,{style:`currency`,currency:`TRY`}).format(a.budget)]}),a.description&&(0,x.jsxs)(`p`,{style:{marginBottom:`8px`,fontSize:`13px`},children:[(0,x.jsx)(`strong`,{children:`Açıklama:`}),` `,a.description]}),(0,x.jsxs)(`p`,{style:{marginBottom:`0`,fontSize:`13px`},children:[(0,x.jsx)(`strong`,{children:`Aktif:`}),` `,a.is_active?`✅ Evet`:`❌ Hayır`]})]}),(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`16px`,borderRadius:`8px`,border:`1px solid #e0e0e0`},children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`👤 Yetkili Bilgileri`}),a.manager_name||a.manager_phone?(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[a.manager_name&&(0,x.jsxs)(`p`,{style:{marginBottom:`0`,fontSize:`13px`},children:[(0,x.jsx)(`strong`,{children:`Adı Soyadı:`}),` `,a.manager_name]}),a.manager_phone&&(0,x.jsxs)(`p`,{style:{marginBottom:`0`,fontSize:`13px`,display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,x.jsx)(`strong`,{children:`Telefon:`}),` `,a.manager_phone,(0,x.jsx)(`a`,{href:`tel:${a.manager_phone}`,style:{padding:`4px 12px`,backgroundColor:`#4caf50`,color:`white`,borderRadius:`4px`,textDecoration:`none`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`},children:`📞 Ara`})]})]}):(0,x.jsx)(`p`,{style:{fontSize:`13px`,color:`#999`},children:`Yetkili bilgisi kayıtlı değil`})]})]}),a.address&&(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`16px`,borderRadius:`8px`,border:`1px solid #e0e0e0`,marginBottom:`24px`},children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`📍 Adres`}),(0,x.jsx)(`p`,{style:{marginBottom:`12px`,fontSize:`13px`},children:a.address}),a.latitude&&a.longitude&&(0,x.jsx)(`div`,{style:{width:`100%`,height:`300px`,borderRadius:`8px`,overflow:`hidden`,border:`1px solid #ddd`},children:(0,x.jsx)(`iframe`,{width:`100%`,height:`100%`,style:{border:0},loading:`lazy`,allowFullScreen:!0,src:`https://www.google.com/maps/embed/v1/place?key=AIzaSyBaXW3jHmQX3Q6K5Z9Y0L2M0N1O2P3Q4R&q=${encodeURIComponent(a.address)}`})}),(0,x.jsxs)(`div`,{style:{marginTop:`14px`,paddingTop:`12px`,borderTop:`1px solid #e5e7eb`},children:[(0,x.jsx)(`h4`,{style:{margin:`0 0 8px 0`,fontSize:`13px`,color:`#374151`},children:`Projeye Eklenen Tedarikçiler`}),p.length===0?(0,x.jsx)(`p`,{style:{margin:0,fontSize:`12px`,color:`#6b7280`},children:`Henüz tedarikçi eklenmemiş.`}):(0,x.jsx)(`div`,{style:{display:`grid`,gap:`10px`},children:p.map(e=>(0,x.jsxs)(`div`,{style:{border:`1px solid #d1d5db`,borderRadius:`8px`,padding:`10px`,background:e.is_active?`#f8fffb`:`#f9fafb`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`10px`},children:[(0,x.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:700,color:`#111827`},children:e.supplier_name}),(0,x.jsx)(`span`,{style:{fontSize:`11px`,padding:`2px 8px`,borderRadius:`999px`,background:e.is_active?`#dcfce7`:`#e5e7eb`,color:`#065f46`},children:e.is_active?`Aktif`:`Pasif`})]}),(0,x.jsx)(`div`,{style:{marginTop:`8px`,display:`grid`,gap:`6px`},children:(g[e.supplier_id]||[]).length===0?(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#6b7280`},children:`Henüz gelen teklif yok.`}):(g[e.supplier_id]||[]).map(n=>(0,x.jsxs)(`div`,{style:{border:`1px solid #e5e7eb`,borderRadius:`6px`,padding:`8px`,background:`#fff`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`8px`},children:[(0,x.jsxs)(`div`,{style:{flex:1},children:[(0,x.jsx)(`div`,{style:{fontSize:`12px`,fontWeight:700,color:`#1f2937`},children:n.quoteTitle}),(0,x.jsx)(`div`,{style:{fontSize:`12px`,color:`#475569`,marginTop:`2px`},children:n.revisionNumber>0&&n.initialAmount>0?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`span`,{style:{color:`#6b7280`},children:`İlk Teklif: `}),(0,x.jsx)(`span`,{style:{textDecoration:`line-through`,color:`#9ca3af`},children:n.initialAmount.toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`span`,{children:`Gelen teklif: `}),Number(n.totalAmount||0).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})]})}),n.revisionNumber>0&&n.initialAmount>0&&(0,x.jsxs)(`div`,{style:{marginTop:`4px`},children:[(0,x.jsxs)(`div`,{style:{fontSize:`12px`,color:`#1f2937`,fontWeight:600},children:[`Revize Teklif `,n.revisionNumber,`: `,Number(n.totalAmount||0).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`})]}),n.totalAmount<n.initialAmount&&(0,x.jsxs)(`div`,{style:{fontSize:`11px`,fontWeight:700,color:`#dc2626`,background:`#fef2f2`,border:`1px solid #fecaca`,borderRadius:`4px`,padding:`3px 7px`,marginTop:`3px`,display:`inline-block`},children:[`▼ İndirim: `,(n.initialAmount-n.totalAmount).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`}),` `,`(%`,((n.initialAmount-n.totalAmount)/n.initialAmount*100).toFixed(1),`)`]}),n.totalAmount>n.initialAmount&&(0,x.jsxs)(`div`,{style:{fontSize:`11px`,fontWeight:700,color:`#b45309`,background:`#fffbeb`,border:`1px solid #fde68a`,borderRadius:`4px`,padding:`3px 7px`,marginTop:`3px`,display:`inline-block`},children:[`▲ Artış: `,(n.totalAmount-n.initialAmount).toLocaleString(`tr-TR`,{style:`currency`,currency:`TRY`}),` `,`(%`,((n.totalAmount-n.initialAmount)/n.initialAmount*100).toFixed(1),`)`]})]})]}),(0,x.jsx)(`span`,{style:{fontSize:`11px`,background:`#f3f4f6`,borderRadius:`999px`,padding:`2px 8px`,color:`#374151`,whiteSpace:`nowrap`},children:n.status})]}),(0,x.jsxs)(`div`,{style:{marginTop:`6px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`8px`},children:[(0,x.jsx)(`span`,{style:{fontSize:`11px`,color:`#6b7280`},children:n.submittedAt?new Date(n.submittedAt).toLocaleString(`tr-TR`):`Tarih bilgisi yok`}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,x.jsx)(`button`,{onClick:()=>t(`/quotes/${n.quoteId}`),style:{padding:`5px 9px`,borderRadius:`4px`,border:`none`,background:`#2563eb`,color:`#fff`,fontSize:`11px`,cursor:`pointer`},children:`Göster`}),(0,x.jsx)(`button`,{onClick:()=>t(`/quotes/${n.quoteId}?supplierQuoteId=${n.supplierQuoteId}&action=revize`),style:{padding:`5px 9px`,borderRadius:`4px`,border:`none`,background:`#f59e0b`,color:`#fff`,fontSize:`11px`,cursor:`pointer`},children:`Revize`})]})]})]},`${e.supplier_id}-${n.quoteId}-${n.supplierQuoteId}`))})]},e.id))})]})]}),(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`16px`,borderRadius:`8px`,border:`1px solid #e0e0e0`,marginBottom:`24px`},children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`📁 Proje Dosyaları`}),(0,x.jsxs)(`label`,{style:{display:`block`,marginBottom:`16px`,padding:`16px`,border:`2px dashed #2196F3`,borderRadius:`8px`,textAlign:`center`,cursor:`pointer`,backgroundColor:`#f5f9ff`},children:[(0,x.jsx)(`input`,{type:`file`,onChange:R,disabled:C,style:{display:`none`}}),C?(0,x.jsx)(`p`,{style:{margin:`0`,fontWeight:`bold`},children:`⏳ Yükleniyor...`}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`p`,{style:{margin:`0 0 4px 0`,fontWeight:`bold`,color:`#2196F3`},children:`📤 Dosya Yükle`}),(0,x.jsx)(`p`,{style:{margin:`0`,fontSize:`12px`,color:`#666`},children:`Zip (500MB), Rar (500MB), JPEG, PNG, GIF, PDF, Excel, Word vb. desteklenir`})]})]}),l.length>0?(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:l.map(e=>(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`70px 1fr auto`,gap:`12px`,alignItems:`center`,padding:`12px`,backgroundColor:`#f9f9f9`,borderRadius:`4px`,border:`1px solid #e0e0e0`},children:[ee(e),(0,x.jsxs)(`div`,{style:{flex:`1`},children:[(0,x.jsx)(`p`,{style:{margin:`0 0 4px 0`,fontWeight:`bold`,fontSize:`13px`},children:e.original_filename}),(0,x.jsxs)(`p`,{style:{margin:`0`,fontSize:`12px`,color:`#666`},children:[(e.file_size/1024).toFixed(2),` KB`]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,x.jsx)(`button`,{onClick:()=>te(e),style:{padding:`6px 12px`,backgroundColor:`#2196F3`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`},children:`👁️ Aç`}),(0,x.jsx)(`button`,{onClick:()=>H(e),style:{padding:`6px 12px`,backgroundColor:`#4caf50`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`},children:`⬇️ İndir`}),(0,x.jsx)(`button`,{onClick:()=>z(e.id),style:{padding:`6px 12px`,backgroundColor:`#f44336`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`},children:`🗑️ Sil`})]})]},e.id))}):(0,x.jsx)(`p`,{style:{margin:`0`,fontSize:`13px`,color:`#999`},children:`Henüz dosya yüklenilmedi`}),(0,x.jsx)(`button`,{onClick:()=>t(`/admin/project-files/${i}`),style:{marginTop:`16px`,width:`100%`,padding:`10px`,backgroundColor:`#ff9800`,color:`white`,border:`none`,borderRadius:`4px`,fontWeight:`bold`,cursor:`pointer`,fontSize:`14px`},children:`📂 Tüm Dosyaları Göster`})]}),a.project_type===`franchise`&&(0,x.jsxs)(`div`,{style:{backgroundColor:`white`,padding:`16px`,borderRadius:`8px`,border:`1px solid #e0e0e0`},children:[(0,x.jsxs)(`button`,{onClick:()=>E(!T),style:{width:`100%`,padding:`12px`,backgroundColor:`#f3e5f5`,border:`1px solid #ce93d8`,borderRadius:`4px`,fontWeight:`bold`,cursor:`pointer`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,x.jsxs)(`span`,{children:[`💰 Onaylanan Teklifler (`,d.length,`)`]}),(0,x.jsx)(`span`,{children:T?`▼`:`▶`})]}),T&&(0,x.jsx)(`div`,{style:{marginTop:`12px`,paddingTop:`12px`,borderTop:`1px solid #e0e0e0`},children:d.length>0?(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[d.map(e=>(0,x.jsxs)(`div`,{style:{padding:`12px`,backgroundColor:`#fafafa`,borderRadius:`4px`,borderLeft:`4px solid #ce93d8`},children:[(0,x.jsx)(`p`,{style:{margin:`0 0 4px 0`,fontWeight:`bold`,fontSize:`13px`},children:e.title}),(0,x.jsxs)(`p`,{style:{margin:`0 0 4px 0`,fontSize:`13px`,color:`#666`},children:[`Miktar:`,` `,new Intl.NumberFormat(`tr-TR`,{style:`currency`,currency:`TRY`}).format(Number(e.amount||0))]}),(0,x.jsx)(`p`,{style:{margin:`0`,fontSize:`12px`,color:`#999`},children:e.description})]},e.id)),(0,x.jsxs)(`div`,{style:{paddingTop:`12px`,borderTop:`2px solid #ddd`,fontWeight:`bold`,fontSize:`14px`},children:[`Toplam Maliyet:`,` `,new Intl.NumberFormat(`tr-TR`,{style:`currency`,currency:`TRY`}).format(Number(d.reduce((e,t)=>e+(t.amount||0),0)))]})]}):(0,x.jsx)(`p`,{style:{margin:`0`,fontSize:`13px`,color:`#999`},children:`Onaylanan teklif bulunmuyor`})})]}),a&&n&&(0,x.jsx)(`div`,{style:{marginTop:`20px`},children:(0,x.jsx)($o,{projectId:i,apiUrl:`http://localhost:8000`,authToken:U()||``})}),k&&(0,x.jsx)(ps,{projectId:i,onClose:()=>A(!1),onSuccess:()=>{F()}}),D&&(0,x.jsx)(`div`,{style:K.backdrop,children:(0,x.jsxs)(`div`,{style:K.container,children:[(0,x.jsxs)(`div`,{style:K.header,children:[(0,x.jsx)(`h2`,{style:K.title,children:`✏️ Proje Düzenle`}),(0,x.jsx)(`button`,{onClick:()=>O(!1),style:K.closeButton,children:`✕`})]}),(0,x.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),L()},style:K.content,children:[(0,x.jsxs)(`div`,{style:K.grid,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Adı`}),(0,x.jsx)(`input`,{type:`text`,value:j.name||``,onChange:e=>M({...j,name:e.target.value}),style:K.input})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Proje Kodu`}),(0,x.jsx)(`input`,{type:`text`,value:j.code||``,onChange:e=>M({...j,code:e.target.value}),style:K.input})]})]}),(0,x.jsxs)(`div`,{style:K.grid,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Yetkilisi`}),(0,x.jsx)(`input`,{type:`text`,value:j.manager_name||``,onChange:e=>M({...j,manager_name:e.target.value}),style:K.input})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:K.label,children:`Telefon`}),(0,x.jsx)(`input`,{type:`tel`,value:j.manager_phone||``,onChange:e=>M({...j,manager_phone:e.target.value}),style:K.input})]})]}),(0,x.jsxs)(`div`,{style:K.fullWidth,children:[(0,x.jsx)(`label`,{style:K.label,children:`Adres`}),(0,x.jsx)(`textarea`,{value:j.address||``,onChange:e=>M({...j,address:e.target.value}),rows:2,style:K.textarea})]}),(0,x.jsxs)(`div`,{style:K.fullWidth,children:[(0,x.jsx)(`label`,{style:K.label,children:`Bütçe`}),(0,x.jsx)(`input`,{type:`number`,value:j.budget||``,onChange:e=>M({...j,budget:parseFloat(e.target.value)}),step:`0.01`,min:`0`,style:K.input})]}),(0,x.jsxs)(`div`,{style:K.footer,children:[(0,x.jsx)(`button`,{type:`submit`,disabled:N,style:N?K.primaryButtonDisabled:K.primaryButton,children:N?`⏳ Kaydediliyor...`:`✅ Güncelle`}),(0,x.jsx)(`button`,{type:`button`,onClick:()=>O(!1),style:K.secondaryButton,children:`❌ İptal`})]})]})]})})]})}function gs(){let{id:e}=r(),t=m(),n=parseInt(e||`0`),[i,a]=(0,_.useState)([]),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)([]),[u,d]=(0,_.useState)(!0),[f,p]=(0,_.useState)(null),h=(0,_.useCallback)(async()=>{try{d(!0);let[e,t,r]=await Promise.all([Tn(),Nt(),An(n)]);l(t),s(e.find(e=>e.id===n)||null),a(r)}catch(e){console.error(`Veri yükleme hatası:`,e)}finally{d(!1)}},[n]);(0,_.useEffect)(()=>{h()},[h]);async function g(e){if(confirm(`Dosyayı silmek istediğinize emin misiniz?`))try{await jn(e),a(i.filter(t=>t.id!==e)),f?.id===e&&p(null)}catch(e){console.error(`Dosya silme hatası:`,e),alert(`Dosya silinemedi!`)}}let v=e=>[`image/jpeg`,`image/png`,`image/gif`,`image/webp`].includes(e.file_type),y=async e=>{try{let t=U();console.log(`Download token:`,t?`Present`:`Missing`);let n=await fetch(`/api/v1/files/${e.id}`,{method:`GET`,headers:t?{Authorization:`Bearer ${t}`}:{}});if(!n.ok)throw console.error(`Download response not ok:`,n.status,n.statusText),Error(`HTTP error! status: ${n.status}`);let r=await n.blob(),i=document.createElement(`a`);i.href=URL.createObjectURL(r),i.download=e.original_filename,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(i.href)}catch(e){console.error(`Dosya indirme hatası:`,e),alert(`Dosya indirilirken hata oluştu: ${e instanceof Error?e.message:`Bilinmeyen hata`}`)}},b=async e=>{try{let t=U();if(!(await fetch(`/api/v1/files/${e.id}/open`,{method:`GET`,headers:t?{Authorization:`Bearer ${t}`}:{}})).ok){y(e);return}}catch(t){console.error(`Dosya açma hatası:`,t),y(e)}},S=e=>c.find(t=>t.id===e)?.name||`Firma yok`,C=e=>{let t=e.original_filename.toLowerCase();return t.endsWith(`.pdf`)?`📕`:t.endsWith(`.xlsx`)||t.endsWith(`.xls`)?`📊`:t.endsWith(`.docx`)||t.endsWith(`.doc`)?`📄`:t.endsWith(`.zip`)||t.endsWith(`.rar`)?`📦`:v(e)?`🖼️`:`📎`},w=e=>v(e)?(0,x.jsx)(`img`,{src:`/api/v1/files/${e.id}/thumbnail`,alt:e.original_filename,style:{width:`60px`,height:`60px`,objectFit:`cover`,borderRadius:`4px`},onError:e=>{e.currentTarget.style.display=`none`}}):(0,x.jsx)(`div`,{style:{width:`60px`,height:`60px`,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`#f0f0f0`,borderRadius:`4px`,fontSize:`32px`},children:C(e)});return u?(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`},children:`Yükleniyor...`}):o?(0,x.jsxs)(`div`,{style:{padding:`24px`,maxWidth:`1200px`,margin:`0 auto`},children:[(0,x.jsx)(`button`,{onClick:()=>t(`/admin/projects/${n}`),style:{marginBottom:`20px`,padding:`8px 16px`,backgroundColor:`#f0f0f0`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`,fontSize:`14px`,fontWeight:`bold`},children:`← Geri Dön`}),(0,x.jsx)(`h1`,{style:{fontSize:`24px`,fontWeight:`bold`,margin:`0 0 8px 0`},children:S(o.company_id)}),(0,x.jsxs)(`p`,{style:{fontSize:`14px`,color:`#666`,margin:`0 0 24px 0`},children:[o.name,` - Tüm Dosyalar (`,i.length,`)`]}),i.length>0?(0,x.jsxs)(`div`,{children:[i.some(e=>v(e))&&(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`🖼️ Görseller`}),(0,x.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(150px, 1fr))`,gap:`12px`,marginBottom:`32px`},children:i.filter(e=>v(e)).map(e=>(0,x.jsxs)(`div`,{style:{borderRadius:`8px`,overflow:`hidden`,border:`1px solid #e0e0e0`,backgroundColor:`white`},children:[(0,x.jsx)(`img`,{src:`/api/v1/files/${e.id}/thumbnail`,alt:e.original_filename,style:{width:`100%`,height:`150px`,objectFit:`cover`,cursor:`pointer`},onClick:()=>p(e),onError:e=>{e.currentTarget.style.backgroundColor=`#f0f0f0`}}),(0,x.jsxs)(`div`,{style:{padding:`8px`,display:`flex`,gap:`4px`},children:[(0,x.jsx)(`button`,{onClick:()=>b(e),style:{flex:`1`,padding:`6px`,backgroundColor:`#2196F3`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,fontWeight:`bold`},children:`👁️ Görüntüle`}),(0,x.jsx)(`button`,{onClick:()=>y(e),style:{flex:`1`,padding:`6px`,backgroundColor:`#4caf50`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,fontWeight:`bold`},children:`⬇️ İndir`}),(0,x.jsx)(`button`,{onClick:()=>g(e.id),style:{flex:`1`,padding:`6px`,backgroundColor:`#f44336`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,fontWeight:`bold`},children:`🗑️ Sil`})]})]},e.id))})]}),i.some(e=>!v(e))&&(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{style:{fontSize:`14px`,fontWeight:`bold`,marginBottom:`12px`,color:`#333`},children:`📄 Diğer Dosyalar`}),(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:i.filter(e=>!v(e)).map(e=>(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`12px`,justifyContent:`space-between`,alignItems:`center`,padding:`12px`,backgroundColor:`#f9f9f9`,borderRadius:`4px`,border:`1px solid #e0e0e0`},children:[(0,x.jsx)(`div`,{style:{flexShrink:0},children:w(e)}),(0,x.jsxs)(`div`,{style:{flex:`1`,minWidth:0},children:[(0,x.jsx)(`p`,{style:{margin:`0 0 4px 0`,fontWeight:`bold`,fontSize:`13px`,wordBreak:`break-word`},children:e.original_filename}),(0,x.jsxs)(`p`,{style:{margin:`0`,fontSize:`12px`,color:`#666`},children:[(e.file_size/1024/1024).toFixed(2),` MB`]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexShrink:0},children:[(0,x.jsx)(`button`,{onClick:()=>b(e),style:{padding:`6px 12px`,backgroundColor:`#2196F3`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`,fontWeight:`bold`},children:`🔓 Aç`}),(0,x.jsx)(`button`,{onClick:()=>y(e),style:{padding:`6px 12px`,backgroundColor:`#4caf50`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`,fontWeight:`bold`},children:`⬇️ İndir`}),(0,x.jsx)(`button`,{onClick:()=>g(e.id),style:{padding:`6px 12px`,backgroundColor:`#f44336`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`12px`,cursor:`pointer`,whiteSpace:`nowrap`,fontWeight:`bold`},children:`🗑️ Sil`})]})]},e.id))})]})]}):(0,x.jsx)(`p`,{style:{fontSize:`14px`,color:`#999`},children:`Henüz dosya yüklenilmedi`}),f&&(0,x.jsxs)(`div`,{onClick:()=>p(null),style:{position:`fixed`,top:`0`,left:`0`,right:`0`,bottom:`0`,backgroundColor:`rgba(0, 0, 0, 0.8)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:`9999`},children:[(0,x.jsx)(`button`,{onClick:()=>p(null),style:{position:`absolute`,top:`20px`,right:`20px`,backgroundColor:`white`,color:`black`,border:`none`,borderRadius:`50%`,width:`40px`,height:`40px`,fontSize:`24px`,cursor:`pointer`,fontWeight:`bold`,zIndex:`10000`},children:`✕`}),(0,x.jsx)(`img`,{src:`/api/v1/files/${f.id}`,alt:f.original_filename,style:{maxWidth:`90%`,maxHeight:`90vh`,borderRadius:`8px`,boxShadow:`0 0 30px rgba(0, 0, 0, 0.3)`},onClick:e=>e.stopPropagation()}),(0,x.jsxs)(`div`,{style:{position:`absolute`,bottom:`20px`,left:`50%`,transform:`translateX(-50%)`,display:`flex`,gap:`12px`,alignItems:`center`,justifyContent:`center`,flexDirection:`column`},children:[(0,x.jsx)(`p`,{style:{color:`white`,fontSize:`14px`,margin:`0`,maxWidth:`80%`,textAlign:`center`},children:f.original_filename}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,x.jsx)(`button`,{onClick:e=>{e.stopPropagation(),b(f)},style:{padding:`8px 16px`,backgroundColor:`#2196f3`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`13px`,cursor:`pointer`,fontWeight:`bold`},children:`🔓 Aç`}),(0,x.jsx)(`button`,{onClick:e=>{e.stopPropagation(),y(f)},style:{padding:`8px 16px`,backgroundColor:`#4caf50`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`13px`,cursor:`pointer`,fontWeight:`bold`},children:`⬇️ İndir`}),(0,x.jsx)(`button`,{onClick:e=>{e.stopPropagation(),confirm(`Dosyayı silmek istediğinize emin misiniz?`)&&(g(f.id),p(null))},style:{padding:`8px 16px`,backgroundColor:`#f44336`,color:`white`,border:`none`,borderRadius:`4px`,fontSize:`13px`,cursor:`pointer`,fontWeight:`bold`},children:`🗑️ Sil`})]})]})]})]}):(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:`32px`,color:`red`},children:`Proje bulunamadı`})}async function _s(){return(await G.get(`/settings`)).data}async function vs(e){return(await G.put(`/settings`,e)).data}async function ys(){return _s()}var bs=`http://localhost:8000`,$={page:{maxWidth:`960px`,margin:`0 auto`,padding:`24px 16px`},card:{background:`#fff`,border:`1px solid #e5e7eb`,borderRadius:`8px`,padding:`20px`,marginBottom:`16px`},sectionTitle:{fontSize:`15px`,fontWeight:700,color:`#111827`,marginBottom:`16px`,paddingBottom:`8px`,borderBottom:`2px solid #3b82f6`,display:`inline-block`},row:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`},row3:{display:`grid`,gridTemplateColumns:`1fr 1fr 1fr`,gap:`12px`},label:{display:`block`,fontSize:`13px`,fontWeight:600,marginBottom:`4px`,color:`#374151`},input:{width:`100%`,padding:`8px 10px`,borderRadius:`6px`,border:`1px solid #d1d5db`,fontSize:`14px`,boxSizing:`border-box`},textarea:{width:`100%`,padding:`8px 10px`,borderRadius:`6px`,border:`1px solid #d1d5db`,fontSize:`14px`,boxSizing:`border-box`,resize:`vertical`},select:{width:`100%`,padding:`8px 10px`,borderRadius:`6px`,border:`1px solid #d1d5db`,fontSize:`14px`,background:`#fff`},btn:e=>({padding:`9px 20px`,background:e,color:`#fff`,border:`none`,borderRadius:`6px`,cursor:`pointer`,fontWeight:600,fontSize:`14px`}),tabBtn:e=>({padding:`8px 20px`,border:`none`,borderRadius:`6px 6px 0 0`,cursor:`pointer`,fontWeight:600,fontSize:`13px`,background:e?`#3b82f6`:`#e5e7eb`,color:e?`#fff`:`#374151`}),th:{padding:`10px 8px`,textAlign:`left`,fontSize:`12px`,fontWeight:700,color:`#6b7280`,background:`#f3f4f6`},td:{padding:`6px 4px`},itemInput:{width:`100%`,padding:`5px 6px`,border:`1px solid #d1d5db`,borderRadius:`4px`,fontSize:`13px`,boxSizing:`border-box`}},xs=()=>({line_number:``,category_code:``,category_name:``,description:``,unit:`adet`,quantity:1,unit_price:void 0,vat_rate:20,notes:``}),Ss=e=>{if(!e)return{detail:``,imageUrl:``};try{let t=JSON.parse(e);return{detail:t.detail||``,imageUrl:t.image_url||``}}catch{return{detail:e,imageUrl:``}}},Cs=(e,t)=>{let n=e.trim(),r=t.trim();if(!(!n&&!r))return JSON.stringify({detail:n,image_url:r})},ws=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(String(r.result||``)),r.onerror=()=>n(Error(`Dosya okunamadı`)),r.readAsDataURL(e)}),Ts=e=>{let t=0,n=``,r=0,i={};return e.map(e=>{if(Es(e))return t+=1,n=String(t),i[n]=0,{...e,is_group_header:!0,group_key:n,line_number:n};let a=e.group_key||n;return a?(i[a]||(i[a]=0),i[a]+=1,{...e,is_group_header:!1,group_key:a,line_number:`${a}.${i[a]}`}):(r+=1,{...e,is_group_header:!1,group_key:void 0,line_number:String(r)})})},Es=e=>{if(e.is_group_header)return!0;let t=String(e.line_number||``).trim();return t.length>0&&!t.includes(`.`)},Ds=e=>{if(e.group_key)return String(e.group_key);let t=String(e.line_number||``).trim();return t?t.includes(`.`)?t.split(`.`)[0]:t:``},Os=e=>{let t={};return e.forEach(e=>{if(Es(e))return;let n=Ds(e);if(!n)return;let r=Number(e.quantity||0)*Number(e.unit_price||0),i=r*(Number(e.vat_rate??20)/100);t[n]||(t[n]={net:0,vat:0,gross:0}),t[n].net+=r,t[n].vat+=i,t[n].gross+=r+i}),t};function ks(){let e=m(),[t]=i(),n=(0,_.useRef)(null),{user:r}=b(),[a,o]=(0,_.useState)([]),[s,c]=(0,_.useState)([]),[l,u]=(0,_.useState)([]),[d,f]=(0,_.useState)(``),[p,h]=(0,_.useState)(``),[g,v]=(0,_.useState)(``),[y,S]=(0,_.useState)(``),[C,w]=(0,_.useState)(``),[T,E]=(0,_.useState)(`manual`),[D,O]=(0,_.useState)(null),[k,A]=(0,_.useState)(Ts([xs()])),[j,M]=(0,_.useState)({}),[N,P]=(0,_.useState)([1,10,20]),[F,I]=(0,_.useState)(!1),[L,R]=(0,_.useState)(null),z=!!(r&&r.role!==`admin`&&r.role!==`super_admin`);(0,_.useEffect)(()=>{if(!z||!r)return;let e=l.find(e=>e.id===r.id)?.department_id,t=r.department_id??e;v(r.id),t&&h(t)},[z,r,l]);let B=z?p||``:p,V=z?g||``:g;(0,_.useEffect)(()=>{Promise.all([Kt(),Ht(),qt()]).then(([e,t,n])=>{o(e),c(t),u(n)}),_s().then(e=>{Array.isArray(e.vat_rates)&&e.vat_rates.length>0&&P(e.vat_rates)}).catch(()=>{P([1,10,20])})},[]),(0,_.useEffect)(()=>{let e=Number(t.get(`projectId`)||``);e>0&&f(e)},[t]);let ee=B?l.filter(e=>e.department_id===Number(B)):l,H=z&&r?ee.filter(e=>e.id===r.id):ee,te=Os(k),ne=k.filter(e=>!Es(e)).reduce((e,t)=>e+Number(t.quantity||0)*Number(t.unit_price||0),0),re=k.filter(e=>!Es(e)).reduce((e,t)=>e+Number(t.quantity||0)*Number(t.unit_price||0)*(Number(t.vat_rate??20)/100),0),W=ne+re,ie=(e,t,n)=>{A(r=>{let i=[...r],a={...i[e],[t]:n};return(t===`quantity`||t===`unit_price`)&&a.unit_price,i[e]=a,Ts(i)})},ae=async(e,t)=>{try{let n=await ws(t);ie(e,`notes`,Cs(Ss(k[e]?.notes).detail,n))}catch{R(`Görsel dosyası okunamadı`)}},oe=()=>{A(e=>{let t=[...e].reverse().find(e=>Es(e)&&Ds(e)),n=t?Ds(t):void 0;return Ts([...e,{...xs(),group_key:n,is_group_header:!1}])})},se=()=>{A(e=>Ts([...e,{...xs(),description:`Yeni Grup`,unit:``,quantity:0,unit_price:void 0,vat_rate:20,is_group_header:!0}]))},G=e=>A(t=>Ts(t.filter((t,n)=>n!==e))),ce=e=>{M(t=>({...t,[e]:!t[e]}))};return(0,x.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),!d){R(`Lütfen proje seçiniz`);return}if(!y.trim()){R(`Teklif başlığı zorunludur`);return}if(!B){R(`Departman bilgisi bulunamadı. Yöneticinize başvurun.`);return}if(!V){R(`Sorumlu kişi bilgisi bulunamadı.`);return}I(!0),R(null);try{if(T===`excel`){if(!D){R(`Lütfen Excel dosyası seçiniz`),I(!1);return}let t=new FormData;t.append(`file`,D),t.append(`company_name`,`Proje Tedarikçi Havuzu`),t.append(`company_contact_name`,r?.full_name||`Sistem Kullanıcısı`),t.append(`company_contact_phone`,`-`),t.append(`company_contact_email`,r?.email||`system@procureflow.local`),y&&t.append(`title`,y);let n=U(),i=await fetch(`${bs}/api/v1/quotes/import/excel/${d}`,{method:`POST`,headers:{Authorization:`Bearer ${n}`},body:t});if(!i.ok){let e=await i.json().catch(()=>({}));throw Error(e.detail||`Excel yükleme hatası`)}e(`/quotes/${(await i.json()).quote_id}`)}else{let t=k.filter(e=>e.description.trim()||e.line_number.trim()).map(e=>{let t=Es(e),n=Ds(e);return{...e,group_key:n||void 0,is_group_header:t,unit:t?``:e.unit,quantity:t?0:Number(e.quantity||0),unit_price:t||e.unit_price===void 0||e.unit_price===null||e.unit_price===0?void 0:Number(e.unit_price),vat_rate:Number(e.vat_rate??20)}}),n=await _t({project_id:Number(d),title:y.trim(),description:C.trim()||void 0,company_name:`Proje Tedarikçi Havuzu`,company_contact_name:r?.full_name||`Sistem Kullanıcısı`,company_contact_phone:`-`,company_contact_email:r?.email||`system@procureflow.local`,department_id:Number(B),assigned_to_id:Number(V)});t.length>0&&await vt(n.id,t),e(`/quotes/${n.id}`)}}catch(e){R(e instanceof Error?e.message:`Teklif oluşturulamadı`)}finally{I(!1)}},style:$.page,children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`,marginBottom:`20px`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:()=>e(-1),style:{padding:`6px 12px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`6px`,cursor:`pointer`},children:`← Geri`}),(0,x.jsx)(`h2`,{style:{margin:0,fontSize:`20px`},children:`Yeni Teklif Talebi`})]}),L&&(0,x.jsx)(`div`,{style:{background:`#fee2e2`,color:`#991b1b`,padding:`12px 16px`,borderRadius:`6px`,marginBottom:`16px`},children:L}),(0,x.jsxs)(`div`,{style:$.card,children:[(0,x.jsx)(`div`,{style:$.sectionTitle,children:`① Temel Bilgiler`}),(0,x.jsxs)(`div`,{style:{marginBottom:`12px`},children:[(0,x.jsx)(`label`,{style:$.label,children:`Başlık *`}),(0,x.jsx)(`input`,{style:$.input,value:y,onChange:e=>S(e.target.value),placeholder:`Teklif başlığı`,required:!0})]}),(0,x.jsxs)(`div`,{style:{marginBottom:`12px`},children:[(0,x.jsx)(`label`,{style:$.label,children:`Açıklama`}),(0,x.jsx)(`textarea`,{style:$.textarea,rows:2,value:C,onChange:e=>w(e.target.value),placeholder:`İsteğe bağlı açıklama`})]}),(0,x.jsxs)(`div`,{style:$.row3,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:$.label,children:`Proje *`}),(0,x.jsxs)(`select`,{style:$.select,value:d,onChange:e=>f(Number(e.target.value)||``),required:!0,children:[(0,x.jsx)(`option`,{value:``,children:`-- Proje seçin --`}),a.map(e=>(0,x.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.code,`)`]},e.id))]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:$.label,children:`Departman`}),(0,x.jsxs)(`select`,{style:$.select,value:B,onChange:e=>{h(Number(e.target.value)||``),v(``)},disabled:z,children:[(0,x.jsx)(`option`,{value:``,children:`-- Departman seçin --`}),s.map(e=>(0,x.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:$.label,children:`Sorumlu Kişi`}),(0,x.jsxs)(`select`,{style:$.select,value:V,onChange:e=>v(Number(e.target.value)||``),disabled:z,children:[(0,x.jsx)(`option`,{value:``,children:`-- Kişi seçin --`}),H.map(e=>(0,x.jsxs)(`option`,{value:e.id,children:[e.full_name,` (`,e.role,`)`]},e.id))]})]})]})]}),(0,x.jsxs)(`div`,{style:$.card,children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-end`,marginBottom:`16px`},children:[(0,x.jsx)(`div`,{style:$.sectionTitle,children:`② Teklif Kalemleri`}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`4px`},children:[(0,x.jsx)(`button`,{type:`button`,style:$.tabBtn(T===`manual`),onClick:()=>E(`manual`),children:`Manuel Giriş`}),(0,x.jsx)(`button`,{type:`button`,style:$.tabBtn(T===`excel`),onClick:()=>E(`excel`),children:`Excel'den İçe Aktar`})]})]}),T===`excel`?(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:$.label,children:`Excel Dosyası (.xlsx/.xlsm) *`}),(0,x.jsx)(`input`,{ref:n,type:`file`,accept:`.xlsx,.xlsm,.xls`,onChange:e=>O(e.target.files?.[0]||null),style:{marginBottom:`8px`}}),D&&(0,x.jsxs)(`div`,{style:{fontSize:`13px`,color:`#059669`,marginTop:`4px`},children:[`✓ `,D.name,` seçildi (`,(D.size/1024).toFixed(0),` KB)`]}),(0,x.jsx)(`p`,{style:{fontSize:`12px`,color:`#6b7280`,marginTop:`8px`},children:`PİZZAMAX_TEKLİF_ formatında Excel dosyası yükleyiniz. Kalemler otomatik okunacaktır.`})]}):(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`13px`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{style:{...$.th,width:`50px`},children:`Sıra`}),(0,x.jsx)(`th`,{style:{...$.th,minWidth:`180px`},children:`Açıklama *`}),(0,x.jsx)(`th`,{style:{...$.th,width:`60px`},children:`Birim`}),(0,x.jsx)(`th`,{style:{...$.th,width:`70px`},children:`Miktar`}),(0,x.jsx)(`th`,{style:{...$.th,width:`100px`},children:`Birim Fiyat`}),(0,x.jsx)(`th`,{style:{...$.th,width:`120px`},children:`Birim Toplam Fiyat`}),(0,x.jsx)(`th`,{style:{...$.th,width:`86px`},children:`KDV`}),(0,x.jsx)(`th`,{style:{...$.th,width:`110px`},children:`KDV Tutar`}),(0,x.jsx)(`th`,{style:{...$.th,width:`130px`},children:`KDV Dahil Toplam`}),(0,x.jsx)(`th`,{style:{...$.th,width:`36px`}})]})}),(0,x.jsx)(`tbody`,{children:k.map((e,t)=>{let n=Es(e),r=Ds(e),i=Ss(e.notes);if(!n&&j[r])return null;let a=te[r]||{net:0,vat:0,gross:0},o=n?a.net:Number(e.quantity||0)*Number(e.unit_price||0),s=Number(e.vat_rate??20),c=n?a.vat:s/100*o,l=n?a.gross:o+c;return[(0,x.jsxs)(`tr`,{style:{borderBottom:n?`2px solid #eab308`:`1px solid #f3f4f6`,background:n?`#fef3c7`:`transparent`,fontWeight:n?700:400},children:[(0,x.jsx)(`td`,{style:$.td,children:(0,x.jsx)(`span`,{style:{...$.itemInput,display:`inline-block`,width:`44px`,background:`#f9fafb`,textAlign:`center`},children:e.line_number||`-`})}),(0,x.jsx)(`td`,{style:$.td,children:(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[n&&(0,x.jsx)(`button`,{type:`button`,onClick:()=>ce(r),style:{border:`none`,background:`transparent`,cursor:`pointer`,fontWeight:700,color:`#92400e`},title:j[r]?`Alt kalemleri aç`:`Alt kalemleri kapat`,children:j[r]?`▶`:`▼`}),n&&(0,x.jsx)(`span`,{style:{fontSize:`11px`,background:`#f59e0b`,color:`#fff`,borderRadius:`999px`,padding:`2px 7px`,fontWeight:700},children:`Grup`}),(0,x.jsx)(`div`,{style:{width:`100%`},children:(0,x.jsx)(`input`,{style:$.itemInput,value:e.description,onChange:e=>ie(t,`description`,e.target.value),placeholder:`Kalem açıklaması`,required:t===0})})]})}),(0,x.jsx)(`td`,{style:$.td,children:n?``:(0,x.jsx)(`select`,{style:{...$.itemInput,width:`58px`},value:e.unit,onChange:e=>ie(t,`unit`,e.target.value),children:[`adet`,`m²`,`m³`,`m`,`kg`,`ton`,`set`,`mt`,`lt`].map(e=>(0,x.jsx)(`option`,{children:e},e))})}),(0,x.jsx)(`td`,{style:$.td,children:n?``:(0,x.jsx)(`input`,{type:`number`,min:`0`,step:`0.01`,style:{...$.itemInput,width:`64px`},value:e.quantity,onChange:e=>ie(t,`quantity`,Number(e.target.value))})}),(0,x.jsx)(`td`,{style:$.td,children:n?(0,x.jsx)(`span`,{style:{fontSize:`11px`,color:`#92400e`,fontWeight:700},children:`Grup Toplamı`}):(0,x.jsx)(`input`,{type:`number`,min:`0`,step:`0.01`,style:{...$.itemInput,width:`92px`},value:e.unit_price??``,onFocus:()=>{(e.unit_price??0)===0&&ie(t,`unit_price`,void 0)},onChange:e=>ie(t,`unit_price`,e.target.value===``?void 0:Number(e.target.value)),placeholder:`0.00`})}),(0,x.jsx)(`td`,{style:$.td,children:(0,x.jsx)(`span`,{style:{...$.td,fontWeight:600,fontSize:`13px`,whiteSpace:`nowrap`},children:o>0?`₺${o.toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`:`-`})}),(0,x.jsx)(`td`,{style:$.td,children:n?``:(0,x.jsx)(`select`,{style:{...$.itemInput,width:`82px`},value:e.vat_rate??20,onChange:e=>ie(t,`vat_rate`,Number(e.target.value)),children:N.map(e=>(0,x.jsxs)(`option`,{value:e,children:[`%`,e]},e))})}),(0,x.jsx)(`td`,{style:{...$.td,fontWeight:600,whiteSpace:`nowrap`},children:n||c>0?`₺${c.toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`:`-`}),(0,x.jsx)(`td`,{style:{...$.td,fontWeight:600,whiteSpace:`nowrap`},children:l>0?`₺${l.toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`:`-`}),(0,x.jsx)(`td`,{style:$.td,children:(0,x.jsx)(`button`,{type:`button`,onClick:()=>G(t),disabled:k.length===1,style:{padding:`4px 7px`,background:`#fee2e2`,color:`#dc2626`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`✕`})})]},`${t}-row`),n?null:(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #f3f4f6`},children:[(0,x.jsx)(`td`,{style:$.td}),(0,x.jsx)(`td`,{colSpan:8,style:{...$.td,paddingTop:`0px`},children:(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`180px 1fr`,gap:`10px`,alignItems:`start`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`input`,{type:`file`,accept:`image/*`,style:{...$.itemInput,padding:`4px`},onChange:e=>{let n=e.target.files?.[0];n&&ae(t,n)}}),i.imageUrl&&(0,x.jsxs)(`div`,{style:{marginTop:`6px`},children:[(0,x.jsx)(`img`,{src:i.imageUrl,alt:`Kalem görseli`,style:{width:`100%`,maxHeight:`100px`,objectFit:`cover`,borderRadius:`6px`,border:`1px solid #e5e7eb`}}),(0,x.jsx)(`button`,{type:`button`,style:{marginTop:`4px`,...$.itemInput,cursor:`pointer`,background:`#fff7ed`,borderColor:`#fdba74`,color:`#9a3412`},onClick:()=>ie(t,`notes`,Cs(i.detail,``)),children:`Görseli Kaldır`})]})]}),(0,x.jsx)(`textarea`,{style:{...$.itemInput,resize:`vertical`},rows:3,value:i.detail,onChange:e=>{ie(t,`notes`,Cs(e.target.value,i.imageUrl))},placeholder:`Ürün açıklaması (tedarikçide salt-okunur görünür)`})]})}),(0,x.jsx)(`td`,{style:$.td})]},`${t}-meta`)]})}),(0,x.jsxs)(`tfoot`,{children:[(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`10px 8px`,textAlign:`right`,fontSize:`13px`,fontWeight:700},children:`Ara Toplam:`}),(0,x.jsxs)(`td`,{style:{padding:`10px 4px`,fontWeight:700,fontSize:`14px`,color:`#1d4ed8`},children:[`₺`,ne.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(`td`,{})]}),(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`6px 8px`,textAlign:`right`,fontSize:`13px`,fontWeight:700},children:`Toplam KDV:`}),(0,x.jsxs)(`td`,{style:{padding:`6px 4px`,fontWeight:700,fontSize:`14px`,color:`#b45309`},children:[`₺`,re.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(`td`,{})]}),(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`6px 8px`,textAlign:`right`,fontSize:`13px`,fontWeight:700},children:`KDV Dahil Genel Toplam:`}),(0,x.jsxs)(`td`,{style:{padding:`6px 4px`,fontWeight:700,fontSize:`14px`,color:`#15803d`},children:[`₺`,W.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]}),(0,x.jsx)(`td`,{})]})]})]})}),(0,x.jsxs)(`div`,{style:{marginTop:`10px`,display:`flex`,gap:`8px`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:se,style:{padding:`7px 14px`,background:`#fef3c7`,color:`#92400e`,border:`1px dashed #f59e0b`,borderRadius:`6px`,cursor:`pointer`,fontSize:`13px`,fontWeight:700},children:`+ Grup Ekle`}),(0,x.jsx)(`button`,{type:`button`,onClick:oe,style:{padding:`7px 14px`,background:`#eff6ff`,color:`#2563eb`,border:`1px dashed #93c5fd`,borderRadius:`6px`,cursor:`pointer`,fontSize:`13px`,fontWeight:600},children:`+ Ürün Ekle`})]})]})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:()=>e(-1),style:$.btn(`#6b7280`),children:`İptal`}),(0,x.jsx)(`button`,{type:`submit`,disabled:F,style:$.btn(F?`#9ca3af`:`#10b981`),children:F?`Kaydediliyor...`:`Teklif Talebini Kaydet`})]})]})}function As({amount:e,percent:t}){if(e==null||e===0)return null;let n=e>0;return(0,x.jsxs)(`span`,{style:{display:`inline-block`,padding:`4px 8px`,borderRadius:`4px`,background:n?`#ecfdf5`:`#fef2f2`,color:n?`#10b981`:`#ef4444`,fontSize:`12px`,fontWeight:600},children:[n?`+`:`-`,`₺`,Math.abs(e).toLocaleString(`tr-TR`,{maximumFractionDigits:2}),t!=null&&` (${n?`+`:`-`}${Math.abs(t).toFixed(1)}%)`]})}function js({suppliers:e,onRequestRevision:t,onViewDetails:n,loading:r=!1,isAdmin:i=!1}){let[a,o]=(0,_.useState)(new Set(e.map(e=>e.supplier_id).slice(0,1))),s=e=>{o(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n})},c=e=>e?new Date(e).toLocaleString(`tr-TR`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}):``,l=e=>({tasarı:`Taslak`,gönderildi:`Gönderildi`,revize_edildi:`Revize İstendi`})[e]||e;return e.length===0?(0,x.jsx)(`div`,{style:{background:`white`,border:`1px solid #ddd`,borderRadius:`8px`,padding:`20px`,textAlign:`center`,color:`#666`},children:`Henüz tedarikçi teklifi alınmamıştır.`}):(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:e.map(e=>{let o=a.has(e.supplier_id),u=e.quotes[0];return(0,x.jsxs)(`div`,{style:{border:`1px solid #ddd`,borderRadius:`8px`,overflow:`hidden`,background:`white`},children:[(0,x.jsxs)(`div`,{onClick:()=>s(e.supplier_id),style:{padding:`16px`,background:`#f9fafb`,borderBottom:o?`1px solid #ddd`:`none`,cursor:`pointer`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,userSelect:`none`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h3`,{style:{margin:`0 0 8px 0`,fontSize:`16px`},children:e.supplier_name}),(0,x.jsxs)(`div`,{style:{fontSize:`13px`,color:`#666`},children:[(0,x.jsxs)(`div`,{children:[`En Son Teklif: ₺`,u?.total_amount.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]}),(0,x.jsxs)(`div`,{children:[`Durum: `,l(u?.status)]}),u?.profitability_amount&&i&&(0,x.jsxs)(`div`,{style:{marginTop:`4px`},children:[`Tasarruf: `,(0,x.jsx)(As,{amount:u.profitability_amount,percent:u.profitability_percent})]})]})]}),(0,x.jsx)(`div`,{style:{fontSize:`20px`,color:`#999`},children:o?`▼`:`▶`})]}),o&&(0,x.jsx)(`div`,{style:{padding:`16px`},children:e.quotes.map((a,o)=>(0,x.jsxs)(`div`,{style:{marginBottom:o<e.quotes.length-1?`16px`:0},children:[(0,x.jsxs)(`div`,{style:{padding:`12px`,background:`#fafafa`,borderRadius:`6px`,borderLeft:`4px solid #3b82f6`,marginBottom:`12px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`span`,{style:{fontWeight:600,fontSize:`14px`},children:a.revision_number===0?`İlk Teklif`:`${a.revision_number}. Revizyon`}),(0,x.jsx)(`span`,{style:{marginLeft:`8px`,fontSize:`13px`,color:`#666`},children:l(a.status)})]}),a.submitted_at&&(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#999`},children:c(a.submitted_at)})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,x.jsxs)(`span`,{style:{fontSize:`14px`,fontWeight:600},children:[`Toplam: ₺`,a.total_amount.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]}),a.profitability_amount&&i&&(0,x.jsx)(As,{amount:a.profitability_amount,percent:a.profitability_percent})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,x.jsx)(`button`,{onClick:()=>n(a.id,e.supplier_name),style:{padding:`6px 12px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:`13px`},children:`Göster`}),i&&a.revision_number===0&&(0,x.jsx)(`button`,{onClick:()=>t(a.id,e.supplier_name),disabled:r,style:{padding:`6px 12px`,background:`#f59e0b`,color:`white`,border:`none`,borderRadius:`4px`,cursor:r?`wait`:`pointer`,fontSize:`13px`,opacity:r?.6:1},children:`Revize İste`})]})]}),a.revisions&&a.revisions.length>0&&(0,x.jsx)(`div`,{style:{marginLeft:`16px`,paddingLeft:`12px`,borderLeft:`2px solid #e5e7eb`},children:a.revisions.map(t=>(0,x.jsxs)(`div`,{style:{padding:`12px`,background:`#f0fdf4`,borderRadius:`6px`,borderLeft:`4px solid #10b981`,marginBottom:`12px`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`span`,{style:{fontWeight:600,fontSize:`14px`,color:`#10b981`},children:[t.revision_number,`. Revizyon`]}),(0,x.jsx)(`span`,{style:{marginLeft:`8px`,fontSize:`13px`,color:`#666`},children:l(t.status)})]}),t.submitted_at&&(0,x.jsx)(`span`,{style:{fontSize:`12px`,color:`#999`},children:c(t.submitted_at)})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,x.jsxs)(`span`,{style:{fontSize:`14px`,fontWeight:600},children:[`Toplam: ₺`,t.total_amount.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]}),t.profitability_amount&&i&&(0,x.jsx)(As,{amount:t.profitability_amount,percent:t.profitability_percent})]}),(0,x.jsx)(`button`,{onClick:()=>n(t.id,e.supplier_name),style:{padding:`6px 12px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:`13px`},children:`Göster`})]},t.id))})]},a.id))})]},e.supplier_id)})})}function Ms({visible:e,supplierQuoteName:t,onClose:n,onSubmit:r,loading:i=!1}){let[a,o]=(0,_.useState)(``),[s,c]=(0,_.useState)(!1);return e?(0,x.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,right:0,bottom:0,background:`rgba(0, 0, 0, 0.5)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:1e3},children:(0,x.jsxs)(`div`,{style:{background:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`500px`,width:`90%`,boxShadow:`0 4px 6px rgba(0, 0, 0, 0.1)`},children:[(0,x.jsx)(`h2`,{style:{marginTop:0,marginBottom:`16px`},children:`Revize İste`}),(0,x.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,x.jsxs)(`p`,{style:{fontSize:`14px`,color:`#666`,marginBottom:`8px`},children:[(0,x.jsx)(`strong`,{children:`Tedarikçi:`}),` `,t]})}),(0,x.jsxs)(`div`,{style:{marginBottom:`16px`},children:[(0,x.jsx)(`label`,{style:{display:`block`,fontSize:`14px`,fontWeight:600,marginBottom:`8px`},children:`Revize Nedeni`}),(0,x.jsx)(`textarea`,{value:a,onChange:e=>o(e.target.value),placeholder:`Örn: Fiyatlar çok yüksek, lütfen indirim yapınız`,style:{width:`100%`,padding:`8px`,borderRadius:`4px`,border:`1px solid #ddd`,fontSize:`14px`,boxSizing:`border-box`,minHeight:`100px`,fontFamily:`inherit`}})]}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,justifyContent:`flex-end`},children:[(0,x.jsx)(`button`,{onClick:n,disabled:s||i,style:{padding:`8px 16px`,background:`#e5e7eb`,color:`#1f2937`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:`14px`},children:`İptal`}),(0,x.jsx)(`button`,{onClick:async()=>{if(!a.trim()){alert(`Lütfen revize nedenini giriniz`);return}c(!0);try{await r(a),o(``),n()}finally{c(!1)}},disabled:s||i,style:{padding:`8px 16px`,background:`#f59e0b`,color:`white`,border:`none`,borderRadius:`4px`,cursor:s||i?`wait`:`pointer`,fontSize:`14px`,opacity:s||i?.6:1},children:s||i?`Gönderiliyor...`:`Revize İste`})]})]})}):null}function Ns({visible:e,supplierQuoteName:t,items:n,onClose:r,onSubmit:i,loading:a=!1}){let[o,s]=(0,_.useState)({}),[c,l]=(0,_.useState)(!1);if((0,_.useEffect)(()=>{if(e&&Object.keys(o).length===0){let e={};n.forEach(t=>{e[t.quote_item_id]={unit_price:t.original_unit_price,total_price:t.original_total_price}}),s(e)}},[e]),!e)return null;let u=(e,t)=>{let r=n.find(t=>t.quote_item_id===e);if(!r)return;let i=t*(r.original_total_price/r.original_unit_price);s(n=>({...n,[e]:{unit_price:t,total_price:i}}))},d=(e,t)=>{let r=n.find(t=>t.quote_item_id===e);if(!r)return;let i=r.original_total_price/r.original_unit_price,a=i>0?t/i:0;s(n=>({...n,[e]:{unit_price:a,total_price:t}}))},f=()=>{let e=0;return n.forEach(t=>{let n=o[t.quote_item_id];n&&(e+=t.original_total_price-n.total_price)}),e},p=async()=>{let e=n.map(e=>({quote_item_id:e.quote_item_id,unit_price:o[e.quote_item_id]?.unit_price||0,total_price:o[e.quote_item_id]?.total_price||0}));l(!0);try{await i(e),s({}),r()}finally{l(!1)}},m=f();return(0,x.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,right:0,bottom:0,background:`rgba(0, 0, 0, 0.5)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:1e3,overflow:`auto`},children:(0,x.jsxs)(`div`,{style:{background:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`800px`,width:`90%`,boxShadow:`0 4px 6px rgba(0, 0, 0, 0.1)`,margin:`20px auto`},children:[(0,x.jsx)(`h2`,{style:{marginTop:0,marginBottom:`16px`},children:`Revize Teklif Gönder`}),(0,x.jsx)(`div`,{style:{marginBottom:`16px`,padding:`12px`,background:`#f3f4f6`,borderRadius:`4px`},children:(0,x.jsxs)(`p`,{style:{margin:0,fontSize:`14px`},children:[(0,x.jsx)(`strong`,{children:`Tedarikçi:`}),` `,t]})}),(0,x.jsx)(`div`,{style:{marginBottom:`16px`,overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`13px`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`,borderBottom:`1px solid #ddd`},children:[(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`left`},children:`Kalem`}),(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`right`},children:`İlk Birim Fiyat`}),(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`right`},children:`Revize Birim Fiyat`}),(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`right`},children:`İlk Toplam`}),(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`right`},children:`Revize Toplam`}),(0,x.jsx)(`th`,{style:{padding:`8px`,textAlign:`right`},children:`Tasarruf`})]})}),(0,x.jsx)(`tbody`,{children:n?.map(e=>{if(!e)return null;let t=o[e.quote_item_id],n=(e.original_total_price||0)-(t?.total_price||0);return(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #eee`},children:[(0,x.jsx)(`td`,{style:{padding:`8px`},children:e.item_description}),(0,x.jsxs)(`td`,{style:{padding:`8px`,textAlign:`right`},children:[`₺`,e.original_unit_price.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]}),(0,x.jsx)(`td`,{style:{padding:`8px`},children:(0,x.jsx)(`input`,{type:`number`,step:`0.01`,value:t?.unit_price||0,onChange:t=>u(e.quote_item_id,parseFloat(t.target.value)||0),style:{width:`100%`,padding:`4px`,border:`1px solid #ddd`,borderRadius:`3px`,textAlign:`right`}})}),(0,x.jsxs)(`td`,{style:{padding:`8px`,textAlign:`right`},children:[`₺`,e.original_total_price.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]}),(0,x.jsx)(`td`,{style:{padding:`8px`},children:(0,x.jsx)(`input`,{type:`number`,step:`0.01`,value:t?.total_price||0,onChange:t=>d(e.quote_item_id,parseFloat(t.target.value)||0),style:{width:`100%`,padding:`4px`,border:`1px solid #ddd`,borderRadius:`3px`,textAlign:`right`}})}),(0,x.jsxs)(`td`,{style:{padding:`8px`,textAlign:`right`,color:n>0?`#10b981`:n<0?`#ef4444`:`#666`,fontWeight:600},children:[n>0?`+`:``,`₺`,n.toLocaleString(`tr-TR`,{maximumFractionDigits:2})]})]},e.quote_item_id)})})]})}),(0,x.jsx)(`div`,{style:{padding:`12px`,background:m>0?`#ecfdf5`:`#fef2f2`,borderRadius:`4px`,marginBottom:`16px`,textAlign:`right`},children:(0,x.jsxs)(`span`,{style:{fontSize:`14px`,fontWeight:600,color:m>0?`#10b981`:`#ef4444`},children:[`Toplam Tasarruf: `,m>0?`+`:``,`₺`,Math.abs(m).toLocaleString(`tr-TR`,{maximumFractionDigits:2})]})}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,justifyContent:`flex-end`},children:[(0,x.jsx)(`button`,{onClick:r,disabled:c||a,style:{padding:`8px 16px`,background:`#e5e7eb`,color:`#1f2937`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontSize:`14px`},children:`İptal`}),(0,x.jsx)(`button`,{onClick:p,disabled:c||a,style:{padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:c||a?`wait`:`pointer`,fontSize:`14px`,opacity:c||a?.6:1},children:c||a?`Gönderiliyor...`:`Revize Teklif Gönder`})]})]})})}function Ps(e){let t=String(e).toLowerCase();return t===`approved`?`approved`:t===`rejected`?`rejected`:t===`submitted`||t===`sent`||t===`pending`||t===`responded`?`submitted`:`draft`}var Fs={inp:{width:`100%`,padding:`7px 9px`,border:`1px solid #d1d5db`,borderRadius:`5px`,fontSize:`14px`,boxSizing:`border-box`},cellInp:{width:`100%`,padding:`4px 6px`,border:`1px solid #d1d5db`,borderRadius:`4px`,fontSize:`13px`,boxSizing:`border-box`},label:{display:`block`,fontSize:`13px`,fontWeight:600,marginBottom:`4px`,color:`#374151`}},Is=e=>{if(!e)return{detail:``,imageUrl:``};try{let t=JSON.parse(e);return{detail:t.detail||``,imageUrl:t.image_url||``}}catch{return{detail:e,imageUrl:``}}},Ls=e=>{if(e.is_group_header)return!0;let t=String(e.line_number||``).trim();return t.length>0&&!t.includes(`.`)},Rs=e=>{let t=e.group_key;if(t)return String(t);let n=String(e.line_number||``).trim();return n?n.includes(`.`)?n.split(`.`)[0]:n:``},zs=e=>{let t={};return e.forEach(e=>{if(Ls(e))return;let n=Rs(e);if(!n)return;let r=Number(e.total_price??0)||Number(e.quantity||0)*Number(e.unit_price||0),i=r*(Number(e.vat_rate??20)/100);t[n]||(t[n]={net:0,vat:0,gross:0}),t[n].net+=r,t[n].vat+=i,t[n].gross+=r+i}),t},Bs=e=>{let t=0,n=``,r=0,i={};return e.map(e=>{if(Ls(e))return t+=1,n=String(t),i[n]=0,{...e,is_group_header:!0,group_key:n,line_number:n};let a=e.group_key||n;return a?(i[a]||(i[a]=0),i[a]+=1,{...e,is_group_header:!1,group_key:a,line_number:`${a}.${i[a]}`}):(r+=1,{...e,is_group_header:!1,group_key:void 0,line_number:String(r)})})};function Vs(){let{id:e}=r(),t=m(),[n,a]=i(),s=o(),{user:c}=b(),[l,u]=(0,_.useState)(null),[d,f]=(0,_.useState)([]),[p,h]=(0,_.useState)(!0),[g,v]=(0,_.useState)(null),[y,S]=(0,_.useState)(!1),[C,w]=(0,_.useState)({title:``,description:``}),[T,E]=(0,_.useState)([]),[D,O]=(0,_.useState)([1,10,20]),[k,A]=(0,_.useState)(``),[j,M]=(0,_.useState)({}),[N,P]=(0,_.useState)({}),[F,I]=(0,_.useState)([]),[L,R]=(0,_.useState)(!1),[z,B]=(0,_.useState)(null),[V,ee]=(0,_.useState)({visible:!1,supplierQuoteId:0,supplierName:``}),[H,te]=(0,_.useState)({visible:!1,supplierQuoteId:0,supplierName:``}),ne=(0,_.useRef)(null),U=(0,_.useRef)(!1),re=(0,_.useCallback)(()=>{let e=new URLSearchParams(n);e.delete(`action`),e.delete(`supplierQuoteId`),a(e,{replace:!0})},[n,a]),W=(0,_.useCallback)(async()=>{try{h(!0);let t=await gt(Number(e));u(t),w({title:t.title,description:t.description||``}),E(Bs((t.items||[]).map(e=>({line_number:e.line_number,category_code:e.category_code,category_name:e.category_name,group_key:e.group_key,is_group_header:e.is_group_header,description:e.description,unit:e.unit,quantity:Number(e.quantity),unit_price:e.unit_price==null?void 0:Number(e.unit_price),vat_rate:e.vat_rate==null?20:Number(e.vat_rate),notes:e.notes})))),f(await wt(Number(e)));try{R(!0),I(await Tt(Number(e)))}catch(e){console.warn(`Supplier quotes yüklenemedi:`,e),I([])}finally{R(!1)}}catch(e){v(e instanceof Error?e.message:`Veri yüklenemedi`)}finally{h(!1)}},[e]);(0,_.useEffect)(()=>{e&&W()},[e,W]),(0,_.useEffect)(()=>{_s().then(e=>{Array.isArray(e.vat_rates)&&e.vat_rates.length>0&&O(e.vat_rates)}).catch(()=>O([1,10,20]))},[]),(0,_.useEffect)(()=>{let e=n.get(`action`),t=Number(n.get(`supplierQuoteId`)||0);if(e!==`revize`){U.current=!1;return}if(!t||F.length===0||U.current)return;let r=e=>{for(let n of e){if(n.id===t)return n;if(n.revisions&&n.revisions.length>0){let e=r(n.revisions);if(e)return e}}return null};for(let e of F){let t=r(e.quotes);if(t){U.current=!0,ee({visible:!0,supplierQuoteId:t.id,supplierName:e.supplier_name});break}}},[n,F]);let ie=e=>{P(t=>({...t,[e]:!t[e]}))},ae=async()=>{if(!(!l||!C.title))try{let e=await yt(l.id,{title:C.title,description:C.description||void 0}),t=T.filter(e=>e.description.trim()||e.line_number.trim()).map(e=>{let t=Ls(e),n=Rs(e);return{...e,group_key:n||void 0,is_group_header:t,unit:t?``:e.unit,quantity:t?0:Number(e.quantity||0),unit_price:t||e.unit_price===void 0||e.unit_price===null||e.unit_price===0?void 0:Number(e.unit_price),vat_rate:Number(e.vat_rate??20)}});t.length>0||(l.items||[]).length>0?u(await vt(l.id,t)):u(e),S(!1)}catch(e){v(e instanceof Error?e.message:`Güncelleme başarısız`)}},oe=async()=>{if(!(!l||!window.confirm(`Teklifi silmek istediğinizden emin misiniz?`)))try{await bt(l.id),t(`/quotes`)}catch(e){v(e instanceof Error?e.message:`Silme başarısız`)}},se=async()=>{if(l)try{u(await xt(l.id,k?{reason:k}:void 0)),A(``),await W()}catch(e){v(e instanceof Error?e.message:`Gönderme başarısız`)}},G=async()=>{if(l)try{u(await St(l.id,k?{reason:k}:void 0)),A(``),await W()}catch(e){v(e instanceof Error?e.message:`Onay başarısız`)}},ce=async()=>{if(!(!l||!window.confirm(`Teklifi geri çevirmek istediğinizden emin misiniz?`)))try{u(await Ct(l.id,k?{reason:k}:void 0)),A(``),await W()}catch(e){v(e instanceof Error?e.message:`Reddetme başarısız`)}};if((0,_.useEffect)(()=>{if(!l)return;let e=Ps(l.status),t=c?.id===l.created_by_id,r=c?.role===`admin`||c?.role===`super_admin`,i=(t||r)&&e===`draft`,a=n.get(`edit`)===`1`||s.pathname.endsWith(`/edit`);i&&a&&S(!0)},[l,c,n,s.pathname]),p)return(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:20},children:`Yükleniyor...`});if(!l)return(0,x.jsx)(`div`,{style:{textAlign:`center`,padding:20},children:`Teklif bulunamadı`});let le=Ps(l.status),ue=c?.id===l.created_by_id,de=c?.role===`admin`||c?.role===`super_admin`,fe=(ue||de)&&le===`draft`,pe=(ue||de)&&le===`draft`,me=de&&le===`submitted`,he=de&&le===`submitted`,ge=l.items||[],_e=zs(ge);zs(T);let ve=ge.filter(e=>!Ls(e)).reduce((e,t)=>e+Number(t.total_price||0),0),ye=ge.filter(e=>!Ls(e)).reduce((e,t)=>e+Number(t.total_price||0)*Number(t.vat_rate||20)/100,0),be=ve+ye;return T.filter(e=>!Ls(e)).reduce((e,t)=>e+Number(t.quantity||0)*Number(t.unit_price||0),0)+T.filter(e=>!Ls(e)).reduce((e,t)=>e+Number(t.quantity||0)*Number(t.unit_price||0)*(Number(t.vat_rate??20)/100),0),(0,x.jsxs)(`div`,{style:{maxWidth:`900px`,margin:`0 auto`,padding:`20px`},children:[(0,x.jsx)(`button`,{onClick:()=>t(-1),style:{marginBottom:`16px`,padding:`8px 12px`,background:`#f3f4f6`,border:`1px solid #ddd`,borderRadius:`4px`,cursor:`pointer`},children:`← Geri`}),g&&(0,x.jsx)(`div`,{style:{color:`red`,padding:`12px`,background:`#fee2e2`,borderRadius:`4px`,marginBottom:`16px`},children:g}),(0,x.jsx)(`div`,{style:{background:`#f9fafb`,padding:`20px`,borderRadius:`8px`,marginBottom:`16px`},children:(0,x.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`start`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{style:{margin:`0 0 8px 0`},children:l.title}),(0,x.jsxs)(`p`,{style:{margin:`4px 0`,color:`#666`,fontSize:`14px`},children:[`Teklif ID: `,l.id,` • V`,l.version]})]}),(0,x.jsx)(`span`,{style:{padding:`8px 12px`,borderRadius:`4px`,background:kt[le],fontWeight:`bold`,fontSize:`14px`},children:Ot[le]})]})}),(0,x.jsxs)(`div`,{ref:ne,style:{background:`white`,border:`1px solid #ddd`,borderRadius:`8px`,padding:`20px`,marginBottom:`16px`},children:[(0,x.jsx)(`h3`,{style:{margin:`0 0 16px 0`},children:`Teklif Detayları`}),y?(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`,marginBottom:`16px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:Fs.label,children:`Başlık *`}),(0,x.jsx)(`input`,{style:Fs.inp,value:C.title,onChange:e=>w({...C,title:e.target.value})})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{style:Fs.label,children:`Açıklama`}),(0,x.jsx)(`input`,{style:Fs.inp,value:C.description,onChange:e=>w({...C,description:e.target.value}),placeholder:`İsteğe bağlı`})]})]}),(0,x.jsx)(`div`,{style:{padding:`12px`,borderRadius:`8px`,background:`#f9fafb`,color:`#4b5563`,marginBottom:`12px`,fontSize:`13px`},children:`Kalem düzenleme görünümü sadeleştirildi. Mevcut kalemleri aşağıda önizleme olarak görebilir, başlık ve açıklamayı güncelleyebilirsiniz.`}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`},children:[(0,x.jsx)(`button`,{type:`button`,onClick:ae,style:{padding:`8px 16px`,background:`#2563eb`,color:`white`,border:`none`,borderRadius:`6px`,cursor:`pointer`},children:`Kaydet`}),(0,x.jsx)(`button`,{type:`button`,onClick:()=>{S(!1),W()},style:{padding:`8px 16px`,background:`#e5e7eb`,color:`#111827`,border:`none`,borderRadius:`6px`,cursor:`pointer`},children:`Vazgeç`})]})]}):(0,x.jsx)(`div`,{style:{overflowX:`auto`},children:(0,x.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`13px`},children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{style:{background:`#f3f4f6`},children:[(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`left`},children:`Sıra`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`left`},children:`Açıklama`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`center`},children:`Birim`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`Miktar`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`Birim Fiyat`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`Birim Toplam Fiyat`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`KDV`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`KDV Tutar`}),(0,x.jsx)(`th`,{style:{padding:`10px`,textAlign:`right`},children:`KDV Dahil Toplam`})]})}),(0,x.jsx)(`tbody`,{children:(l.items||[]).map((e,t)=>{let n=Ls(e),r=Rs(e),i=Is(e.notes);if(!n&&N[r])return null;let a=_e[r]||{net:0,vat:0,gross:0},o=n?a.net:Number(e.total_price||0),s=Number(e.vat_rate||20),c=n?a.vat:s/100*o,l=n?a.gross:o+c;return(0,x.jsxs)(_.Fragment,{children:[(0,x.jsxs)(`tr`,{style:{borderBottom:n?`2px solid #eab308`:`1px solid #eee`,background:n?`#fef3c7`:`transparent`,fontWeight:n?700:400},children:[(0,x.jsx)(`td`,{style:{padding:`10px`},children:e.line_number||t+1}),(0,x.jsx)(`td`,{style:{padding:`10px`},children:(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,minWidth:0},children:[n&&(0,x.jsx)(`button`,{type:`button`,onClick:()=>ie(r),style:{border:`none`,background:`transparent`,cursor:`pointer`,fontWeight:700,color:`#92400e`,flexShrink:0},title:N[r]?`Alt kalemleri aç`:`Alt kalemleri kapat`,children:N[r]?`▶`:`▼`}),n&&(0,x.jsx)(`span`,{style:{fontSize:`11px`,background:`#f59e0b`,color:`#fff`,borderRadius:`999px`,padding:`2px 7px`,fontWeight:700,flexShrink:0},children:`Grup`}),(0,x.jsx)(`div`,{style:{minWidth:0,overflowWrap:`anywhere`},children:e.description})]})}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`center`},children:n?``:e.unit}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`},children:n?``:e.quantity}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`},children:n?(0,x.jsx)(`span`,{style:{fontSize:`11px`,color:`#92400e`,fontWeight:700},children:`Grup Toplamı`}):(0,x.jsx)(`span`,{children:o>0?`₺${Number(e.unit_price||0).toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`:``})}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`,fontWeight:`bold`},children:(0,x.jsxs)(`span`,{children:[`₺`,o.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`},children:n?``:`%${s}`}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`},children:`₺${c.toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`}),(0,x.jsx)(`td`,{style:{padding:`10px`,textAlign:`right`},children:`₺${l.toLocaleString(`tr-TR`,{minimumFractionDigits:2})}`})]}),n?null:(0,x.jsxs)(`tr`,{style:{borderBottom:`1px solid #f3f4f6`},children:[(0,x.jsx)(`td`,{style:{padding:`0 10px 10px`}}),(0,x.jsx)(`td`,{colSpan:8,style:{padding:`0 10px 10px`},children:(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:i.imageUrl?`180px minmax(0, 1fr)`:`minmax(0, 1fr)`,gap:`10px`,alignItems:`start`},children:[i.imageUrl&&(0,x.jsx)(`div`,{children:(0,x.jsx)(`a`,{href:i.imageUrl,target:`_blank`,rel:`noopener noreferrer`,title:`Görseli yeni sekmede aç`,children:(0,x.jsx)(`img`,{src:i.imageUrl,alt:`Kalem görseli`,style:{width:`100%`,maxHeight:`150px`,objectFit:`cover`,borderRadius:`6px`,border:`1px solid #e5e7eb`}})})}),(0,x.jsx)(`div`,{style:{fontSize:`12px`,color:`#6b7280`,whiteSpace:`pre-wrap`,overflowWrap:`anywhere`},children:i.detail||(i.imageUrl?`-`:``)})]})})]})]},e.id)})}),(0,x.jsxs)(`tfoot`,{children:[(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`10px`,textAlign:`right`,fontWeight:700},children:`Teklif Toplamı:`}),(0,x.jsxs)(`td`,{style:{padding:`10px`,textAlign:`right`,fontWeight:700},children:[`₺`,ve.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})]}),(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`10px`,textAlign:`right`,fontWeight:700},children:`KDV Toplamı:`}),(0,x.jsxs)(`td`,{style:{padding:`10px`,textAlign:`right`,fontWeight:700},children:[`₺`,ye.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})]}),(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{colSpan:8,style:{padding:`10px`,textAlign:`right`,fontWeight:700},children:`Genel Toplam (KDV Dahil):`}),(0,x.jsxs)(`td`,{style:{padding:`10px`,textAlign:`right`,fontWeight:700,color:`#15803d`},children:[`₺`,be.toLocaleString(`tr-TR`,{minimumFractionDigits:2})]})]})]})]})})]}),(fe||pe||me||he)&&(0,x.jsxs)(`div`,{style:{background:`white`,border:`1px solid #ddd`,borderRadius:`8px`,padding:`20px`,marginBottom:`16px`},children:[(0,x.jsx)(`h3`,{children:`İşlemler`}),fe&&(0,x.jsx)(`button`,{onClick:()=>{S(!0),ne.current?.scrollIntoView({behavior:`smooth`,block:`start`})},style:{marginRight:`8px`,marginBottom:`8px`,padding:`8px 16px`,background:`#3b82f6`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Düzenle`}),pe&&(0,x.jsxs)(`div`,{style:{marginBottom:`12px`},children:[(0,x.jsx)(`textarea`,{placeholder:`Onaya gönderme notu (opsiyonel)`,value:k,onChange:e=>A(e.target.value),style:{width:`100%`,padding:`8px`,borderRadius:`4px`,border:`1px solid #ddd`,marginBottom:`8px`,boxSizing:`border-box`}}),(0,x.jsx)(`button`,{onClick:se,style:{padding:`8px 16px`,background:`#f59e0b`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Onaya Gönder`})]}),me&&(0,x.jsxs)(`div`,{style:{marginBottom:`12px`},children:[(0,x.jsx)(`textarea`,{placeholder:`Onay notu (opsiyonel)`,value:k,onChange:e=>A(e.target.value),style:{width:`100%`,padding:`8px`,borderRadius:`4px`,border:`1px solid #ddd`,marginBottom:`8px`,boxSizing:`border-box`}}),(0,x.jsx)(`button`,{onClick:G,style:{marginRight:`8px`,padding:`8px 16px`,background:`#10b981`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Onayla`}),he&&(0,x.jsx)(`button`,{onClick:ce,style:{padding:`8px 16px`,background:`#ef4444`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Reddet`})]}),fe&&(0,x.jsx)(`button`,{onClick:oe,style:{marginTop:`8px`,padding:`8px 16px`,background:`#dc2626`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:`Sil`})]}),F.length>0&&(0,x.jsxs)(`div`,{style:{background:`white`,border:`1px solid #ddd`,borderRadius:`8px`,padding:`20px`,marginBottom:`16px`},children:[(0,x.jsx)(`h3`,{children:`Tedarikçi Teklifleri`}),(0,x.jsx)(js,{suppliers:F,onRequestRevision:async(e,t)=>{ee({visible:!0,supplierQuoteId:e,supplierName:t})},onViewDetails:e=>{let t=n=>{for(let r of n){if(r.id===e)return r;if(r.revisions&&r.revisions.length>0){let e=t(r.revisions);if(e)return e}}return null},n=null;for(let e of F)if(n=t(e.quotes),n)break;n&&B(n)},loading:L,isAdmin:de})]}),d.length>0&&(0,x.jsxs)(`div`,{style:{background:`white`,border:`1px solid #ddd`,borderRadius:`8px`,padding:`20px`},children:[(0,x.jsx)(`h3`,{children:`Durum Geçişi Geçmişi`}),(0,x.jsx)(`div`,{style:{fontSize:`14px`},children:d.map((e,t)=>(0,x.jsxs)(`div`,{style:{padding:`8px 0`,borderBottom:t<d.length-1?`1px solid #eee`:`none`},children:[(0,x.jsx)(`strong`,{children:e.from_status}),` → `,(0,x.jsx)(`strong`,{children:e.to_status}),(0,x.jsx)(`br`,{}),(0,x.jsx)(`small`,{style:{color:`#666`},children:new Date(e.created_at||e.changed_at||``).toLocaleString(`tr-TR`)})]},t))})]}),(0,x.jsx)(Ms,{visible:V.visible,supplierQuoteName:V.supplierName,onClose:()=>{ee({visible:!1,supplierQuoteId:0,supplierName:``}),re(),U.current=!1},onSubmit:async e=>{if(l)try{await Et(l.id,V.supplierQuoteId,e),alert(`Revize talebi gönderildi`),ee({visible:!1,supplierQuoteId:0,supplierName:``}),re(),U.current=!1,W()}catch(e){alert(`Revize talebi gönderilemedi: `+(e instanceof Error?e.message:`Bilinmeyen hata`))}},loading:L}),(0,x.jsx)(Ns,{visible:H.visible,supplierQuoteName:H.supplierName,items:z?.items?.map(e=>{let t=l?.items?.find(t=>t.id.toString()===e.quote_item_id.toString());return{quote_item_id:e.quote_item_id,original_unit_price:e.original_unit_price||t?.unit_price||0,original_total_price:e.original_total_price||t?.total_price||0,item_description:t?.description||`Bilinmeyen kalem`}})||[],onClose:()=>te({visible:!1,supplierQuoteId:0,supplierName:``}),onSubmit:async e=>{if(l)try{let t=await Dt(l.id,H.supplierQuoteId,e);alert(`Revize teklif gönderildi. Tasarruf: ₺${(t.profitability.amount||0).toLocaleString(`tr-TR`,{maximumFractionDigits:2})}`),te({visible:!1,supplierQuoteId:0,supplierName:``}),W()}catch(e){alert(`Revize teklif gönderilemedi: `+(e instanceof Error?e.message:`Bilinmeyen hata`))}},loading:L})]})}function Hs(){return(0,x.jsxs)(n,{children:[(0,x.jsx)(f,{path:`/login`,element:(0,x.jsx)(ee,{})}),(0,x.jsx)(f,{path:`/supplier/login`,element:(0,x.jsx)(De,{})}),(0,x.jsx)(f,{path:`/supplier/register`,element:(0,x.jsx)(Ie,{})}),(0,x.jsx)(f,{path:`/supplier/dashboard`,element:(0,x.jsx)(pt,{})}),(0,x.jsx)(f,{path:`/supplier/profile`,element:(0,x.jsx)(Ii,{})}),(0,x.jsx)(f,{path:`/supplier/finance`,element:(0,x.jsx)(Ki,{})}),(0,x.jsx)(f,{path:`/supplier/workspace`,element:(0,x.jsx)(Ea,{})}),(0,x.jsx)(f,{path:`/supplier/portal`,element:(0,x.jsx)(t,{to:`/supplier/workspace?tab=offers`,replace:!0})}),(0,x.jsx)(f,{path:`/supplier/email-change-confirm`,element:(0,x.jsx)(Aa,{})}),(0,x.jsx)(f,{element:(0,x.jsx)(S,{}),children:(0,x.jsxs)(f,{element:(0,x.jsx)(k,{}),children:[(0,x.jsx)(f,{path:`/dashboard`,element:(0,x.jsx)(wn,{})}),(0,x.jsx)(f,{path:`/quotes`,element:(0,x.jsx)(Mt,{})}),(0,x.jsx)(f,{path:`/quotes/create`,element:(0,x.jsx)(ks,{})}),(0,x.jsx)(f,{path:`/quotes/:id`,element:(0,x.jsx)(Vs,{})}),(0,x.jsx)(f,{path:`/quotes/:id/edit`,element:(0,x.jsx)(Vs,{})}),(0,x.jsx)(f,{path:`/403`,element:(0,x.jsx)(Pr,{})}),(0,x.jsxs)(f,{element:(0,x.jsx)(D,{permission:`view:admin`}),children:[(0,x.jsx)(f,{path:`/admin`,element:(0,x.jsx)(Mr,{})}),(0,x.jsx)(f,{path:`/admin/quotes`,element:(0,x.jsx)(zo,{})}),(0,x.jsx)(f,{path:`/admin/personnel/:id`,element:(0,x.jsx)(Bo,{})}),(0,x.jsx)(f,{path:`/admin/departments/:id`,element:(0,x.jsx)(Vo,{})}),(0,x.jsx)(f,{path:`/admin/companies/:id`,element:(0,x.jsx)(Ho,{})}),(0,x.jsx)(f,{path:`/admin/projects/:id`,element:(0,x.jsx)(hs,{})}),(0,x.jsx)(f,{path:`/admin/project-files/:projectId`,element:(0,x.jsx)(gs,{})}),(0,x.jsx)(f,{path:`/admin/suppliers/:id`,element:(0,x.jsx)(lo,{})}),(0,x.jsx)(f,{path:`/admin/suppliers/:id/finance`,element:(0,x.jsx)(bo,{})}),(0,x.jsx)(f,{path:`/admin/suppliers/:id/workspace`,element:(0,x.jsx)(Lo,{})})]}),(0,x.jsx)(f,{element:(0,x.jsx)(D,{permission:`view:reports`}),children:(0,x.jsx)(f,{path:`/reports`,element:(0,x.jsx)(Nr,{})})})]})}),(0,x.jsx)(f,{path:`/`,element:(0,x.jsx)(V,{})}),(0,x.jsx)(f,{path:`*`,element:(0,x.jsx)(t,{to:`/`,replace:!0})})]})}var Us=`pf_user`,Ws=`supplier_access_token`;function Gs(){let e=sessionStorage.getItem(Us);if(!e)return null;try{return JSON.parse(e)}catch{return sessionStorage.removeItem(Us),localStorage.removeItem(Us),null}}function Ks(e){return e.includes(`/supplier/`)||e.includes(`/supplier/register`)||e.includes(`/supplier/login`)?!0:!!L()}function qs({children:e}){let[t,n]=(0,_.useState)(null),[r,i]=(0,_.useState)(!0);(0,_.useEffect)(()=>{let e=!0;async function t(){try{let t=window.location.pathname;if(Ks(t)){if(!e)return;n(null);return}if(!U()){let t=W();if(!t){if(!e)return;n(null);return}let r=await me(t);re(r.accessToken),ie(r.refreshToken)}let r=Gs();r&&e&&n(r);let i=await pe();if(!e)return;n(i),sessionStorage.setItem(Us,JSON.stringify(i))}catch{if(!e)return;oe(),sessionStorage.removeItem(Us),localStorage.removeItem(Us),n(null)}finally{e&&i(!1)}}return t(),()=>{e=!1}},[]);let a=(0,_.useCallback)(async(e,t)=>{try{sessionStorage.removeItem(Ws),localStorage.removeItem(Ws);let r=await de(e,t);re(r.accessToken),ie(r.refreshToken);let i=await pe();n(i),sessionStorage.setItem(Us,JSON.stringify(i))}catch(e){throw console.error(`[AuthProvider] Login hatası:`,e),e}},[]),o=(0,_.useCallback)(()=>{he(),oe(),sessionStorage.removeItem(Us),localStorage.removeItem(Us),n(null),window.location.assign(`/login`)},[]),s=(0,_.useMemo)(()=>({user:t,loading:r,login:a,logout:o}),[t,r,a,o]);return(0,x.jsx)(y.Provider,{value:s,children:e})}var Js=({children:e})=>{let t=o(),[n,r]=(0,_.useState)(null),[i,a]=(0,_.useState)(!1),[s,c]=(0,_.useState)(null),l=(0,_.useCallback)(async()=>{try{a(!0),c(null);let e=await _s();r(e),console.log(`[SETTINGS] Settings yüklendi:`,e)}catch(e){let t=e instanceof Error?e.message:`Ayarlar yükleme hatası`;if((typeof e==`object`&&e&&`response`in e?e.response:void 0)?.status===401){console.log(`[SETTINGS] 401 - Token yok, silently skip`);return}c(t),console.error(`[SETTINGS] Yükleme hatası:`,e)}finally{a(!1)}},[]);(0,_.useEffect)(()=>{let e=t.pathname,n=e===`/login`||e===`/supplier/login`||e===`/supplier/register`,r=!!(U()||W());n||!r||R()||l()},[l,t.pathname]);let u={settings:n,loading:i,error:s,updateSettings:(0,_.useCallback)(async e=>{try{a(!0),c(null);let t=await vs(e);r(t),console.log(`[SETTINGS] Ayarlar güncellendi:`,t)}catch(e){throw c(e instanceof Error?e.message:`Ayarlar güncelleme hatası`),console.error(`[SETTINGS] Güncelleme hatası:`,e),e}finally{a(!1)}},[]),refreshSettings:(0,_.useCallback)(async()=>{try{a(!0);let e=await ys();r(e),console.log(`[SETTINGS] Ayarlar yenilendi:`,e)}catch(e){c(e instanceof Error?e.message:`Ayarlar yenileme hatası`),console.error(`[SETTINGS] Yenileme hatası:`,e)}finally{a(!1)}},[])};return(0,x.jsx)(Qn.Provider,{value:u,children:e})};async function Ys(){return(await G.get(`/users/profile`)).data}async function Xs(e){return(await G.put(`/users/profile`,e)).data}async function Zs(e,t){return(await G.post(`/users/profile/change-password`,{old_password:e,new_password:t})).data}var Qs=(0,_.createContext)({profile:null,loading:!1,error:null,refreshProfile:async()=>{},updateProfile:async()=>{},changePassword:async()=>{}});v.createRoot(document.getElementById(`root`)).render((0,x.jsx)(_.StrictMode,{children:(0,x.jsx)(d,{children:(0,x.jsx)(qs,{children:(0,x.jsx)(Js,{children:(0,x.jsx)(({children:e})=>{let[t,n]=(0,_.useState)(null),[r,i]=(0,_.useState)(!1),[a,o]=(0,_.useState)(null),s={profile:t,loading:r,error:a,refreshProfile:(0,_.useCallback)(async()=>{try{i(!0),o(null);let e=await Ys();n(e),console.log(`[PROFILE] Profile yüklendi:`,e)}catch(e){o(e instanceof Error?e.message:`Profil yükleme hatası`),console.error(`[PROFILE] Yükleme hatası:`,e)}finally{i(!1)}},[]),updateProfile:(0,_.useCallback)(async e=>{try{i(!0),o(null);let t=await Xs(e);n(t),console.log(`[PROFILE] Profil güncellendi:`,t)}catch(e){throw o(e instanceof Error?e.message:`Profil güncelleme hatası`),console.error(`[PROFILE] Güncelleme hatası:`,e),e}finally{i(!1)}},[]),changePassword:(0,_.useCallback)(async(e,t)=>{try{i(!0),o(null),await Zs(e,t),console.log(`[PROFILE] Şifre değiştirildi`)}catch(e){throw o(e instanceof Error?e.message:`Şifre değişme hatası`),console.error(`[PROFILE] Şifre değişme hatası:`,e),e}finally{i(!1)}},[])};return(0,x.jsx)(Qs.Provider,{value:s,children:e})},{children:(0,x.jsx)(Hs,{})})})})})}));