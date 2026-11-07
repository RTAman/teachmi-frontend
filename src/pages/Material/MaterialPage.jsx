import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { newKey } from '../../api/client';
import { messageFor } from '../../api/errors';
import { addConcept, createTextMaterial, getMaterial, updateConcept, uploadMaterial } from '../../api/materials';
import bubbleThinking from '../../assets/characters/bubble-thinking.svg';
import alertIcon from '../../assets/icons/alert.svg';
import checkIcon from '../../assets/icons/check-ok.svg';
import editLimeIcon from '../../assets/icons/edit-lime.svg';
import editIcon from '../../assets/icons/edit.svg';
import infoIcon from '../../assets/icons/info.svg';
import plusLimeIcon from '../../assets/icons/plus-lime.svg';
import uploadIcon from '../../assets/icons/upload.svg';
import { useAuth } from '../../auth/authContext';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import Skeleton from '../../components/Skeleton/Skeleton';
import StepBar from '../../components/StepBar/StepBar';
import ActiveSessionDialog from '../../learning/ActiveSessionDialog';
import useStartSession from '../../learning/useStartSession';
import ConceptSheet from './ConceptSheet';
import FileCard from './FileCard';
import {
  ACCEPTED_EXTENSIONS,
  ANALYSIS_STEPS,
  MAX_FILE_MB,
  SAMPLE_CONCEPTS,
  SAMPLE_FAILED_FILE,
  SAMPLE_FILE,
  SAMPLE_SUBJECT,
} from './materialSamples';
import styles from './Material.module.css';

const STEP_DELAY = 1200;
const POLL_DELAY = 2000;
const SKELETON_WIDTHS = [
  [166, 97],
  [200, 132],
  [137, 69],
];

const FAILURES = {
  format: { title: '지원하지 않는 파일 형식이에요', text: 'PDF, PPT, PPTX 파일만 분석할 수 있어요.' },
  size: { title: '파일 용량이 너무 커요', text: '용량을 줄이거나 공부할 부분만 나눠서 올려 주세요.' },
  no_text: {
    title: '자료에서 글자를 읽지 못했어요',
    text: '스캔한 이미지로 된 PDF이거나 파일이 손상됐을 수 있어요.',
  },
  analysis: { title: '자료를 분석하지 못했어요', text: '잠시 후 다시 올리거나 내용을 직접 붙여 넣어 주세요.' },
};

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function fileMeta(file) {
  if (!file.size) return '';
  const size = formatSize(file.size);
  return file.pages ? `${size} · ${file.pages}쪽` : size;
}

function checkFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) return 'PDF, PPT, PPTX 파일만 올릴 수 있어요.';
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `${MAX_FILE_MB}MB 이하 파일만 올릴 수 있어요.`;
  return '';
}

function toConcept(view) {
  return { id: view.conceptId, name: view.name, scope: view.scope, summary: view.scope, pages: view.location ?? '' };
}

function initialState(state) {
  if (state === 'analyzing') return { phase: 'analyzing', file: SAMPLE_FILE };
  if (state === 'failed') return { phase: 'failed', file: SAMPLE_FAILED_FILE };
  if (state === 'concepts') return { phase: 'concepts', file: SAMPLE_FILE };
  return { phase: 'select', file: null };
}

function uploadErrorMessage(error) {
  if (error.status === 404 || error.status === 405) return '파일 업로드는 아직 준비 중이에요. 내용을 직접 입력해 주세요.';
  return messageFor(error, '파일을 올리지 못했어요. 잠시 후 다시 시도해 주세요.');
}

