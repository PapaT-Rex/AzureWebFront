
import React, { useEffect, useState } from 'react'

export default function Admin(){
  const [skus, setSkus] = useState('')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const archive = async () => {
    const list = skus.split(/\s*,\s*/).filter(Boolean)
    const r = await fetch('/api/admin-archive', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ skus: list })
    })
    const j = await r.json()
    setMessage(`Archived: ${j.archived?.join(', ')}`)
  }

  const uploadExcel = async () => {
    if(!file){ setMessage('Choose an Excel file'); return }
    // Get SAS for inventory container
    const sas = await (await fetch('/api/get-upload-sas')).json()
    const url = sas.url // SAS URL for inventory container
    const blobName = `inventory_${Date.now()}.xlsx`
    const putUrl = `${url}&comp=block&blockid=ignored`
    // Use simple PUT to container with SAS: alternatively use Azure JS SDK
    const arrayBuffer = await file.arrayBuffer()
    const uploadUrl = `${url}&restype=container&comp=metadata` // placeholder
    // For brevity, use fetch to upload directly to a blob path constructed server-side in SAS response
    const upload = await fetch(sas.uploadUrl.replace('{blobName}', blobName), { method: 'PUT', body: new Uint8Array(arrayBuffer), headers:{'x-ms-blob-type':'BlockBlob'} })
    if(upload.ok){ setMessage(`Uploaded ${blobName}. Blob-trigger will ingest.`) } else { setMessage('Upload failed.') }
  }

  return (
    <div style={{maxWidth:800, margin:'0 auto'}}>
      <h1>Admin</h1>
      <section>
        <h2>Bulk Archive</h2>
        <p>Enter SKUs (comma-separated) to archive.</p>
        <input style={{width:'100%'}} value={skus} onChange={e=>setSkus(e.target.value)} placeholder="SKU-001,SKU-002" />
        <button onClick={archive} style={{marginTop:8}}>Archive Selected</button>
      </section>
      <section style={{marginTop:24}}>
        <h2>Bulk Upload Inventory (Excel)</h2>
        <input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files[0])} />
        <button onClick={uploadExcel} style={{marginLeft:8}}>Upload</button>
      </section>
      {message && <p style={{marginTop:16}}>{message}</p>}
    </div>
  )
}
