import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, collection, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const status = document.getElementById('cloudStatus');
const configReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('PASTE_') && firebaseConfig.projectId && !firebaseConfig.projectId.includes('PASTE_');
if (!configReady) { if(status) status.textContent='Cloud sync: Firebase setup required'; }
else {
  try {
    const app = initializeApp(firebaseConfig); const dbCloud = getFirestore(app); const auth=getAuth(app);
    if(status) status.textContent='Cloud sync: connecting…';
    let unsubscribers=[];
    const keys=['notices','events','complaints','lost','faculty','emergency','locations'];
    onAuthStateChanged(auth, async user=>{
      if(!user){try{await signInAnonymously(auth)}catch(e){if(status)status.textContent='Cloud sync: anonymous sign-in required';console.error(e)}return}
      window.CampusCloud={uid:user.uid,submitStudentRecord:async (key,record,isUpdate=false)=>{
        if(!['complaints','lost'].includes(key))throw new Error('Student submissions are only enabled for complaints and Lost & Found.');
        const id=String(record.id||`${key}_${Date.now()}`);
        if(isUpdate && record.ownerId && record.ownerId!==user.uid)throw new Error('This record belongs to another browser account.');
        const safe={...record,id,ownerId:user.uid,updatedAt:new Date().toISOString()};
        await setDoc(doc(dbCloud,'portalContent',key,'items',id),safe,{merge:!!isUpdate});
        return id;
      }};
      onSnapshot(doc(dbCloud,'portalMeta','settings'), metaSnap => {
        unsubscribers.forEach(fn=>fn()); unsubscribers=[];
        if(!metaSnap.exists() || metaSnap.data().initialized !== true) { if(status) status.textContent='Cloud sync: waiting for admin setup'; return; }
        keys.forEach(key=>{
          const unsub=onSnapshot(collection(dbCloud,'portalContent',key,'items'), snap=>{
            const records=snap.docs.map(d=>({...d.data(),id:d.id}));
            if(window.applyCloudData) window.applyCloudData(key,records);
          },err=>{ if(status) status.textContent='Cloud sync: permission/config error'; console.error(err); });
          unsubscribers.push(unsub);
        });
        if(status) status.textContent='Cloud sync: live';
      },err=>{ if(status) status.textContent='Cloud sync: permission/config error'; console.error(err); });
    });
  } catch(e) { if(status) status.textContent='Cloud sync: failed to start'; console.error(e); }
}