export default function MaterialPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  const live = status === 'in';
  const [searchParams] = useSearchParams();
  const demoState = live ? null : searchParams.get('state');
  const shouldFail = searchParams.get('demo') === 'fail';
  const [{ phase, file }, setMaterial] = useState(() =>
    live && location.state?.materialId ? { phase: 'loading', file: null } : initialState(demoState),
  );
  const [materialId, setMaterialId] = useState(location.state?.materialId ?? null);
  const [failure, setFailure] = useState('no_text');
  const [analysisStep, setAnalysisStep] = useState(demoState === 'analyzing' ? 1 : 0);
  const [concepts, setConcepts] = useState(live ? [] : SAMPLE_CONCEPTS);
  const [selectedId, setSelectedId] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [sheet, setSheet] = useState(null);
  const inputRef = useRef(null);
  const keyRef = useRef(null);
  const starter = useStartSession();

  const applyMaterial = useCallback((view) => {
    setMaterialId(view.materialId);
    const name = view.fileName ?? view.title ?? '내 자료';
    if (view.status === 'done') {
      setConcepts(view.concepts.map(toConcept));
      setMaterial({ phase: 'concepts', file: { name, size: 0, title: view.title, direct: view.sourceType === 'text' } });
    } else if (view.status === 'failed') {
      setFailure(view.errorCode || 'analysis');
      setMaterial({ phase: 'failed', file: { name, size: 0 } });
    } else {
      setMaterial((current) => ({ phase: 'analyzing', file: current.file ?? { name, size: 0 } }));
    }
  }, []);

  useEffect(() => {
    if (!live || phase !== 'loading' || !materialId) return undefined;
    let active = true;
    getMaterial(materialId)
      .then((view) => active && applyMaterial(view))
      .catch(() => active && setMaterial({ phase: 'select', file: null }));
    return () => {
      active = false;
    };
  }, [live, phase, materialId, applyMaterial]);

  useEffect(() => {
    if (phase !== 'analyzing' || demoState === 'analyzing') return undefined;
    const timer = setTimeout(() => {
      if (live) {
        if (analysisStep < ANALYSIS_STEPS.length - 1) setAnalysisStep(analysisStep + 1);
        return;
      }
      if (shouldFail && analysisStep === 0) {
        setMaterial((current) => ({ ...current, phase: 'failed' }));
      } else if (analysisStep < ANALYSIS_STEPS.length - 1) {
        setAnalysisStep(analysisStep + 1);
      } else {
        setConcepts(SAMPLE_CONCEPTS);
        setSelectedId(null);
        setMaterial((current) => ({ ...current, phase: 'concepts' }));
      }
    }, STEP_DELAY);
    return () => clearTimeout(timer);
  }, [live, phase, analysisStep, shouldFail, demoState]);

  useEffect(() => {
    if (!live || phase !== 'analyzing' || !materialId) return undefined;
    let active = true;
    const timer = setInterval(() => {
      getMaterial(materialId)
        .then((view) => active && view.status !== 'analyzing' && applyMaterial(view))
        .catch(() => {});
    }, POLL_DELAY);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [live, phase, materialId, applyMaterial]);

  async function startAnalysis(nextFile) {
    const error = checkFile(nextFile);
    setFileError(error);
    if (error) {
      setMaterial({ phase: 'select', file: null });
      return;
    }
    setAnalysisStep(0);
    if (!live) {
      setMaterial({ phase: 'analyzing', file: { name: nextFile.name, size: nextFile.size } });
      return;
    }
    setUploading(true);
    try {
      const created = await uploadMaterial(nextFile, newKey());
      setMaterialId(created.materialId);
      setMaterial({ phase: 'analyzing', file: { name: nextFile.name, size: nextFile.size } });
      if (created.status && created.status !== 'analyzing') applyMaterial(created);
    } catch (err) {
      setFileError(uploadErrorMessage(err));
      setMaterial({ phase: 'select', file: null });
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setFileError('');
    setAnalysisStep(0);
    setMaterialId(null);
    setSelectedId(null);
    setMaterial({ phase: 'select', file: null });
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event) {
    const [picked] = event.target.files;
    event.target.value = '';
    if (picked) startAnalysis(picked);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    const [dropped] = event.dataTransfer.files;
    if (dropped) startAnalysis(dropped);
  }

  function handleBack() {
    if (phase === 'select' || phase === 'loading') navigate('/home');
    else reset();
  }

  async function saveLive({ name, scope, content }) {
    if (sheet.mode === 'edit') {
      const changes = {};
      if (name !== sheet.concept.name) changes.name = name;
      if (scope !== sheet.concept.scope) changes.scope = scope;
      if (Object.keys(changes).length > 0) {
        const updated = await updateConcept(materialId, sheet.concept.id, changes);
        setConcepts((list) => list.map((item) => (item.id === updated.conceptId ? toConcept(updated) : item)));
      }
      return;
    }
    if (!keyRef.current) keyRef.current = newKey();
    if (sheet.mode === 'add') {
      const added = await addConcept(materialId, { name, scope, evidenceText: content }, keyRef.current);
      keyRef.current = null;
      setConcepts((list) => [toConcept(added), ...list]);
      setSelectedId(added.conceptId);
      return;
    }
    const material = await createTextMaterial({ text: content, concept: { name, scope } }, keyRef.current);
    keyRef.current = null;
    setSheet(null);
    const [concept] = material.concepts;
    await starter.start({ materialId: material.materialId, conceptId: concept.conceptId, subject: material.title });
    return 'skip-close';
  }

  async function handleSave(values) {
    if (!live) {
      saveDemo(values);
      return '';
    }
    try {
      const result = await saveLive(values);
      if (result !== 'skip-close') setSheet(null);
      return '';
    } catch (err) {
      if (err.status !== 0) keyRef.current = null;
      return messageFor(err, '저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  function saveDemo({ name, scope }) {
    if (sheet.mode === 'edit') {
      setConcepts((list) =>
        list.map((item) => (item.id === sheet.concept.id ? { ...item, name, scope, summary: scope } : item)),
      );
      setSheet(null);
      return;
    }
    const id = `custom-${Date.now()}`;
    const added = { id, name, scope, summary: scope, pages: '' };
    setSheet(null);
    if (sheet.mode === 'direct') {
      navigate('/learn/mode', { state: { concept: added } });
      return;
    }
    setConcepts((list) => [added, ...list]);
    setSelectedId(id);
  }

  function handleContinue() {
    const concept = concepts.find((item) => item.id === selectedId);
    if (!live) {
      navigate('/learn/mode', { state: { concept } });
      return;
    }
    starter.start({ materialId, conceptId: concept.id, subject: file?.title });
  }

  const selectedConcept = concepts.find((item) => item.id === selectedId);
  const isDirect = Boolean(file?.direct);
  const failureText = FAILURES[failure] ?? FAILURES.analysis;

  let content;
  let footer = (
    <BottomCTA>
      <Button disabled={!selectedConcept || starter.starting} onClick={handleContinue}>
        {starter.starting ? '학습을 준비하고 있어요...' : '선택한 개념으로 계속하기'}
      </Button>
    </BottomCTA>
  );

  if (phase === 'loading') {
    content = (
      <div className={styles.stack} aria-label="자료를 불러오는 중">
        <Skeleton height={54} radius={16} />
        <Skeleton width="70%" height={24} radius={6} />
        <Skeleton height={76} radius={16} />
        <Skeleton height={76} radius={16} />
      </div>
    );
  }

  if (phase === 'select') {
    content = (
      <div className={styles.selectPage}>
        <div>
          <h2 className={styles.heading}>어떤 자료로 공부할까요?</h2>
          <p className={styles.subheading}>강의 PDF나 PPT 파일 하나를 올려 주세요.</p>
        </div>
        <div>
          <button
            type="button"
            className={`${styles.drop} ${dragging ? styles.dragging : ''}`}
            onClick={openFilePicker}
            disabled={uploading}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            aria-describedby={fileError ? 'file-error' : undefined}
          >
            <span className={styles.dropIcon}>
              <img src={uploadIcon} alt="" width="26" height="26" />
            </span>
            <span className={styles.dropTitle}>{uploading ? '파일을 올리고 있어요' : '파일 선택하기'}</span>
            <span className={styles.dropHint}>PDF · PPT · PPTX · 최대 {MAX_FILE_MB}MB</span>
            <span className={styles.dropPill}>내 파일에서 찾기</span>
          </button>
          {fileError && (
            <div className={styles.fileError}>
              <InlineError id="file-error">{fileError}</InlineError>
            </div>
          )}
        </div>
        <p className={styles.or}>또는</p>
        <Button variant="secondary" size="md" onClick={() => setSheet({ mode: 'direct' })}>
          <img src={editIcon} alt="" width="18" height="18" />
          파일 없이 직접 입력하기
        </Button>
        {starter.error && <InlineError>{starter.error}</InlineError>}
        <div className={styles.info}>
          <img src={infoIcon} alt="" width="20" height="20" />
          <p>한 번의 학습은 개념 하나만 다뤄요. 자료가 길어도 그중 하나를 고르게 돼요.</p>
        </div>
      </div>
    );
  }

  if (phase === 'analyzing') {
    const progress = [20, 59, 90][analysisStep];
    content = (
      <div className={styles.stack}>
        <FileCard name={file.name} meta={fileMeta(file)} onRemove={reset} removeLabel="업로드 취소" />
        <section className={styles.card} aria-live="polite">
          <div className={styles.reading}>
            <img src={bubbleThinking} alt="" width="40" height="40" />
            <div>
              <h2 className={styles.readingTitle}>AI 학생이 자료를 읽고 있어요</h2>
              <p className={styles.readingSub}>잠시만 기다려 주세요</p>
            </div>
          </div>
          <div
            className={styles.progress}
            role="progressbar"
            aria-label="자료 분석 진행"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <ol className={styles.checks}>
            {ANALYSIS_STEPS.map((step, index) => {
              const stepStatus = index < analysisStep ? 'done' : index === analysisStep ? 'current' : 'todo';
              return (
                <li key={step.todo} className={styles[stepStatus]}>
                  <span className={styles.dot}>
                    {stepStatus === 'done' && <img src={checkIcon} alt="" width="14" height="14" />}
                  </span>
                  {step[stepStatus]}
                </li>
              );
            })}
          </ol>
        </section>
        <p className={styles.extractedLabel}>추출된 개념</p>
        <div className={styles.skeletons} aria-hidden="true">
          {SKELETON_WIDTHS.map(([title, sub]) => (
            <div key={title} className={styles.skeleton}>
              <Skeleton width={20} height={20} radius={10} />
              <div className={styles.skeletonLines}>
                <Skeleton width={title} height={10} radius={5} />
                <Skeleton width={sub} height={8} radius={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'failed') {
    content = (
      <div className={styles.stack}>
        <FileCard name={file.name} meta="분석 실패" failed onRemove={reset} removeLabel="파일 지우기" />
        <section className={`${styles.card} ${styles.failCard}`}>
          <img className={styles.failIcon} src={alertIcon} alt="" width="52" height="52" />
          <h2 className={styles.failTitle}>{failureText.title}</h2>
          <p className={styles.failText}>{failureText.text}</p>
          <div className={styles.tips}>
            <p className={styles.tipsTitle}>이렇게 해 보세요</p>
            <ol>
              <li>
                <span>1</span>글자를 선택할 수 있는 PDF로 다시 저장해서 올리기
              </li>
              <li>
                <span>2</span>공부할 내용을 복사해서 직접 붙여 넣기
              </li>
            </ol>
          </div>
        </section>
      </div>
    );
    footer = (
      <BottomCTA stacked>
        <Button onClick={() => setSheet({ mode: 'direct' })}>학습 내용 직접 입력</Button>
        <Button variant="secondary" onClick={openFilePicker}>
          다른 파일 올리기
        </Button>
      </BottomCTA>
    );
  }

  if (phase === 'concepts') {
    const subject = file?.title ?? (live ? '' : SAMPLE_SUBJECT);
    content = (
      <div className={styles.conceptStack}>
        <FileCard name={isDirect ? '직접 입력한 내용' : file.name} compact />
        <div className={styles.conceptIntro}>
          <h2 className={styles.conceptHeading}>설명할 개념을 하나 골라 주세요</h2>
          <p className={styles.subheading}>
            자료에서 개념 {concepts.length}개를 찾았어요{subject ? ` · ${subject}` : ''}
          </p>
        </div>
        <fieldset className={styles.options}>
          <legend className={styles.hidden}>설명할 개념</legend>
          {concepts.map((concept) => {
            const selected = concept.id === selectedId;
            return (
              <div key={concept.id} className={`${styles.option} ${selected ? styles.optionOn : ''}`}>
                <label className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="concept"
                    value={concept.id}
                    checked={selected}
                    onChange={() => setSelectedId(concept.id)}
                    className={styles.radio}
                  />
                  <span className={styles.optionText}>
                    <span className={styles.optionTop}>
                      <span className={styles.optionName}>{concept.name}</span>
                      {concept.pages && <span className={styles.pages}>{concept.pages}</span>}
                    </span>
                    <span className={styles.optionSummary}>{concept.summary}</span>
                  </span>
                </label>
                {selected && (
                  <button type="button" className={styles.editButton} onClick={() => setSheet({ mode: 'edit', concept })}>
                    <img src={editLimeIcon} alt="" width="18" height="18" />
                    이름·범위 수정
                  </button>
                )}
              </div>
            );
          })}
        </fieldset>
        <button type="button" className={styles.addButton} onClick={() => setSheet({ mode: 'add' })}>
          <img src={plusLimeIcon} alt="" width="20" height="20" />
          목록에 없는 개념 직접 입력
        </button>
        {starter.error && <InlineError>{starter.error}</InlineError>}
      </div>
    );
  }

  return (
    <AppShell
      header={
        <>
          <AppBar title="학습 자료 등록" onBack={handleBack} />
          <StepBar current={1} label="자료 선택" />
        </>
      }
      footer={footer}
      fill={phase === 'select'}
    >
      {content}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.ppt,.pptx"
        className={styles.hidden}
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />
      <ConceptSheet mode={sheet?.mode} concept={sheet?.concept} onClose={() => setSheet(null)} onSave={handleSave} />
      <ActiveSessionDialog
        conflict={starter.conflict}
        starting={starter.starting}
        onReplace={starter.replace}
        onResume={starter.resume}
        onClose={starter.dismiss}
      />
    </AppShell>
  );
}
