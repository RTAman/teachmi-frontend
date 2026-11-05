import { useState } from 'react';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import Button from '../../components/Button/Button';
import TextField from '../../components/TextField/TextField';
import styles from './Material.module.css';

const TITLES = {
  edit: '학습 개념 수정',
  add: '학습 개념 직접 입력',
  direct: '학습 내용 직접 입력',
};

function ConceptForm({ mode, concept, onCancel, onSave }) {
  const [name, setName] = useState(concept?.name ?? '');
  const [scope, setScope] = useState(concept?.scope ?? '');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const contentRequired = mode === 'direct';

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!name.trim()) next.name = '개념 이름을 입력해 주세요.';
    if (!scope.trim()) next.scope = '학습 범위를 입력해 주세요.';
    if (contentRequired && !content.trim()) next.content = '공부할 내용을 붙여 넣어 주세요.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave({ name: name.trim(), scope: scope.trim(), content: content.trim() });
  }

  return (
    <form className={styles.sheetForm} onSubmit={handleSubmit} noValidate>
      <TextField
        label="개념 이름"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        maxLength={40}
      />
      <TextField
        label="학습 범위"
        required
        multiline
        value={scope}
        onChange={(event) => setScope(event.target.value)}
        error={errors.scope}
        hint="범위가 넓으면 개념 하나로 좁혀 주세요. 예) 감가상각 전체 → 정액법 계산"
        maxLength={200}
      />
      <TextField
        label={
          <>
            자료 내용 붙여 넣기 <span className={styles.labelNote}>(파일 없이 진행할 때)</span>
          </>
        }
        required={contentRequired}
        multiline
        value={content}
        onChange={(event) => setContent(event.target.value)}
        error={errors.content}
        placeholder="강의 노트나 교재 내용을 붙여 넣어 주세요"
      />
      <div className={styles.sheetActions}>
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
}

export default function ConceptSheet({ mode, concept, onClose, onSave }) {
  return (
    <BottomSheet open={Boolean(mode)} onClose={onClose} title={TITLES[mode] ?? ''}>
      {mode && (
        <ConceptForm
          key={`${mode}-${concept?.id ?? 'new'}`}
          mode={mode}
          concept={concept}
          onCancel={onClose}
          onSave={onSave}
        />
      )}
    </BottomSheet>
  );
}
