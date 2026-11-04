'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, LoginResult } from '../lib/api';
import Link from 'next/link';
export default function Login(){const router=useRouter();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{
 const response=await fetch(`${API_URL}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
 const data=await response.json() as LoginResult & {message?:string};if(!response.ok)throw new Error(data.message||'No fue posible ingresar');
 if(data.user.role==='admin')throw new Error('El panel administrativo no está disponible en este prototipo');
 sessionStorage.setItem('fixya_token',data.accessToken);sessionStorage.setItem('fixya_user',JSON.stringify(data.user));
 router.replace(data.user.role==='client'?'/cliente/solicitudes':'/tecnico/solicitudes');
}catch(e){setError(e instanceof Error?e.message:'Error desconocido');}finally{setBusy(false)}}
return <main className="page-center"><section className="auth-card"><Link className="brand" href="/">fix<span>ya.</span></Link><p className="eyebrow">BIENVENIDO A FIXYA</p><h1>Inicia sesión</h1><p className="muted">Accede para publicar o atender solicitudes.</p><form className="form" onSubmit={submit}><label>Correo electrónico<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Contraseña<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="error">{error}</p>}<button disabled={busy} className="primary">{busy?'Ingresando…':'Ingresar'}</button></form><p>¿No tienes cuenta? <Link href="/registro">Regístrate</Link></p></section></main>}
