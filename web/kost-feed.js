'use strict';
(() => {
  const form=document.getElementById('bankFeedForm');
  if (!form) return;
  const section=document.createElement('article');section.className='panel';
  const title=document.createElement('h4');title.textContent='Ringkasan CHARISNA KOST';
  const info=document.createElement('p');info.textContent='Masukkan kode privat dari Pengaturan KOST → Ringkasan bulanan. Angka ini tampil sebagai ringkasan bisnis terkait.';
  const input=document.createElement('input');input.type='password';input.autocomplete='off';input.className='input';input.setAttribute('aria-label','Kode privat KOST');
  const connect=document.createElement('button');connect.type='button';connect.className='button primary';connect.textContent='Hubungkan dan sinkronkan';
  const disconnect=document.createElement('button');disconnect.type='button';disconnect.className='button';disconnect.textContent='Putuskan koneksi lokal';
  const output=document.createElement('div');output.setAttribute('role','status');
  section.append(title,info,input,connect,disconnect,output);form.closest('article').after(section);
  const decode=value=>{
    if (value.stringValue!==undefined) return value.stringValue;
    if (value.integerValue!==undefined) return Number(value.integerValue);
    if (value.doubleValue!==undefined) return value.doubleValue;
    if (value.timestampValue!==undefined) return value.timestampValue;
    if (value.arrayValue) return (value.arrayValue.values||[]).map(decode);
    if (value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields||{}).map(([key,item])=>[key,decode(item)]));
    return null;
  };
  let pending=false;
  async function sync() {
    if (pending || !state || !vault || !state.settings?.kostFeedToken) return;
    pending=true;
    try {
      const token=state.settings.kostFeedToken;
      if (!/^[a-f0-9]{64}$/.test(token)) throw Error('Kode KOST tidak valid.');
      const response=await fetch('https://firestore.googleapis.com/v1/projects/charisna-kost-manager/databases/(default)/documents/moneyFeeds/'+token,{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw Error('Ringkasan belum tersedia, kedaluwarsa atau koneksi dicabut.');
      const document=await response.json();const data=decode({mapValue:{fields:document.fields}});
      if (!Array.isArray(data.properties)) throw Error('Format ringkasan tidak valid.');
      output.replaceChildren();
      const heading=document.createElement('p');heading.textContent='Bulan '+data.month+' · diperbarui '+data.updatedAt;output.append(heading);
      for (const property of data.properties) {
        const row=document.createElement('p');
        const money=amount=>Number(amount).toLocaleString('id-ID');
        row.textContent=property.name+' · Pendapatan Rp '+money(property.income)+' · Pengeluaran Rp '+money(property.expense)+' · Bersih Rp '+money(property.net)+' · Kamar '+property.occupiedRooms+'/'+property.totalRooms;
        output.append(row);
      }
    } catch(error) {output.textContent=error.message;}
    finally {pending=false;}
  }
  connect.onclick=async()=>{
    if (!state || !vault) {output.textContent='Buka brankas terlebih dahulu.';return;}
    const token=input.value.trim();
    if (!/^[a-f0-9]{64}$/.test(token)) {output.textContent='Kode harus 64 karakter dari KOST.';return;}
    connect.disabled=true;
    try {state.settings ||= {};state.settings.kostFeedToken=token;await encryptState();input.value='';await sync();}
    catch(error){output.textContent=error.message;}
    finally{connect.disabled=false;}
  };
  disconnect.onclick=async()=>{
    if (!state || !vault) return;
    delete state.settings.kostFeedToken;await encryptState();output.textContent='Koneksi lokal diputus. Cabut kode dari KOST untuk menghentikan akses seluruh perangkat.';
  };
  window.addEventListener('online',()=>void sync());
  setInterval(()=>void sync(),60000);
  void sync();
})();
