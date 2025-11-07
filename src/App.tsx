import React, { useRef, useState } from 'react'
import type { DB } from './types'
import { loadDB, exportJSON, importJSON, clearDB } from './storage'
import MatchForm from './components/MatchForm'
import RecordsTable from './components/RecordsTable'
import PlayerManager from './components/PlayerManager'
import Standings from './components/Standings'

type TabKey = 'create' | 'rank' | 'records' | 'players'

export default function App() {
  const [db, setDB] = useState<DB>(()=> loadDB())
  const [tab, setTab] = useState<TabKey>('create')
  const fileRef = useRef<HTMLInputElement>(null)

  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'tt-records.json'; a.click()
    URL.revokeObjectURL(url)
  }
  const doImport = async (file: File) => {
    const text = await file.text()
    importJSON(text)
    setDB(loadDB())
    alert('匯入完成')
  }
  const doClear = () => {
    if (!confirm('確定要清空所有資料？')) return
    clearDB(); setDB(loadDB())
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="h1">桌球對戰戰績</div>
          <div className="muted">本地儲存・可匯出/匯入 JSON・記錄對戰與排行榜</div>
        </div>
        <div className="toolbar">
          <button className="btn" onClick={doExport}>⬇ 匯出</button>
          <label className="btn" style={{cursor:'pointer'}}>
            ⬆ 匯入
            <input ref={fileRef} type="file" accept="application/json" style={{display:'none'}} onChange={e=>{
              const f = e.target.files?.[0]; if (f) doImport(f)
              if (fileRef.current) fileRef.current.value = ''
            }} />
          </label>
          <button className="btn danger" onClick={doClear}>🗑 清空</button>
        </div>
      </header>

      <nav className="tabs" style={{marginTop:12}}>
        <button className={tab==='create'?'tab active':'tab'} onClick={()=>setTab('create')}>🕒 記錄比賽</button>
        <button className={tab==='rank'?'tab active':'tab'} onClick={()=>setTab('rank')}>📈 排行榜</button>
        <button className={tab==='records'?'tab active':'tab'} onClick={()=>setTab('records')}>📝 對戰紀錄</button>
        <button className={tab==='players'?'tab active':'tab'} onClick={()=>setTab('players')}>👤 球員管理</button>
      </nav>

      <main style={{marginTop:12}}>
        {tab==='create' && <MatchForm db={db} setDB={setDB} />}
        {tab==='rank' && <Standings db={db} />}
        {tab==='records' && <RecordsTable db={db} setDB={setDB} />}
        {tab==='players' && <PlayerManager db={db} setDB={setDB} />}
      </main>

      <footer>Made for Oscar · Local-first · {new Date().getFullYear()}</footer>
    </div>
  )
}
