'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { UploadCloud, Loader, CheckCircle2, FileDown, FileSpreadsheet, AlertTriangle, Eye, Terminal, RotateCcw } from 'lucide-react';
import { uploadZip, pollJobStatus, getConsolidatedUrl, getPdfsUrl } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [uiState, setUiState] = useState('idle');
  const [jobId, setJobId] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [logs, setLogs] = useState([]);
  const [processingPct, setProcessingPct] = useState(0);
  const inputRef = useRef(null);
  const cancelPollRef = useRef(null);
  const logRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.zip')) startProcess(f);
  };

  const handleSelect = (e) => {
    const f = e.target.files[0];
    if (f) startProcess(f);
  };

  const startProcess = useCallback(async (selectedFile) => {
    setFile(selectedFile);
    setUiState('uploading');
    setErrorMsg('');
    setLogs([]);
    setUploadProgress(0);
    setProcessingPct(0);

    try {
      // 1. Upload
      const { job_id } = await uploadZip(selectedFile, (pct) => {
        setUploadProgress(pct);
      });
      setJobId(job_id);
      setUiState('processing');

      // 2. Poll
      cancelPollRef.current = pollJobStatus(job_id, (status) => {
        if (status.status === 'processing') {
          setProcessingPct(status.progress?.percentage || 0);
          if (status.message) {
            setLogs(prev => {
              // Avoid duplicate consecutive logs
              if (prev[prev.length - 1] !== status.message) {
                return [...prev, status.message];
              }
              return prev;
            });
          }
        } else if (status.status === 'completed') {
          setProcessingPct(100);
          setJobResult(status);
          setUiState('success');
        } else if (status.status === 'error' || status.status === 'failed') {
          setErrorMsg(status.message || 'Erro desconhecido');
          setUiState('error');
        }
      });

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Falha no envio');
      setUiState('error');
    }
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const handleRetry = () => {
    if (cancelPollRef.current) cancelPollRef.current();
    setUiState('idle'); setJobId(null); setJobResult(null);
    setFile(null); setErrorMsg(''); setLogs([]); setProcessingPct(0);
  };

  return (
    <div className={styles.page}>

      {/* ─── Header ─── */}
      <header className={styles.header}>
        <img src="/logo-sbacem.jpg" alt="SBACEM" className={styles.logoImg} />
      </header>

      {/* ─── Main ─── */}
      <main className={styles.main}>
        <div className={styles.container}>

          {/* ═══ IDLE ═══ */}
          {uiState === 'idle' && (
            <>
              <div className={styles.hero}>
                <h1 className={styles.heading}>Distribuição de Direitos</h1>
                <p className={styles.sub}>Envie o arquivo ZIP de distribuição para gerar os relatórios.</p>
              </div>

              <div className={styles.card}>
                <div
                  className={`${styles.dropzone} ${dragging ? styles.dropActive : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                >
                  <input ref={inputRef} type="file" accept=".zip" onChange={handleSelect} className={styles.hidden} />
                  <UploadCloud size={48} strokeWidth={0.9} className={styles.dropIcon} />
                  <span className={styles.dropMain}>
                    {dragging ? 'Solte aqui' : 'Arraste o arquivo ZIP ou clique para selecionar'}
                  </span>
                  <span className={styles.dropHint}>Aceita arquivos .zip</span>
                </div>
              </div>
            </>
          )}

          {/* ═══ UPLOADING ═══ */}
          {uiState === 'uploading' && (
            <div className={styles.centerBlock}>
              <div className={styles.orbitWrap}>
                <div className={styles.orbit1} />
                <div className={styles.orbit2} />
                <div className={styles.orbit3} />
                <div className={styles.orbitCore}>
                  <UploadCloud size={26} strokeWidth={1.5} className={styles.orbitIcon} />
                </div>
              </div>
              <h2 className={styles.loadTitle}>Enviando arquivo...</h2>
              <div className={styles.barWrap}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className={styles.barPct}>{uploadProgress}%</span>
              </div>
              <p className={styles.loadSub}>{file?.name}</p>
            </div>
          )}

          {/* ═══ PROCESSING ═══ */}
          {uiState === 'processing' && (
            <div className={styles.centerBlock}>
              <div className={styles.orbitWrap}>
                <div className={styles.orbit1} />
                <div className={styles.orbit2} />
                <div className={styles.orbit3} />
                <div className={styles.orbitCore}>
                  <Loader size={26} className={styles.spinIcon} />
                </div>
              </div>
              <h2 className={styles.loadTitle}>Processando dados</h2>
              <div className={styles.pctBig}>{processingPct}%</div>
              <div className={styles.barWrap}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${processingPct}%` }} />
                </div>
              </div>

              {logs.length > 0 && (
                <div className={styles.logBox}>
                  <div className={styles.logHead}>
                    <Terminal size={12} strokeWidth={2} />
                    <span>Log</span>
                  </div>
                  <div className={styles.logBody} ref={logRef}>
                    {logs.map((l, i) => (
                      <div key={i} className={styles.logLine}>
                        <span className={styles.logN}>{String(i + 1).padStart(2, '0')}</span>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ ERROR ═══ */}
          {uiState === 'error' && (
            <div className={styles.centerBlock}>
              <AlertTriangle size={44} strokeWidth={1.2} className={styles.errIcn} />
              <h2 className={styles.errTitle}>Erro no processamento</h2>
              <p className={styles.errMsg}>{errorMsg}</p>
              <button className={styles.retryBtn} onClick={handleRetry}>
                <RotateCcw size={15} strokeWidth={2} /> Tentar novamente
              </button>
            </div>
          )}

          {/* ═══ SUCCESS ═══ */}
          {uiState === 'success' && jobResult && (
            <div className={styles.centerBlock}>
              <div className={styles.successPop}>
                <CheckCircle2 size={52} strokeWidth={1} className={styles.successIcn} />
              </div>
              <h2 className={styles.successTitle}>Concluído</h2>
              <p className={styles.successSub}>
                {jobResult.total_holders || '—'} titular(es) processado(s).
                {jobResult.total_pdfs ? ` ${jobResult.total_pdfs} relatório(s) gerado(s).` : ''}
              </p>

              <div className={styles.dlStack}>
                <a href={getPdfsUrl(jobId)} className={styles.dlPrimary} download>
                  <FileDown size={18} strokeWidth={1.8} /> Baixar Relatórios (ZIP)
                </a>
                <a href={getConsolidatedUrl(jobId)} className={styles.dlSecondary} download>
                  <FileSpreadsheet size={18} strokeWidth={1.8} /> Baixar Consolidado
                </a>
              </div>

              <button className={styles.newBtn} onClick={handleRetry}>
                <RotateCcw size={14} strokeWidth={2} /> Novo processamento
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <span>Desenvolvido por: </span>
        <a href="https://www.codebypatrick.dev/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          Patrick.Developer
        </a>
      </footer>
    </div>
  );
}
